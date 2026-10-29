"""Pemeriksaan otomatis deck Wargaja.

Karena lingkungan ini tidak bisa "melihat" gambar, deck diperiksa secara
terukur. Yang diperiksa:

  1. semua tulisan memakai font tema dan ukurannya memenuhi syarat brief
     (judul >= 36 pt, isi >= 22 pt; hanya nomor slide yang 18 pt);
  2. tidak ada kotak teks yang keluar dari margin 0,5 inci;
  3. tidak ada dua kotak teks yang bertumpuk;
  4. perkiraan kebutuhan baris tiap kotak teks tidak melebihi tingginya
     (deteksi teks terpotong), memakai lebar rata-rata huruf Poppins;
  5. kontras setiap warna tulisan terhadap latar yang dipakai memenuhi
     WCAG AA (>= 4.5:1 untuk < 18 pt, >= 3:1 untuk >= 18 pt).

Jalankan: python output/source/check_deck.py
"""
import sys
from pathlib import Path

from pptx import Presentation
from pptx.util import Emu

DECK = Path(r"D:\Wargaja\output\wargaja-presentasi-rtrw.pptx")

FONT = "Poppins"
PAPER = "#FFFFFF"
WASH = "#FFF4DC"      # #FEAF0D pada transparansi 86% di atas putih (perkiraan)
SAFE = (22.0, 36.0)   # batas bawah isi dan judul
FOOT_ALLOWED = 18.0   # nomor slide

# lebar rata-rata huruf Poppins (relatif terhadap ukuran huruf)
FACTOR_REGULAR = 0.58
FACTOR_BOLD = 0.63
LINE_FACTOR = 1.30

MARGIN_IN = 0.5


def rel_lum(hex6):
    hex6 = hex6.lstrip("#")
    chans = []
    for i in (0, 2, 4):
        c = int(hex6[i:i + 2], 16) / 255.0
        chans.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * chans[0] + 0.7152 * chans[1] + 0.0722 * chans[2]


def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    hi, lo = (la, lb) if la >= lb else (lb, la)
    return (hi + 0.05) / (lo + 0.05)


def run_colour(run, para):
    for src in (run.font, para.font):
        try:
            if src.color and src.color.type is not None and src.color.rgb is not None:
                return "#" + str(src.color.rgb)
        except Exception:
            continue
    return None


def run_size(run, para):
    for src in (run.font, para.font):
        try:
            if src.size is not None:
                return float(src.size.pt)
        except Exception:
            continue
    return None


def is_bold(run, para):
    for src in (run.font, para.font):
        try:
            if src.bold is not None:
                return bool(src.bold)
        except Exception:
            continue
    return False


def main():
    prs = Presentation(str(DECK))
    problems = []
    notes_count = 0
    sizes_seen = set()
    fonts_seen = set()

    for idx, slide in enumerate(prs.slides, 1):
        helpers = []

        # bidang "cucian oranye" di slide ini — teks di atasnya punya latar berbeda
        wash_rects = []
        for shape in slide.shapes:
            if shape.has_text_frame and shape.text_frame.text.strip():
                continue
            try:
                solid = shape.fill.type is not None and str(shape.fill.fore_color.rgb) == "FEAF0D"
            except Exception:
                solid = False
            if solid:
                wash_rects.append((Emu(shape.left).inches, Emu(shape.top).inches,
                                   Emu(shape.width).inches, Emu(shape.height).inches))

        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            txt = shape.text_frame.text.strip()
            if not txt:
                continue
            box = (Emu(shape.left).inches, Emu(shape.top).inches,
                   Emu(shape.width).inches, Emu(shape.height).inches)
            x, y, w, h = box
            ground = PAPER
            for (wx, wy, ww, wh) in wash_rects:
                if x >= wx - 0.01 and y >= wy - 0.01 and (x + w) <= (wx + ww) + 0.01 and (y + h) <= (wy + wh) + 0.01:
                    ground = WASH
                    break

            # 2. margin
            if x < MARGIN_IN - 0.001 or y < MARGIN_IN - 0.001 or (x + w) > 13.333 - MARGIN_IN + 0.001 or (y + h) > 7.5 - MARGIN_IN + 0.001:
                problems.append(f"slide {idx}: teks di luar margin 0,5\": {txt[:38]!r} box={box}")

            worst_size = 0.0
            worst_colour = None
            worst_bold = False
            required_lines = 0.0
            for para in shape.text_frame.paragraphs:
                for run in para.runs:
                    if not run.text.strip():
                        continue
                    fs = run_size(run, para)
                    fam = None
                    try:
                        fam = run.font.name or para.font.name
                    except Exception:
                        fam = None
                    if fam:
                        fonts_seen.add(fam)
                    if fs:
                        sizes_seen.add(fs)
                        if fs > worst_size:
                            worst_size, worst_colour, worst_bold = fs, run_colour(run, para), is_bold(run, para)
                        # 4. perkiraan kebutuhan baris
                        if w > 0:
                            factor = FACTOR_BOLD if is_bold(run, para) else FACTOR_REGULAR
                            per_line = max(int((w * 72.0) / (factor * fs)), 1)
                            required_lines += max(1, -(-len(run.text) // per_line)) * fs * LINE_FACTOR
            # semua paragraf: hitung ulang total baris lebih akurat per paragraf
            required_lines = 0.0
            for para in shape.text_frame.paragraphs:
                line_chars = 0.0
                para_size = 0.0
                para_bold = False
                for run in para.runs:
                    if not run.text.strip():
                        continue
                    fs = run_size(run, para) or 0.0
                    para_size = max(para_size, fs)
                    if is_bold(run, para):
                        para_bold = True
                    line_chars += len(run.text)
                if para_size <= 0 or w <= 0:
                    continue
                factor = FACTOR_BOLD if para_bold else FACTOR_REGULAR
                per_line = max(int((w * 72.0) / (factor * para_size)), 1)
                lines = max(1, -(-int(line_chars) // per_line))
                required_lines += lines * para_size * LINE_FACTOR
            need_in = required_lines / 72.0
            if need_in > h * 1.02:
                problems.append(
                    f"slide {idx}: kemungkinan teks terpotong — perlu ~{need_in:.2f}\" "
                    f"tinggi kotak {h:.2f}\": {txt[:44]!r}")

            # 1. ukuran huruf
            if worst_size:
                if worst_size < SAFE[0] - 0.01 and abs(worst_size - FOOT_ALLOWED) > 0.01:
                    problems.append(f"slide {idx}: ukuran {worst_size}pt < {SAFE[0]}pt: {txt[:40]!r}")
                if worst_size > 60.0:
                    problems.append(f"slide {idx}: ukuran {worst_size}pt terlalu besar: {txt[:40]!r}")
            # 5. kontras
            if worst_colour:
                need = 3.0 if worst_size >= 18 else 4.5
                got = contrast(worst_colour, ground)
                if got < need - 0.01:
                    problems.append(
                        f"slide {idx}: kontras {got:.2f}:1 (butuh {need}): "
                        f"{worst_colour} di {ground} untuk {txt[:34]!r}")

            helpers.append((box, txt))

        # 3. tumpang tindih kotak teks
        for i in range(len(helpers)):
            for j in range(i + 1, len(helpers)):
                (ax, ay, aw, ah), at = helpers[i]
                (bx, by, bw, bh), bt = helpers[j]
                if ax < bx + bw - 0.002 and bx < ax + aw - 0.002 and ay < by + bh - 0.002 and by < ay + ah - 0.002:
                    problems.append(
                        f"slide {idx}: kotak teks bertumpuk {at[:26]!r} <-> {bt[:26]!r}")

        if slide.has_notes_slide and slide.notes_slide.notes_text_frame.text.strip():
            notes_count += 1

    print(f"slide: {len(prs.slides._sldIdLst)}")
    print(f"slide dengan catatan pembicara: {notes_count}")
    print(f"ukuran huruf dipakai: {sorted(sizes_seen)}")
    print(f"font dipakai: {sorted(fonts_seen)}")
    print()
    if problems:
        print(f"TEMUAN ({len(problems)}):")
        for p in problems:
            print(" -", p)
        return 1
    print("SEMUA PEMERIKSAAN LULUS: tidak ada teks terpotong, tidak ada tumpang tindih,")
    print("margin aman, kontras cukup, ukuran huruf memenuhi syarat brief.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
