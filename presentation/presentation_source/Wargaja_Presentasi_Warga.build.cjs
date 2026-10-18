/*
 * Wargaja_Presentasi_Warga.build.cjs
 * Deck sosialisasi "Presentasi Sosialisasi Aplikasi Wargaja" — 11 slide.
 *
 * Versi ringkas: teks lebih kecil (skala 72/48/32/20/16) dan slide berjudul
 * sejenis digabung, dari 19 slide menjadi 11.
 *
 * Spec: wargaja.deck.md. Token merek: .slides/tokens.cjs.
 * Jalankan:
 *   python .opencode/skills/build-deck/scripts/check_script.py <berkas ini>
 *   node --permission --allow-fs-read=D:\Wargaja --allow-fs-write=D:\Wargaja\presentation \
 *        Wargaja_Presentasi_Warga.build.cjs --tokens .slides/tokens.cjs \
 *        --out presentation/Wargaja_Presentasi_Warga.pptx
 */

const argv = process.argv.slice(2);

function arg(name) {
  const i = argv.indexOf(name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null;
}

const tokensPath = arg("--tokens");
const outPath = arg("--out");

if (!tokensPath || !outPath) {
  console.error("usage: node Wargaja_Presentasi_Warga.build.cjs --tokens <tokens.cjs> --out <deck.pptx>");
  process.exit(2);
}

const T = require(require("path").resolve(tokensPath));
const pptxgen = T.loadPptxgen();

// Seluruh kata yang muncul di slide, dalam satu blok.
const C = JSON.parse('{"s1":{"mark":"W","title":"Wargaja","tagline":"Urus Lingkungan, Lebih Mudah.","subtitle":"Presentasi sosialisasi aplikasi Wargaja untuk warga","audience":"Untuk warga, pengurus RT/RW, dan pengelola lingkungan","date":"[tanggal presentasi]","notes":"Buka dengan tenang. Sebutkan tujuan pertemuan: memperkenalkan satu aplikasi supaya urusan lingkungan tidak lagi tersebar di banyak tempat. Nyatakan sejak awal bahwa aplikasi masih dalam tahap uji coba dan masukan warga sangat diharapkan. Jangan menjanjikan fitur yang belum ada. Ganti [tanggal presentasi] sebelum dipakai."},"s2":{"title":"Apa itu Wargaja","definition":"Wargaja adalah satu tempat untuk semua urusan lingkungan warga.","cards":[{"label":"Satu tempat untuk informasi","body":"Pengumuman, kegiatan, dan jadwal terkumpul rapi."},{"label":"Satu jalur untuk pengajuan","body":"Ajukan surat dan dokumen dari ponsel."},{"label":"Satu catatan untuk iuran","body":"Riwayat pembayaran tersimpan dan diperiksa pengurus."}],"notes":"Ucapkan definisinya perlahan lalu berhenti sebentar. Tegaskan Wargaja bukan pengganti grup WhatsApp untuk mengobrol, melainkan tempat menaruh hal-hal yang perlu tercatat dan dicari kembali. Hindari kata server, basis data, atau cloud."},"s3":{"title":"Kenapa kita perlu satu tempat","items":["Informasi penting tenggelam di grup WhatsApp","Pengumuman lama sulit dicari kembali","Catatan administrasi masih manual","Warga bingung mengajukan surat ke mana","Iuran dan pengeluaran sulit dipantau bersama"],"caption":"Tantangan umum di banyak lingkungan, bukan kesimpulan tentang lingkungan kita.","notes":"Sebut dengan jelas bahwa ini tantangan yang umum muncul di banyak lingkungan, bukan hasil pemeriksaan lingkungan kita sendiri. Kalau warga langsung menyebut contoh yang lebih nyata, terima dan pakai contoh mereka. Jangan menakut-nakuti dan jangan menyalahkan pengurus sebelumnya."},"s4":{"title":"Yang bisa dilakukan warga dan pengurus","leftLabel":"Warga","left":["Iuran dan unggah bukti bayar","Ajukan surat dan dokumen","Lihat kegiatan dan ikut mendaftar","Belanja atau berjualan di pasar warga","Lihat data diri dan keluarga"],"rightLabel":"Pengurus","right":["Verifikasi bukti pembayaran iuran","Bantuan penandaan bukti mencurigakan","Kelola kegiatan dan jadwal","Kelola pasar warga","Lihat data kependudukan"],"notes":"Semua yang disebut di sini sudah berjalan di aplikasi. Peran yang paling siap: bendahara untuk verifikasi iuran, sekretaris untuk data kependudukan, pengurus RT untuk kegiatan dan pasar warga. Jujurkan bahwa menu pengurus lain masih dikembangkan. Kalau ditanya soal lapor masalah dan kirim saran, jawab bahwa tampilannya ada tetapi belum tersambung.","visual":"Dua tangkapan layar berdampingan: (1) menu Iuran warga, (2) tampilan verifikasi di sisi bendahara. Ambil dari aplikasi asli setelah rebranding ke Wargaja, tanpa nama atau data warga asli."},"s5":{"title":"Gambaran tampilan aplikasi","cards":[{"label":"Beranda warga","lines":["Selamat datang kembali!","Warga RW 05","Jatuh Tempo Iuran","Pengumuman: Jadwal Ronda"]},{"label":"Menu Warga","lines":["Informasi Kependudukan","Data Keluarga (KK)","Data Rumah","Bayar Iuran"]},{"label":"Iuran dan surat","lines":["Bayar Iuran","Riwayat Pembayaran","Ajukan Surat","Transparansi Keuangan"]}],"nav":["Beranda","Pasar","Kegiatan","Akun"],"caption":"Gambaran tampilan aplikasi, bukan tangkapan layar. Angka dan nama pada gambar hanya contoh.","notes":"Jelaskan lebih dulu bahwa ini gambaran tampilan, bukan tangkapan layar asli, supaya tidak ada warga yang mengira angka di dalamnya nyata. Semua nama menu diambil apa adanya dari aplikasi. Gambar ini dibuat dari bentuk dan tulisan yang bisa diedit, jadi pengurus dapat memperbaruinya sendiri."},"s6":{"title":"Alur iuran yang lebih rapi","steps":[{"label":"Warga pilih bulan","detail":"Melihat tagihan yang harus dibayar."},{"label":"Unggah bukti bayar","detail":"Mengirim foto bukti transfer dari ponsel."},{"label":"Pengurus verifikasi","detail":"Bendahara memeriksa, dibantu penandaan bukti mencurigakan."},{"label":"Tercatat","detail":"Status pembayaran tersimpan di riwayat warga."}],"caption":"Tanpa pembayaran otomatis: bukti transfer tetap diunggah dan diverifikasi pengurus.","notes":"Tegaskan bahwa tidak ada potongan otomatis dan tidak ada uang yang berpindah tanpa persetujuan pengurus. Aplikasi hanya mencatat dan membantu memeriksa. Kalau ditanya soal keamanan uang: uang tetap masuk ke rekening kas seperti biasa, aplikasi hanya mencatat buktinya."},"s7":{"title":"Surat, dokumen, dan cara mengajukannya","listHead":"Surat yang bisa diajukan","list":["Surat Keterangan Domisili","Surat Keterangan Tidak Mampu","Surat Keterangan Usaha","Permohonan Koreksi Data","Surat Keterangan Keluarga","Surat Lainnya"],"flowHead":"Alurnya","flow":["Pilih jenis layanan","Isi tujuan pengajuan dan catatan","Unggah lampiran dari ponsel","Kirim, lalu tunggu kabar pengurus"],"caption":"Semua diajukan dari ponsel, dan lampiran cukup difoto langsung dari ponsel.","notes":"Baca keenam jenis surat satu per satu karena warga sering datang justru untuk salah satu dari daftar ini. Jelaskan bahwa lampiran pendukung, misalnya foto KTP atau KK, diunggah dari ponsel. Jujurkan bahwa pengelolaan pengajuan di sisi pengurus masih disempurnakan, dan surat belum bisa diunduh langsung dari aplikasi."},"s8":{"title":"Cara mulai dan yang perlu disiapkan","steps":[{"label":"Daftar atau masuk","detail":"Nama, email, dan kata sandi; bisa juga akun Google."},{"label":"Lengkapi data","detail":"Isi data KTP dan KK, sekali saja saat pertama masuk."},{"label":"Gunakan layanan","detail":"Bayar iuran, ajukan surat, atau ikut kegiatan."}],"asideHead":"Yang perlu disiapkan","aside":["Ponsel Android","Email yang aktif","NIK dan data KTP","Nomor Kartu Keluarga"],"caption":"Lupa kata sandi? Pakai menu Lupa kata sandi di halaman masuk.","notes":"Jangan pernah menyebutkan kata sandi akun contoh di depan warga. Cara memasang aplikasi masih perlu diputuskan pengurus, jadi sebutkan bahwa bagian itu akan diumumkan setelah kesepakatan. Sebutkan bahwa aplikasi bisa dikunci memakai sidik jari atau wajah di ponsel masing-masing.","visual":"Dua tangkapan layar berdampingan sebagai panduan: (1) halaman masuk dengan pilihan email dan akun Google, (2) halaman beranda warga setelah masuk. Ambil dari aplikasi asli setelah rebranding ke Wargaja; jangan tampilkan surel, nomor telepon, atau foto pribadi warga."},"s9":{"title":"Peran pengguna dan data warga","leftLabel":"Siapa yang memakai","left":["Warga","Pengurus RT","Bendahara","Sekretaris","Pengurus RW - masih disiapkan","Admin - masih disiapkan"],"rightLabel":"Siapa yang bisa melihat","right":["Data diisi sendiri oleh warga","Tampilan dan menu dipisah menurut peran","Hanya pengurus terkait yang melihat data yang diperlukan","Data bisa diperbaiki bila ada yang keliru"],"caption":"Aturan rinci soal penyimpanan data masih perlu ditetapkan bersama pengurus.","notes":"Ini bagian yang paling menentukan kepercayaan. Jangan sekali-kali mengklaim enkripsi, sertifikasi, atau cadangan data karena belum bisa dibuktikan. Katakan apa adanya: data diisi warga, akses dipisah per peran, dan aturan rincinya masih akan dibahas. Menu pemeriksaan data di sisi pengurus juga belum selesai."},"s10":{"title":"Sudah tersedia, dan manfaatnya","readyLabel":"Sudah bisa dipakai","ready":["Iuran: unggah bukti dan verifikasi","Pengajuan surat dan dokumen","Kegiatan warga: lihat dan ikut","Pasar warga","Lihat data kependudukan dan keluarga"],"todoLabel":"Masih disiapkan","todo":["Kelola data warga oleh pengurus","Kelola pengumuman dan laporan","Kelola iuran tingkat RW","Verifikasi akun dan peran","Cadangan data"],"caption":"Manfaatnya: pengurus lebih rapi, warga lebih mudah, dan kegiatan lingkungan lebih terjaga.","notes":"Bacakan kedua kolom dengan jujur dan tanpa membela diri. Kolom kanan sengaja dibiarkan terlihat supaya warga tahu apa yang belum selesai. Jangan menjanjikan semua pekerjaan manual akan hilang; katakan pekerjaan menjadi lebih tertata, bukan hilang."},"s11":{"title":"Rencana bertahap dan penutup","phases":[{"when":"Tahap 1","what":"Peragaan dan mengumpulkan masukan."},{"when":"Tahap 2","what":"Uji coba terbatas dengan beberapa warga dan pengurus."},{"when":"Tahap 3","what":"Perbaikan sesuai masukan."},{"when":"Tahap 4","what":"Peluasan setelah persetujuan pengurus."}],"thanks":"Terima kasih","closing":"Mari Bangun Lingkungan yang Lebih Terhubung.","contact":"Narahubung: [Nama pengurus RT/RW] - [Nomor/WA]","notes":"Tegaskan dua kali bahwa ini usulan, bukan jadwal yang sudah disetujui. Tutup dengan terima kasih yang singkat, lalu buka sesi tanya jawab. Ajak warga menuliskan masukan, termasuk kritik. Ingatkan narahubung dan tanggal masih perlu diisi pengurus sebelum presentasi dipakai. Lima pertanyaan yang sering muncul sudah disiapkan di catatan pembicara."}}');

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";

const W = T.slide.w;
const H = T.slide.h;
const MX = T.margins.x;
const MT = T.margins.top;
const CW = W - 2 * MX;
const ROUNDED = T.shape.corner === "rounded";
const S = T.scale;
const CO = T.colours;

const SH = { RECT: ROUNDED ? "roundRect" : "rect", OVAL: "ellipse", LINE: "line" };
const CHIP = 0.58;
const TITLE_X = MX + CHIP + 0.18;
const TITLE_W = CW - (CHIP + 0.18);
const TITLE_H = 0.78;
const CAP_Y = 6.4;

let slideNo = 1;

function paperSlide() {
  slideNo += 1;
  const s = pres.addSlide();
  s.background = { color: CO.paper };
  chip(s, String(slideNo));
  return s;
}

function inkSlide() {
  const s = pres.addSlide();
  s.background = { color: CO.ink };
  return s;
}

function tx(s, body, opts) {
  s.addText(body, Object.assign({ margin: 0, fontFace: T.fonts.body, color: CO.ink, valign: "top" }, opts));
}

function panel(s, opts) {
  const o = Object.assign({}, opts);
  if (ROUNDED) o.rectRadius = 0.1;
  s.addShape(SH.RECT, o);
}

function rule(s, opts) {
  s.addShape(SH.LINE, Object.assign({ h: 0, line: { color: CO.muted, width: 1 } }, opts));
}

function dot(s, opts) {
  s.addShape(SH.OVAL, opts);
}

function tint(role, tr) {
  return { color: CO[role], transparency: tr };
}

function chip(s, label) {
  tx(s, label, {
    x: MX, y: MT, w: CHIP, h: CHIP,
    shape: SH.RECT, rectRadius: ROUNDED ? 0.1 : undefined,
    fill: { color: CO.accent }, line: { color: CO.accent },
    fontFace: T.fonts.heading, fontSize: S.body, bold: true,
    color: CO.paper, align: "center", valign: "middle",
    objectName: "deco-chip",
  });
}

function head(s, label) {
  tx(s, label, {
    x: TITLE_X, y: MT, w: TITLE_W, h: TITLE_H,
    fontFace: T.fonts.heading, fontSize: S.h1, bold: true, color: CO.ink,
    objectName: "slides-lead:Title",
  });
}

function caption(s, label) {
  tx(s, label, {
    x: MX, y: CAP_Y, w: CW, h: 0.42,
    fontFace: T.fonts.body, fontSize: S.caption, color: CO.muted,
    objectName: "slides-field:Caption",
  });
}

function bullets(lines) {
  return lines.map((line, i) => ({
    text: "\u2022 " + line,
    options: i === lines.length - 1 ? {} : { breakLine: true },
  }));
}

function notesWithVisual(notes, visual) {
  return visual ? notes + "\n\nVISUAL TO ADD: " + visual : notes;
}

// Baris penuh dengan penanda bulat oranye.
function rowList(slide, items) {
  const n = items.length;
  const top = 1.68;
  const gap = 0.14;
  const rh = (4.55 - (n - 1) * gap) / n;
  for (let i = 0; i < n; i++) {
    const y = top + i * (rh + gap);
    panel(slide, {
      x: MX, y: y, w: CW, h: rh,
      fill: tint("ink", 94), line: tint("ink", 100),
      objectName: "deco-row-" + (i + 1),
    });
    dot(slide, {
      x: MX + 0.26, y: y + (rh - 0.34) / 2, w: 0.34, h: 0.34,
      fill: { color: CO.accent }, line: { color: CO.accent },
      objectName: "deco-row-mark-" + (i + 1),
    });
    tx(slide, items[i], {
      x: MX + 0.86, y: y + 0.1, w: CW - 1.12, h: rh - 0.2,
      fontFace: T.fonts.body, fontSize: S.body, color: CO.ink,
      objectName: "slides-field:Item" + (i + 1),
    });
  }
}

// Dua kolom yang saling melengkapi (perbandingan yang menyelesaikan).
function comparison(slide, leftLabel, leftItems, rightLabel, rightItems, y, h) {
  const cw = (CW - 0.6) / 2;
  const cols = [
    { x: MX, label: leftLabel, items: leftItems, accent: true, key: "Left" },
    { x: MX + cw + 0.6, label: rightLabel, items: rightItems, accent: false, key: "Right" },
  ];
  cols.forEach((col) => {
    panel(slide, {
      x: col.x, y: y, w: cw, h: h,
      fill: col.accent ? tint("accent", 92) : tint("ink", 94),
      line: tint("ink", 100),
      objectName: "deco-col-" + col.key,
    });
    tx(slide, col.label, {
      x: col.x + 0.32, y: y + 0.26, w: cw - 0.64, h: 0.5,
      fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
      objectName: "deco-col-" + col.key + "-label",
    });
    tx(slide, bullets(col.items), {
      x: col.x + 0.32, y: y + 0.86, w: cw - 0.64, h: h - 1.1,
      fontFace: T.fonts.body, fontSize: S.caption, color: CO.ink,
      objectName: "slides-field:" + col.key,
    });
  });
}

// Rangkaian bernomor, dipakai untuk alur yang urutannya mengikat.
function processRow(slide, steps, y, h, gap, width) {
  const n = steps.length;
  const total = width || CW;
  const sw = (total - (n - 1) * gap) / n;
  for (let i = 0; i < n; i++) {
    const x = MX + i * (sw + gap);
    panel(slide, {
      x: x, y: y, w: sw, h: h,
      fill: i === 0 ? tint("accent", 92) : tint("ink", 94),
      line: tint("ink", 100),
      objectName: "deco-step-" + (i + 1),
    });
    tx(slide, steps[i].label, {
      x: x + 0.24, y: y + 0.24, w: sw - 0.48, h: h * 0.42,
      fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
      objectName: "slides-field:Step" + (i + 1) + "Label",
    });
    tx(slide, steps[i].detail, {
      x: x + 0.24, y: y + h * 0.5, w: sw - 0.48, h: h * 0.44,
      fontFace: T.fonts.body, fontSize: S.caption, color: CO.muted,
      objectName: "slides-field:Step" + (i + 1) + "Detail",
    });
    if (i < n - 1) {
      rule(slide, {
        x: x + sw + 0.04, y: y + 0.45, w: gap - 0.08,
        line: { color: CO.accent, width: 2 },
        objectName: "deco-step-link-" + (i + 1),
      });
    }
  }
}

// ----------------------------------------------------------------- 1. cover --
{
  const s = inkSlide();

  panel(s, {
    x: 10.13, y: 0, w: W - 10.13, h: H,
    fill: { color: CO.accent }, line: { color: CO.accent },
    objectName: "deco-accent-panel",
  });

  tx(s, C.s1.mark, {
    x: MX, y: 1.15, w: 0.7, h: 0.7,
    shape: SH.RECT, rectRadius: ROUNDED ? 0.12 : undefined,
    fill: { color: CO.accent }, line: { color: CO.accent },
    fontFace: T.fonts.heading, fontSize: S.body, bold: true,
    color: CO.paper, align: "center", valign: "middle",
    objectName: "deco-cover-mark",
  });

  tx(s, C.s1.title, {
    x: MX, y: 2.2, w: 9.2, h: 1.5,
    fontFace: T.fonts.heading, fontSize: S.display, bold: true,
    color: CO.paper, objectName: "slides-lead:Title",
  });
  tx(s, C.s1.tagline, {
    x: MX, y: 3.85, w: 9.2, h: 0.62,
    fontFace: T.fonts.heading, fontSize: S.h1, bold: true, color: CO.accent,
    objectName: "slides-field:Tagline",
  });
  rule(s, { x: MX, y: 4.68, w: 4.0, line: { color: CO.accent, width: 2 }, objectName: "deco-cover-rule" });
  tx(s, C.s1.subtitle, {
    x: MX, y: 4.88, w: 9.0, h: 0.45,
    fontFace: T.fonts.body, fontSize: S.body, color: CO.paper,
    objectName: "slides-field:Subtitle",
  });
  tx(s, C.s1.audience, {
    x: MX, y: 5.5, w: 9.0, h: 0.4,
    fontFace: T.fonts.body, fontSize: S.caption, color: CO.paper,
    objectName: "slides-field:Audience",
  });
  tx(s, C.s1.date, {
    x: MX, y: 6.05, w: 9.0, h: 0.4,
    fontFace: T.fonts.body, fontSize: S.caption, color: CO.paper,
    objectName: "slides-field:Date",
  });

  s.addNotes(C.s1.notes);
}

// ------------------------------------------------- 2. definisi + tiga pilar --
{
  const s = paperSlide();
  head(s, C.s2.title);

  panel(s, {
    x: MX, y: 1.68, w: CW, h: 1.05,
    fill: tint("accent", 92), line: tint("ink", 100),
    objectName: "deco-definition",
  });
  tx(s, C.s2.definition, {
    x: MX + 0.4, y: 1.92, w: CW - 0.8, h: 0.6,
    fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
    objectName: "slides-field:Definition",
  });

  const gap = 0.6;
  const cw = (CW - 2 * gap) / 3;
  C.s2.cards.forEach((card, i) => {
    const x = MX + i * (cw + gap);
    const y = 2.95;
    panel(s, {
      x: x, y: y, w: cw, h: 3.1,
      fill: i === 0 ? tint("accent", 92) : tint("ink", 94),
      line: tint("ink", 100),
      objectName: "deco-pillar-" + (i + 1),
    });
    tx(s, card.label, {
      x: x + 0.3, y: y + 0.32, w: cw - 0.6, h: 0.9,
      fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
      objectName: "slides-field:Pillar" + (i + 1) + "Label",
    });
    tx(s, card.body, {
      x: x + 0.3, y: y + 1.35, w: cw - 0.6, h: 1.5,
      fontFace: T.fonts.body, fontSize: S.caption, color: CO.muted,
      objectName: "slides-field:Pillar" + (i + 1) + "Body",
    });
  });

  s.addNotes(C.s2.notes);
}

// ------------------------------------------------------------- 3. masalah --
{
  const s = paperSlide();
  head(s, C.s3.title);
  rowList(s, C.s3.items);
  caption(s, C.s3.caption);
  s.addNotes(C.s3.notes);
}

// --------------------------------------------- 4. fitur warga + pengurus ----
{
  const s = paperSlide();
  head(s, C.s4.title);
  comparison(s, C.s4.leftLabel, C.s4.left, C.s4.rightLabel, C.s4.right, 1.68, 4.6);
  s.addNotes(notesWithVisual(C.s4.notes, C.s4.visual));
}

// ------------------------------------------------------------- 5. mockup --
{
  const s = paperSlide();
  head(s, C.s5.title);

  const n = C.s5.cards.length;
  const gap = 0.6;
  const cw = (CW - (n - 1) * gap) / n;
  const y = 1.66;
  const h = 3.5;

  for (let i = 0; i < n; i++) {
    const x = MX + i * (cw + gap);
    panel(s, {
      x: x, y: y, w: cw, h: h,
      fill: i === 0 ? tint("accent", 92) : tint("ink", 94),
      line: tint("ink", 100),
      objectName: "deco-screen-" + (i + 1),
    });
    tx(s, C.s5.cards[i].label, {
      x: x + 0.28, y: y + 0.22, w: cw - 0.56, h: 0.5,
      fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
      objectName: "slides-field:Screen" + (i + 1) + "Label",
    });
    tx(s, bullets(C.s5.cards[i].lines), {
      x: x + 0.28, y: y + 0.82, w: cw - 0.56, h: h - 1.05,
      fontFace: T.fonts.body, fontSize: S.caption, color: CO.ink,
      objectName: "slides-field:Screen" + (i + 1) + "Lines",
    });
  }

  panel(s, {
    x: MX, y: 5.32, w: CW, h: 0.58,
    fill: tint("ink", 94), line: tint("ink", 100),
    objectName: "deco-nav-strip",
  });
  const navW = CW / C.s5.nav.length;
  for (let i = 0; i < C.s5.nav.length; i++) {
    tx(s, C.s5.nav[i], {
      x: MX + i * navW, y: 5.42, w: navW, h: 0.4,
      fontFace: T.fonts.body, fontSize: S.caption,
      color: CO.ink, bold: i === 0, align: "center",
      objectName: "slides-field:Nav" + (i + 1),
    });
  }

  caption(s, C.s5.caption);
  s.addNotes(C.s5.notes);
}

// -------------------------------------------------------------- 6. iuran --
{
  const s = paperSlide();
  head(s, C.s6.title);
  processRow(s, C.s6.steps, 1.9, 3.3, 0.5);
  caption(s, C.s6.caption);
  s.addNotes(C.s6.notes);
}

// ------------------------------------------ 7. surat + cara mengajukannya --
{
  const s = paperSlide();
  head(s, C.s7.title);

  // kiri: daftar jenis surat
  const lw = 5.5;
  tx(s, C.s7.listHead, {
    x: MX, y: 1.62, w: lw, h: 0.45,
    fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
    objectName: "deco-list-head",
  });
  C.s7.list.forEach((item, i) => {
    const y = 2.16 + i * 0.6;
    tx(s, item, {
      x: MX, y: y, w: lw, h: 0.42,
      fontFace: T.fonts.body, fontSize: S.body, color: CO.ink,
      bullet: true,
      objectName: "slides-field:Letter" + (i + 1),
    });
  });

  // kanan: alur bernomor
  const rx = MX + lw + 0.7;
  const rw = CW - lw - 0.7;
  panel(s, {
    x: rx, y: 1.62, w: rw, h: 4.6,
    fill: tint("ink", 94), line: tint("ink", 100),
    objectName: "deco-flow-panel",
  });
  tx(s, C.s7.flowHead, {
    x: rx + 0.34, y: 1.88, w: rw - 0.68, h: 0.45,
    fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
    objectName: "deco-flow-head",
  });
  C.s7.flow.forEach((step, i) => {
    const y = 2.46 + i * 0.92;
    // satu bentuk teks berisi angka: menghemat satu elemen per langkah
    tx(s, String(i + 1), {
      x: rx + 0.34, y: y - 0.02, w: 0.46, h: 0.46,
      shape: SH.RECT, rectRadius: ROUNDED ? 0.1 : undefined,
      fill: { color: CO.accent }, line: { color: CO.accent },
      fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
      align: "center", valign: "middle",
      objectName: "deco-flow-num-" + (i + 1),
    });
    tx(s, step, {
      x: rx + 1.0, y: y, w: rw - 1.36, h: 0.84,
      fontFace: T.fonts.body, fontSize: S.body, color: CO.ink,
      objectName: "slides-field:Flow" + (i + 1),
    });
  });

  caption(s, C.s7.caption);
  s.addNotes(C.s7.notes);
}

// ------------------------------------------- 8. cara mulai + persiapan -----
{
  const s = paperSlide();
  head(s, C.s8.title);

  // kiri: tiga langkah, ditumpuk sebagai daftar bernomor
  const lw = 6.7;
  C.s8.steps.forEach((st, i) => {
    const y = 1.68 + i * 1.56;
    // satu bentuk teks berisi angka
    tx(s, String(i + 1), {
      x: MX, y: y + 0.06, w: 0.52, h: 0.52,
      shape: SH.RECT, rectRadius: ROUNDED ? 0.1 : undefined,
      fill: { color: CO.accent }, line: { color: CO.accent },
      fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
      align: "center", valign: "middle",
      objectName: "deco-start-num-" + (i + 1),
    });
    tx(s, st.label, {
      x: MX + 0.78, y: y, w: lw - 0.78, h: 0.5,
      fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
      objectName: "slides-field:Start" + (i + 1) + "Label",
    });
    tx(s, st.detail, {
      x: MX + 0.78, y: y + 0.5, w: lw - 0.78, h: 0.95,
      fontFace: T.fonts.body, fontSize: S.caption, color: CO.muted,
      objectName: "slides-field:Start" + (i + 1) + "Detail",
    });
  });

  // kanan: daftar siap-siap
  const rx = MX + lw + 0.5;
  const rw = CW - lw - 0.5;
  panel(s, {
    x: rx, y: 1.68, w: rw, h: 4.6,
    fill: tint("ink", 94), line: tint("ink", 100),
    objectName: "deco-prep-panel",
  });
  tx(s, C.s8.asideHead, {
    x: rx + 0.3, y: 1.94, w: rw - 0.6, h: 0.45,
    fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.ink,
    objectName: "deco-prep-head",
  });
  C.s8.aside.forEach((item, i) => {
    const y = 2.6 + i * 0.8;
    tx(s, item, {
      x: rx + 0.3, y: y, w: rw - 0.6, h: 0.5,
      fontFace: T.fonts.body, fontSize: S.body, color: CO.ink,
      objectName: "slides-field:Prep" + (i + 1),
    });
  });

  caption(s, C.s8.caption);
  s.addNotes(notesWithVisual(C.s8.notes, C.s8.visual));
}

// ------------------------------------------ 9. peran + data & akses -------
{
  const s = paperSlide();
  head(s, C.s9.title);
  comparison(s, C.s9.leftLabel, C.s9.left, C.s9.rightLabel, C.s9.right, 1.68, 4.6);
  caption(s, C.s9.caption);
  s.addNotes(C.s9.notes);
}

// ------------------------------------------ 10. status + manfaat ----------
{
  const s = paperSlide();
  head(s, C.s10.title);
  comparison(s, C.s10.readyLabel, C.s10.ready, C.s10.todoLabel, C.s10.todo, 1.66, 4.55);
  caption(s, C.s10.caption);
  s.addNotes(C.s10.notes);
}

// ------------------------------------------ 11. rencana + penutup --------
{
  const s = paperSlide();
  head(s, C.s11.title);

  const n = C.s11.phases.length;
  const colW = (CW - (n - 1) * 0.5) / n;
  const railY = 2.62;
  const centres = [];
  for (let i = 0; i < n; i++) centres.push(MX + i * (colW + 0.5) + colW / 2);

  rule(s, {
    x: centres[0], y: railY, w: centres[n - 1] - centres[0],
    line: { color: CO.muted, width: 1 },
    objectName: "deco-phase-rail",
  });

  for (let i = 0; i < n; i++) {
    const cx = centres[i];
    const lead = i === 1;
    dot(s, {
      x: cx - 0.14, y: railY - 0.14, w: 0.28, h: 0.28,
      fill: { color: lead ? CO.accent : CO.muted },
      line: { color: lead ? CO.accent : CO.muted },
      objectName: "deco-phase-dot-" + (i + 1),
    });
    tx(s, C.s11.phases[i].when, {
      x: cx - colW / 2, y: 1.78, w: colW, h: 0.45,
      fontFace: T.fonts.heading, fontSize: S.body, bold: true,
      color: lead ? CO.accent : CO.ink, align: "center",
      objectName: "deco-phase-label-" + (i + 1),
    });
    tx(s, C.s11.phases[i].what, {
      x: cx - colW / 2, y: 2.9, w: colW, h: 1.0,
      fontFace: T.fonts.body, fontSize: S.caption, color: CO.muted,
      align: "center", objectName: "slides-field:Phase" + (i + 1),
    });
  }

  panel(s, {
    x: MX, y: 4.16, w: CW, h: 2.1,
    fill: { color: CO.ink }, line: { color: CO.ink },
    objectName: "deco-close-panel",
  });
  tx(s, C.s11.thanks, {
    x: MX + 0.44, y: 4.4, w: 6.6, h: 0.55,
    fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.paper,
    objectName: "slides-field:Thanks",
  });
  tx(s, C.s11.closing, {
    x: MX + 0.44, y: 5.02, w: 10.8, h: 0.5,
    fontFace: T.fonts.heading, fontSize: S.body, bold: true, color: CO.accent,
    objectName: "slides-field:Closing",
  });
  tx(s, C.s11.contact, {
    x: MX + 0.44, y: 5.62, w: 10.8, h: 0.4,
    fontFace: T.fonts.body, fontSize: S.caption, color: CO.paper,
    objectName: "slides-field:Contact",
  });

  s.addNotes(C.s11.notes);
}

pres
  .writeFile({ fileName: outPath })
  .then(() => console.log("wrote " + outPath))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
