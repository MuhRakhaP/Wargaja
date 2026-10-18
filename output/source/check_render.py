"""Periksa hasil render deck Wargaja (PDF + PNG).

Menggantikan pemeriksaan "mata" di lingkungan tanpa input gambar. Yang diukur:

  1. PDF punya 12 halaman dan tiap halaman memuat teks yang seharusnya;
  2. tidak ada halaman hampir kosong atau terlalu penuh;
  3. batas tinta sebenarnya (dari piksel, bukan line-box font) ada di dalam
     margin 0,5 inci — kecuali di halaman yang memang punya bidang dekoratif
     yang sengaja memotong tepi (piringan oranye di halaman 1 dan 11), dan di
     situ pun sisi kiri dan atas tetap wajib di dalam margin;
  4. tidak ada kata terlarang yang muncul di render.

Jalankan: python output/source/check_render.py
"""
import sys
from pathlib import Path

import fitz

PDF = Path(r"D:\Wargaja\output\wargaja-presentasi-rtrw.pdf")
RENDER = Path(r"D:\Wargaja\output\render")

EXPECT = [
    ["kelola rt/rw dengan mudah", "tersedia di android, ios, dan web"],
    ["masalah yang sering terjadi", "catatan iuran masih manual"],
    ["perkenalan wargaja", "wargaja menyatukan iuran"],
    ["iuran: catat dan pantau", "tempat tangkapan layar"],
    ["pengumuman dan kegiatan warga", "jadwal gotong royong"],
    ["data warga dan laporan", "laporan lebih cepat"],
    ["cara mulai: tiga langkah mudah", "mulai pakai"],
    ["manfaat untuk pengurus dan warga", "iuran tidak perlu antre"],
    ["keamanan dan privasi data warga", "hanya pengurus terkait"],
    ["rencana penerapan", "[minggu 2-3]"],
    ["terima kasih", "sesi tanya jawab"],
    ["cadangan: tanya jawab", "lupa kata sandi"],
]

FORBIDDEN = ["rukunin", "nestara", "wargaaja", "enkripsi", "lorem", "ipsum", "todo"]

# halaman dengan bidang dekoratif yang sengaja memotong tepi kanan/bawah
BLEED_PAGES = {1, 11}

MARGIN_IN = 0.5


def norm(t):
    return " ".join(t.lower().split())


def ink_bbox(page, dpi_scale=2.0):
    """Batas tinta nyata halaman, dalam inci."""
    pix = page.get_pixmap(matrix=fitz.Matrix(dpi_scale, dpi_scale), alpha=False)
    w_px, h_px, n = pix.width, pix.height, pix.n
    s = pix.samples
    min_x, min_y, max_x, max_y = w_px, h_px, -1, -1
    for y in range(0, h_px, 2):
        row = y * pix.stride
        for x in range(0, w_px, 2):
            o = row + x * n
            if s[o] < 245 or s[o + 1] < 245 or s[o + 2] < 245:
                if x < min_x:
                    min_x = x
                if y < min_y:
                    min_y = y
                if x > max_x:
                    max_x = x
                if y > max_y:
                    max_y = y
    if max_x < 0:
        return None
    return (min_x / dpi_scale / 72.0, min_y / dpi_scale / 72.0,
            max_x / dpi_scale / 72.0, max_y / dpi_scale / 72.0)


def main():
    if not PDF.is_file():
        print("PDF tidak ada:", PDF)
        return 1

    doc = fitz.open(PDF)
    fail = []
    notes = []

    if doc.page_count != len(EXPECT):
        fail.append(f"PDF {doc.page_count} halaman, seharusnya {len(EXPECT)}")

    whole = ""
    for i, want in enumerate(EXPECT, 1):
        if i > doc.page_count:
            break
        page = doc[i - 1]
        text = norm(page.get_text())
        whole += " " + text
        for w in want:
            if w not in text:
                fail.append(f"halaman {i}: teks tidak ditemukan: {w!r}")
        if len(text.strip()) < 25:
            fail.append(f"halaman {i}: teks hampir kosong")

        page_w = page.rect.width / 72.0
        page_h = page.rect.height / 72.0
        box = ink_bbox(page)
        if box is None:
            fail.append(f"halaman {i}: tidak ada tinta sama sekali")
            continue
        x0, y0, x1, y1 = box
        frac = 100.0 * ((x1 - x0) * (y1 - y0)) / (page_w * page_h)
        if frac > 95:
            fail.append(f"halaman {i}: tinta menutup {frac:.0f}% halaman")

        # sisi kiri & atas selalu wajib di dalam margin
        if x0 < MARGIN_IN - 0.02:
            fail.append(f"halaman {i}: tinta masuk margin kiri ({x0:.2f}\")")
        if y0 < MARGIN_IN - 0.02:
            fail.append(f"halaman {i}: tinta masuk margin atas ({y0:.2f}\")")

        if i in BLEED_PAGES:
            notes.append(
                f"halaman {i}: bidang dekoratif memotong tepi "
                f"(kanan {page_w - x1:.2f}\", bawah {page_h - y1:.2f}\") — disengaja; "
                f"kiri {x0:.2f}\" dan atas {y0:.2f}\" tetap di dalam margin")
        else:
            if x1 > page_w - MARGIN_IN + 0.02:
                fail.append(f"halaman {i}: tinta masuk margin kanan ({page_w - x1:.2f}\")")
            if y1 > page_h - MARGIN_IN + 0.02:
                fail.append(f"halaman {i}: tinta masuk margin bawah ({page_h - y1:.2f}\")")

    for bad in FORBIDDEN:
        if bad in whole:
            fail.append(f"kata terlarang muncul di render: {bad!r}")

    pngs = sorted(RENDER.glob("slide-*.png"))
    if len(pngs) != len(EXPECT):
        fail.append(f"PNG render: {len(pngs)} berkas, seharusnya {len(EXPECT)}")

    print(f"halaman PDF      : {doc.page_count}")
    print(f"PNG hasil render : {len(pngs)}")
    print()
    for n in notes:
        print("catatan:", n)
    if notes:
        print()
    if fail:
        print(f"TEMUAN ({len(fail)}):")
        for f in fail:
            print(" -", f)
        return 1
    print("RENDER LULUS: 12 halaman, semua teks tergambar, tidak ada halaman kosong,")
    print("seluruh tinta di dalam margin 0,5\" (kecuali bidang dekoratif yang disengaja),")
    print("dan tidak ada kata terlarang.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
