"""Render the deck's line icons from the slides pack's SVG set, tinted to the theme.

The pack's icons are 24x24 SVGs that stroke with `currentColor`; replacing that
token with a hex colour and rasterising (svglib + reportlab, no native Cairo
needed on Windows) gives a clean PNG that pptxgenjs can place.

    python output/source/make_icons.py
"""
import json
import os
import sys

# pure-python SVG rasteriser lives outside the project to keep C: free
sys.path.insert(0, r"D:\wargaja-tools\pylibs")

import fitz  # PyMuPDF: PDF -> PNG  # noqa: E402
from reportlab.graphics import renderPDF  # noqa: E402
from svglib.svglib import svg2rlg  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
ICON_SRC = r"D:\Wargaja\.opencode\skills\build-deck\assets\icons"
OUT = os.path.join(HERE, "icons")

with open(os.path.join(HERE, "theme.json"), encoding="utf-8") as fh:
    THEME = json.load(fh)

INK = "#" + THEME["colours"]["ink"]
ACCENT_DEEP = "#" + THEME["colours"]["accentDeep"]

WANTED = {
    "cost": INK,
    "chat": INK,
    "data": INK,
    "folder": INK,
    "secure": ACCENT_DEEP,
    "key": ACCENT_DEEP,
    "check": ACCENT_DEEP,
    "phone": INK,
    "calendar": INK,
    "team": INK,
    "money": INK,
    "guide": INK,
}


def render(name, colour, px=256):
    """SVG -> drawing -> PDF -> PNG. No native Cairo anywhere in the chain."""
    src = os.path.join(ICON_SRC, name + ".svg")
    if not os.path.isfile(src):
        return None
    with open(src, encoding="utf-8") as fh:
        svg = fh.read()
    svg = svg.replace("currentColor", colour)
    tmp_svg = os.path.join(OUT, "_tmp.svg")
    tmp_pdf = os.path.join(OUT, "_tmp.pdf")
    with open(tmp_svg, "w", encoding="utf-8") as fh:
        fh.write(svg)
    drawing = svg2rlg(tmp_svg)
    if drawing is None:
        return None
    scale = px / 24.0
    drawing.width *= scale
    drawing.height *= scale
    drawing.scale(scale, scale)
    renderPDF.drawToFile(drawing, tmp_pdf)

    doc = fitz.open(tmp_pdf)
    page = doc[0]
    zoom = px / max(page.rect.width, 1)
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=True)
    dst = os.path.join(OUT, "%s-%s.png" % (name, colour.lstrip("#")))
    pix.save(dst)
    doc.close()
    os.remove(tmp_svg)
    os.remove(tmp_pdf)
    return dst


def main():
    os.makedirs(OUT, exist_ok=True)
    made, missing = [], []
    for name in WANTED:
        for colour in (INK, ACCENT_DEEP):
            try:
                path = render(name, colour)
            except Exception as exc:  # noqa: BLE001
                print("FAILED", name, colour, exc)
                path = None
            if path:
                made.append(os.path.basename(path))
            else:
                missing.append(name)
    print("rendered:", len(made))
    for m in sorted(made):
        print("  ", m)
    if missing:
        print("not available:", ", ".join(sorted(set(missing))))


if __name__ == "__main__":
    main()
