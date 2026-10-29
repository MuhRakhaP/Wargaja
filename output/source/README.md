# output/ — deck "Wargaja: Kelola RT/RW dengan mudah!"

Dibuat dengan tiga skill: **pptx** (komposisi deck lewat pptxgenjs), **theme-factory**
(tema khusus "Wargaja Warm"), dan **frontend-design** (arahan komposisi, tipografi,
dan penghindaran tampilan template).

## Berkas

| Berkas | Isi |
|---|---|
| `wargaja-presentasi-rtrw.pptx` | Deck utama, 12 slide (11 slide isi + 1 slide cadangan). |
| `wargaja-presentasi-rtrw.pdf` | Hasil render untuk pemeriksaan dan untuk dibagikan lewat WhatsApp. |
| `render/slide-1..12.png` | Render tiap slide (dari PDF, lewat PowerPoint). |
| `render/contact-sheet.png` | Semua slide dalam satu lembar. |
| `source/theme-wargaja-warm.md` | Tema (theme-factory): palet, tipografi, motif, peruntukan. |
| `source/theme.json` | Token tema yang dipakai generator (satu-satunya sumber warna/ukuran). |
| `source/build-wargaja.cjs` | Generator deck (pptxgenjs). |
| `source/make_icons.py` | Membuat PNG ikon dari set SVG, diwarnai sesuai tema. |
| `source/icons/` | Hasil render ikon (dua warna: tinta dan amber tua). |
| `source/check_deck.py` | Pemeriksa file: ukuran huruf, margin, tumpang tindih, perkiraan teks terpotong, kontras. |
| `source/check_render.py` | Pemeriksa hasil render: jumlah halaman, teks tiap halaman, halaman kosong, batas tinta, kata terlarang. |

## Membangun ulang

```powershell
# 1. ikon (butuh svglib + reportlab + PyMuPDF)
python output/source/make_icons.py

# 2. deck
node output/source/build-wargaja.cjs

# 3. gerbang mutu wajib dari skill pptx
python <skills>/pptx/scripts/office/validate.py output/wargaja-presentasi-rtrw.pptx
python output/source/check_deck.py

# 4. render + periksa hasil render
python <slides-pack>/build-deck/scripts/raster.py output/wargaja-presentasi-rtrw.pptx --out-dir output/render --sheet --check
Copy-Item output/render/_deck.pdf output/wargaja-presentasi-rtrw.pdf
python output/source/check_render.py
```

`<skills>` = `C:\Users\mrakh\AppData\Local\Temp\opencode\anthropic-skills\skills`.
`<slides-pack>` = `D:\Wargaja\.opencode\skills`.

## Yang perlu diisi manual (sudah ada penandanya di slide)

1. **`[nama RT/RW/perumahan]`** — slide 1.
2. **`[nama lingkungan]`** — slide 10 dan 11.
3. **`[tanggal presentasi]`** — slide 1.
4. **Jadwal uji coba** `[minggu 1]` … `[minggu 5]` — slide 10.
5. **Narahubung** `[nama pengurus]`, `[nomor WhatsApp]`, `[alamat email]` — slide 11.
6. **Tiga tangkapan layar** pada bingkai bergaris putus-putus — slide 4 (menu Iuran),
   slide 5 (pengumuman & jadwal), slide 6 (laporan iuran). Ambil dari aplikasi asli
   setelah logo dan namanya menjadi Wargaja.
7. **Logo** — slide 1 memakai `assets/icons/app_icon.png` dari repositori. Periksa dulu
   bahwa ikon itu sudah tidak membawa merek lama; kalau masih, ganti dengan logo Wargaja.

## Catatan klaim

Tiga hal di brief diubah supaya tidak menjadi janji yang belum ada di aplikasi, dan
sudah dikonfirmasi di ringkasan akhir:

- "laporan keuangan otomatis" → **"laporan lebih cepat dibuat"**, karena laporan masih
  perlu diisi dan diverifikasi pengurus.
- Bagian privasi **tidak** menyebut enkripsi atau sertifikasi apa pun.
- Pertanyaan "apakah gratis" dijawab **"belum ada biaya untuk warga"**, bukan janji
  gratis permanen.
