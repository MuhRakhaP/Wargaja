# presentation_source — cara membangun ulang deck Wargaja

Semua yang dibutuhkan untuk membangun `Wargaja_Presentasi_Warga.pptx` ada di folder ini,
kecuali profil merek yang tinggal di `.slides/` (root proyek).

## Isi

| Berkas | Fungsi |
|---|---|
| `wargaja.deck.md` | Spesifikasi deck (kontrak isi): 19 slide, field, brief desain, catatan pembicara, penanda `Visual:`. |
| `Wargaja_Presentasi_Warga.build.cjs` | Skrip pembentuk deck. Seluruh kata ada di blok `C`; seluruh warna/ukuran/margin datang dari token merek. |
| `verify_deck.py` | Pemeriksaan yang bisa dijalankan: 19 halaman, teks wajib tiap slide, tidak ada halaman kosong, tidak ada kata terlarang, fakta wajib (jenis surat, peran, persiapan, nama menu mockup) benar-benar tercetak, catatan pembicara lengkap, dan dua penanda `VISUAL TO ADD` ada. |
| `assets/mockups/` | 20 ikon kecil yang diekstrak dari deck eksternal `Presentasi Sosialisasi Aplikasi Wargaja.pptx`, disimpan supaya tidak hilang. Deck Wargaja tidak memakainya (gambar mockup di deck Wargaja dibuat dari bentuk yang bisa diedit). |
| `assets/` | (kosong) tempat menaruh tangkapan layar/lampiran bila nanti ditambahkan. |

## Prasyarat

- Python 3.9+ dengan `python-pptx`, dan `pymupdf` untuk `verify_deck.py`.
- Node 22+ (dipakai Node 24) dengan `pptxgenjs@4.0.1` terpasang di `.slides/`.
- LibreOffice **atau** Microsoft PowerPoint untuk memeriksa hasil render (mesin ini memakai PowerPoint).

## Membangun ulang

Jalankan dari root proyek `D:\Wargaja`:

```powershell
# 1. Bangun token dari profil merek
python .opencode/skills/build-deck/scripts/emit_tokens.py .slides/brand.json --out .slides/tokens.cjs --register "presented"

# 2. Periksa skrip sebelum dijalankan
python .opencode/skills/build-deck/scripts/check_script.py presentation/presentation_source/Wargaja_Presentasi_Warga.build.cjs

# 3. Bentuk deck (dijalankan di dalam batas izin Node)
node --permission --allow-fs-read=D:\Wargaja --allow-fs-write=D:\Wargaja\presentation `
  presentation/presentation_source/Wargaja_Presentasi_Warga.build.cjs `
  --tokens .slides/tokens.cjs `
  --out presentation/Wargaja_Presentasi_Warga.pptx

# 4. Gerbang mutu: warna token, ukuran huruf, font merek, margin, tumpang tindih, kontras
python .opencode/skills/build-deck/scripts/lint_pptx.py presentation/Wargaja_Presentasi_Warga.pptx --brand .slides/brand.json --register "presented"

# 5. Tandai deck agar bisa diputar-balik dengan spesifikasi
python .opencode/skills/build-deck/scripts/stamp.py presentation/Wargaja_Presentasi_Warga.pptx --spec presentation/presentation_source/wargaja.deck.md
```

## Render balik dan ekspor PDF

```powershell
# Hasilkan PNG per slide + contact-sheet, dan PDF perantara di presentation/review/
python .opencode/skills/build-deck/scripts/raster.py presentation/Wargaja_Presentasi_Warga.pptx --out-dir presentation/review --sheet --check

# Salin PDF perantara menjadi berkas kiriman
Copy-Item -Force presentation/review/_deck.pdf presentation/Wargaja_Presentasi_Warga.pdf
```

## Memeriksa hasil

```powershell
python presentation/presentation_source/verify_deck.py
```

## Mengubah isi

Ubah kata-kata di **satu tempat**: blok `C = JSON.parse(...)` di
`Wargaja_Presentasi_Warga.build.cjs`, dan samakan dengan `wargaja.deck.md`
(spesifikasi adalah sumber kebenaran untuk catatan pembicara dan penanda Visual).

Mengubah warna atau font merek: sunting `.slides/brand.json`, jalankan ulang
langkah 1 sampai 5. Skrip tidak menyimpan warna atau ukuran huruf sendiri.
