"""Periksa hasil render deck 11 slide: teks per halaman, halaman kosong,
tinta di margin, dan tumpang tindih kotak teks pada file .pptx.

Jalankan: python output/source/check_11.py   (atau path sesuai lokasi)
"""
import sys
from pathlib import Path

import fitz
from pptx import Presentation
from pptx.util import Emu

PPTX = Path(r"D:\Wargaja\presentation\Wargaja_Presentasi_Warga.pptx")
PDF = Path(r"D:\Wargaja\presentation\Wargaja_Presentasi_Warga.pdf")

EXPECT = [
    "wargaja",
    "apa itu wargaja",
    "kenapa kita perlu satu tempat",
    "yang bisa dilakukan warga dan pengurus",
    "gambaran tampilan aplikasi",
    "alur iuran yang lebih rapi",
    "surat, dokumen, dan cara mengajukannya",
    "cara mulai dan yang perlu disiapkan",
    "peran pengguna dan data warga",
    "sudah tersedia, dan manfaatnya",
    "rencana bertahap dan penutup",
]

MARGIN = 0.5


def norm(t):
    return " ".join(t.lower().split())


def main():
    fail = []
    doc = fitz.open(PDF)
    if doc.page_count != len(EXPECT):
        fail.append(f"PDF {doc.page_count} halaman, seharusnya {len(EXPECT)}")
    for i, want in enumerate(EXPECT, 1):
        if i > doc.page_count:
            break
        page = doc[i - 1]
        text = norm(page.get_text())
        if want not in text:
            fail.append(f"halaman {i}: teks tidak ditemukan: {want!r}")
        if len(text.strip()) < 25:
            fail.append(f"halaman {i}: teks hampir kosong")
        # tinta di margin (kecuali halaman sampul).
        # Latar deck bukan putih murni, jadi warna latar diambil dari piksel
        # sudut halaman lebih dulu; "tinta" = piksel yang jelas berbeda dari latar.
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        w_px, h_px, n = pix.width, pix.height, pix.n
        s = pix.samples

        def px(x, y):
            o = y * pix.stride + x * n
            return s[o], s[o + 1], s[o + 2]

        bg = px(2, 2)
        margin_px = int(MARGIN * 72 * 2)
        edge_ink = 0
        for y in range(0, h_px, 2):
            for x in range(0, w_px, 2):
                if x >= margin_px and x <= w_px - margin_px and y >= margin_px and y <= h_px - margin_px:
                    continue
                r, g, b = px(x, y)
                if abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2]) > 60:
                    edge_ink += 1
        if edge_ink > 120 and i != 1:
            fail.append(f"halaman {i}: ada tinta di zona margin ({edge_ink} titik)")

    # tumpang tindih kotak teks di file pptx
    prs = Presentation(str(PPTX))
    for idx, slide in enumerate(prs.slides, 1):
        boxes = []
        for sh in slide.shapes:
            if sh.has_text_frame and sh.text_frame.text.strip():
                boxes.append((Emu(sh.left).inches, Emu(sh.top).inches,
                              Emu(sh.width).inches, Emu(sh.height).inches,
                              sh.text_frame.text.strip()[:24]))
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                ax, ay, aw, ah, at = boxes[i]
                bx, by, bw, bh, bt = boxes[j]
                if ax < bx + bw - 0.02 and bx < ax + aw - 0.02 and ay < by + bh - 0.02 and by < ay + ah - 0.02:
                    fail.append(f"slide {idx}: kotak teks bertumpuk {at!r} <-> {bt!r}")

    print(f"slide pptx : {len(prs.slides._sldIdLst)}")
    print(f"halaman PDF: {doc.page_count}")
    print()
    if fail:
        print(f"TEMUAN ({len(fail)}):")
        for f in fail:
            print(" -", f)
        return 1
    print("LULUS: 11 slide, semua teks tergambar, tidak ada halaman kosong,")
    print("tidak ada tinta di zona margin, tidak ada kotak teks bertumpuk.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
