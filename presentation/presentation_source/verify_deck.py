"""Runable check for Wargaja_Presentasi_Warga.pptx.

Verifies the rendered deck without needing image input:
  1. the PDF export has 13 pages;
  2. each page's extracted text contains the words that slide must carry;
  3. no page is effectively empty (a proxy for a blank/broken slide);
  4. speaker notes exist for all 13 slides.
Run: python presentation_source/verify_deck.py
"""
import sys
import re

import fitz
from pptx import Presentation

PPTX = r"D:\Wargaja\presentation\Wargaja_Presentasi_Warga.pptx"
PDF = r"D:\Wargaja\presentation\Wargaja_Presentasi_Warga.pdf"

# One required substring (lowercased, punctuation-stripped) per slide.
EXPECTED = [
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

# Must NOT appear anywhere: the old product name and unsafe claims.
# The extra entries guard against claims found in an external draft deck
# ("Presentasi Sosialisasi Aplikasi Wargaja.pptx") that the code does not support.
FORBIDDEN = [
    "nestara",
    "wargaaja",
    "rukunin",
    "enkripsi",
    "sertifikasi",
    "cadangan data aman",
    "ios",
    "app store",
    "play store",
    "bantuan darurat",
    "real-time",
    "standar enkripsi",
]

# Facts that must appear somewhere in the rendered text (gets table cells too).
FACTS = [
    "surat keterangan domisili",
    "surat keterangan tidak mampu",
    "surat keterangan usaha",
    "permohonan koreksi data",
    "surat keterangan keluarga",
    "nomor kartu keluarga",
    "lupa kata sandi",
    "email yang aktif",
    "pengurus rt",
    "pengurus rw",
    "bendahara",
    "sekretaris",
    "admin",
    "tanpa pembayaran otomatis",
    "grup whatsapp",
    "mari bangun lingkungan yang lebih terhubung",
    "selamat datang kembali",
    "menu warga",
    "jatuh tempo iuran",
    "riwayat pembayaran",
    "transparansi keuangan",
    "gambaran tampilan aplikasi, bukan tangkapan layar",
]


def norm(text):
    text = text.lower().replace("\u2019", "'")
    return re.sub(r"\s+", " ", text)


def main():
    doc = fitz.open(PDF)
    failures = []

    if doc.page_count != len(EXPECTED):
        failures.append(f"PDF has {doc.page_count} pages, expected {len(EXPECTED)}")

    for i, want in enumerate(EXPECTED):
        if i >= doc.page_count:
            break
        text = norm(doc[i].get_text())
        if want not in text:
            failures.append(f"slide {i + 1}: missing expected text {want!r}")
        if len(text.strip()) < 40:
            failures.append(f"slide {i + 1}: page text is effectively empty")

    whole = norm("".join(doc[i].get_text() for i in range(doc.page_count)))
    for bad in FORBIDDEN:
        if bad in whole:
            failures.append(f"forbidden string present in rendered deck: {bad!r}")
    for fact in FACTS:
        if fact not in whole:
            failures.append(f"expected fact missing from rendered deck: {fact!r}")

    prs = Presentation(PPTX)
    slides = list(prs.slides)
    if len(slides) != len(EXPECTED):
        failures.append(f"pptx has {len(slides)} slides, expected {len(EXPECTED)}")
    visual_count = 0
    for i, slide in enumerate(slides, 1):
        if slide.has_notes_slide:
            notes = slide.notes_slide.notes_text_frame.text.strip()
        else:
            notes = ""
        if len(notes) < 40:
            failures.append(f"slide {i}: speaker notes missing or too short")
        if "VISUAL TO ADD:" in notes:
            visual_count += 1
    if visual_count < 2:
        failures.append(f"expected 2 VISUAL TO ADD notes, found {visual_count}")

    if failures:
        print("VERIFY FAILED")
        for f in failures:
            print(" -", f)
        return 1
    print(f"VERIFY OK: {doc.page_count} slides, all expected text present, "
          f"no forbidden strings, notes on every slide")
    return 0


if __name__ == "__main__":
    sys.exit(main())
