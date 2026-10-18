/*
 * build-wargaja.cjs — generator deck "Wargaja: Kelola RT/RW dengan mudah!"
 *
 * Dibuat mengikuti skill `pptx` (composition by code dengan pptxgenjs) dan tema
 * "Wargaja Warm" dari skill `theme-factory`. Seluruh warna/ukuran huruf/margin
 * datang dari output/source/theme.json — tidak ada nilai tema yang ditulis di
 * dalam kode slide.
 *
 * Jalankan:
 *   node "D:\Wargaja\output\source\build-wargaja.cjs"
 */

const path = require("path");
const fs = require("fs");

const HERE = __dirname;
const OUT_DIR = path.resolve(HERE, "..");
const PPTXGEN = require("D:\\Wargaja\\.slides\\node_modules\\pptxgenjs");

const T = JSON.parse(fs.readFileSync(path.join(HERE, "theme.json"), "utf8"));
const C = T.colours;
const S = T.size;
const F = T.font;
const MX = T.margin.x;
const MY = T.margin.top;
const W = T.slide.w;
const H = T.slide.h;
const CONTENT_W = W - 2 * MX;
const ICONS = path.join(HERE, "icons");
const APP_ICON = path.join("D:\\Wargaja\\assets\\icons\\app_icon.png");

const icon = (name, colour) => path.join(ICONS, `${name}-${colour}.png`);
const INK_ICON = (name) => icon(name, C.ink);
const DEEP_ICON = (name) => icon(name, C.accentDeep);

// Semua teks slide, satu tempat. Tidak ada kata yang ditulis di dalam kode gambar.
const TXT = {
  s1: {
    brand: "Wargaja",
    tagline: "Kelola RT/RW dengan mudah!",
    platform: "Tersedia di Android, iOS, dan web",
    audience: "Sosialisasi untuk [nama RT/RW/perumahan]",
    date: "[tanggal presentasi]",
    notes:
      "Selamat datang, Bapak dan Ibu. Terima kasih sudah menyempatkan waktu. Hari ini kami memperkenalkan Wargaja, satu aplikasi untuk membantu urusan RT/RW. Presentasi ini sekitar sepuluh sampai lima belas menit, lalu kita buka tanya jawab. Aplikasi ini masih dalam tahap uji coba, jadi masukan Bapak dan Ibu sangat kami harapkan.",
  },
  s2: {
    title: "Masalah yang sering terjadi",
    rows: [
      { i: "cost", l: "Catatan iuran masih manual", d: "Buku kas dan catatan kertas mudah hilang atau keliru." },
      { i: "chat", l: "Pengumuman tenggelam di grup chat", d: "Informasi penting hilang tertimpa obrolan." },
      { i: "data", l: "Data warga belum rapi", d: "Data tersebar dan sulit dicari saat dibutuhkan." },
      { i: "folder", l: "Laporan sulit dibuat", d: "Menyusun laporan bulanan memakan waktu." },
    ],
    notes:
      "Ini keluhan yang sering kita dengar di banyak lingkungan, bukan penilaian atas kerja pengurus. Silakan Bapak dan Ibu menyahut kalau pengalamannya berbeda. Tujuannya sederhana: kita tahu sama tahu apa yang bikin repot, supaya solusinya tepat.",
  },
  s3: {
    title: "Perkenalan Wargaja",
    statement:
      "Wargaja menyatukan iuran, pengumuman, kegiatan, dan data warga dalam satu aplikasi yang mudah dipakai.",
    support: "Satu aplikasi untuk pengurus dan seluruh warga.",
    notes:
      "Satu kalimat saja: semua urusan lingkungan dikumpulkan di satu tempat. Jadi tidak perlu lagi mencari pengumuman di grup chat, atau mencatat iuran di buku terpisah. Aplikasi ini tidak mengganti orangnya, hanya merapikan tempatnya.",
  },
  s4: {
    title: "Iuran: catat dan pantau",
    points: [
      "Catat iuran bulanan warga",
      "Tandai siapa yang sudah dan belum bayar",
      "Riwayat pembayaran tersimpan",
    ],
    ph: "Tempat tangkapan layar:\nmenu Iuran",
    notes:
      "Menu iuran membantu bendahara. Pengurus bisa melihat siapa yang sudah dan belum membayar, dan riwayatnya tersimpan. Pembayaran tetap seperti biasa: warga membayar, lalu pengurus mencatat. Tidak ada pemotongan otomatis dari aplikasi.",
  },
  s5: {
    title: "Pengumuman dan kegiatan warga",
    points: [
      "Pengumuman resmi tersimpan di satu tempat",
      "Jadwal gotong royong dan acara warga",
      "Tidak lagi tenggelam di grup chat",
    ],
    ph: "Tempat tangkapan layar:\npengumuman & jadwal kegiatan",
    notes:
      "Pengumuman resmi dan jadwal kegiatan tersimpan di aplikasi, jadi bisa dicari kembali kapan saja. Untuk sementara, pengumuman tetap kami bagikan juga lewat grup chat supaya tidak ada yang tertinggal. Aplikasi ini pelengkap, bukan pengganti kebiasaan kita berkumpul.",
  },
  s6: {
    title: "Data warga dan laporan",
    cells: [
      { i: "data", l: "Data warga rapi", d: "Data diri, keluarga, dan rumah tersimpan di satu tempat." },
      { i: "money", l: "Laporan lebih cepat", d: "Laporan iuran bisa diunduh untuk rapat bulanan." },
      { i: "guide", l: "Surat warga tercatat", d: "Permintaan surat warga tersimpan dan bisa ditelusuri." },
    ],
    ph: "Tempat tangkapan layar:\nlaporan iuran",
    notes:
      "Bagian ini untuk pengurus. Data warga tersimpan rapi, laporan iuran bisa diunduh untuk rapat bulanan, dan permintaan surat tercatat. Yang perlu saya sampaikan terus terang: ringkasan keuangan di aplikasi masih memakai data contoh, jadi belum dijadikan patokan resmi sampai pengurus selesai menyiapkannya.",
  },
  s7: {
    title: "Cara mulai: tiga langkah mudah",
    steps: [
      { n: "1", l: "Daftar", d: "Isi nama, email, dan kata sandi." },
      { n: "2", l: "Masuk", d: "Buka aplikasi dan masuk ke akun Anda." },
      { n: "3", l: "Mulai pakai", d: "Lihat iuran, pengumuman, dan kegiatan." },
    ],
    notes:
      "Tiga langkah saja. Daftar dengan nama, email, dan kata sandi; bisa juga memakai akun Google. Lalu masuk, dan mulai melihat iuran, pengumuman, serta kegiatan. Kalau ada yang tersendat, pengurus akan mendampingi — tidak perlu malu bertanya.",
  },
  s8: {
    title: "Manfaat untuk pengurus dan warga",
    leftHead: "Untuk pengurus",
    left: ["Catatan iuran lebih rapi", "Laporan lebih cepat dibuat", "Data warga mudah dicari"],
    rightHead: "Untuk warga",
    right: ["Iuran tidak perlu antre", "Pengumuman mudah dicari", "Tahu jadwal kegiatan"],
    notes:
      "Untuk pengurus, pekerjaan menjadi lebih tertata. Untuk warga, informasi lebih mudah dicari dan tidak perlu menunggu giliran untuk hal-hal sederhana. Saya tidak akan menjanjikan semua pekerjaan manual langsung hilang — perubahannya bertahap.",
  },
  s9: {
    title: "Keamanan dan privasi data warga",
    rows: [
      { i: "check", t: "Data diisi sendiri oleh warga" },
      { i: "key", t: "Tampilan dan menu dipisah menurut peran" },
      { i: "secure", t: "Hanya pengurus terkait yang melihat data yang diperlukan" },
      { i: "check", t: "Data bisa diperbaiki bila ada yang keliru" },
    ],
    note: "Aturan rinci soal penyimpanan data ditetapkan bersama pengurus.",
    notes:
      "Saya tidak akan mengklaim hal-hal yang belum bisa dibuktikan, misalnya soal enkripsi. Yang bisa saya pastikan: data diisi sendiri oleh warga, tampilan dan menu dipisah menurut peran, dan hanya pengurus terkait yang melihat data yang diperlukan. Aturan rincinya akan kita tetapkan bersama, dan kami terbuka kalau Bapak dan Ibu ingin membahasnya lebih dulu.",
  },
  s10: {
    title: "Rencana penerapan",
    where: "[nama lingkungan]",
    phases: [
      { l: "Perkenalan", t: "[minggu 1]" },
      { l: "Uji coba terbatas", t: "[minggu 2-3]" },
      { l: "Perbaikan", t: "[minggu 4]" },
      { l: "Dipakai bersama", t: "[minggu 5]" },
    ],
    note: "Jadwal ini usulan, dan bisa berubah sesuai kesepakatan pengurus.",
    notes:
      "Ini usulan tahapan, bukan jadwal yang sudah diputuskan. Tahap dua adalah uji coba terbatas: beberapa warga dan pengurus mencoba lebih dulu, lalu kita perbaiki yang kurang nyaman. Boleh saya tahu, siapa yang bersedia ikut uji coba terbatas?",
  },
  s11: {
    title: "Terima kasih",
    ask: "Mari mulai pakai Wargaja di [nama lingkungan].",
    qa: "Sesi tanya jawab",
    contact: ["Narahubung: [nama pengurus]", "[nomor WhatsApp]", "[alamat email]"],
    notes:
      "Terima kasih atas waktunya, dan terima kasih atas semua masukan. Silakan bertanya apa saja, termasuk yang menurut Bapak dan Ibu menyulitkan. Kalau ada hal yang belum bisa saya jawab hari ini, akan saya catat dan saya kabari lewat [nama pengurus].",
  },
  s12: {
    title: "Cadangan: tanya jawab",
    qa: [
      { q: "Apakah Wargaja berbayar?", a: "Belum ada biaya untuk warga." },
      { q: "Bagaimana kalau saya tidak punya smartphone?", a: "Bisa dibantu pengurus, atau lewat browser web di komputer." },
      { q: "Apakah data saya aman?", a: "Data diisi sendiri oleh warga, dan tampilan dipisah menurut peran." },
      { q: "Siapa saja yang bisa melihat data saya?", a: "Warga melihat datanya sendiri, pengurus hanya yang diperlukan." },
      { q: "Bagaimana kalau saya lupa kata sandi?", a: "Di halaman masuk ada menu Lupa kata sandi." },
    ],
    notes:
      "Slide ini untuk berjaga-jaga. Lima pertanyaan yang paling sering muncul sudah disiapkan jawabannya. Kalau pertanyaannya belum ada di sini, catat dan jawab setelah pertemuan — jangan mengarang.",
  },
};

const pres = new PPTXGEN();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5 — wajib sebelum addSlide

// ---------------------------------------------------------------- helpers --
function addSlide() {
  return pres.addSlide();
}

function text(slide, body, opts) {
  // margin 0: teks sejajar persis dengan bentuk di sebelahnya
  slide.addText(body, Object.assign({ margin: 0, fontFace: F, color: C.ink, valign: "top" }, opts));
}

function shape(slide, kind, opts) {
  slide.addShape(kind, opts);
}

function washPanel(slide, o) {
  shape(slide, "roundRect", Object.assign({
    rectRadius: 0.12,
    fill: { color: T.wash.colour, transparency: T.wash.transparency },
    line: { color: C.paper, width: 0.5 },
  }, o));
}

function dot(slide, x, y, d, colour) {
  shape(slide, "ellipse", {
    x, y, w: d, h: d,
    fill: { color: colour },
    line: { color: colour, width: 0.25 },
  });
}

function slideNumber(slide, n) {
  text(slide, String(n), {
    x: W - MX - 0.6, y: 6.5, w: 0.6, h: 0.36,
    fontSize: S.foot, color: C.muted, align: "right",
  });
}

function title(slide, body) {
  text(slide, body, {
    x: MX, y: MY, w: CONTENT_W, h: 0.95,
    fontSize: S.title, bold: true, color: C.ink, valign: "top",
  });
}

function placeholder(slide, x, y, w, h, label) {
  shape(slide, "roundRect", {
    x, y, w, h, rectRadius: 0.12,
    fill: { color: C.paper },
    line: { color: C.muted, width: 1, dashType: "dash" },
  });
  text(slide, label, {
    x: x + 0.2, y: y + h / 2 - 0.7, w: w - 0.4, h: 1.4,
    fontSize: S.label, color: C.muted, align: "center", valign: "middle",
  });
}

// ------------------------------------------------------------------ 1 -----
{
  const s = addSlide();
  s.background = { color: C.paper };

  // motif: piringan hangat, memotong tepi kanan dan bawah (atas tetap di dalam margin)
  dot(s, 7.25, 0.75, 6.6, C.accent);
  s.addImage({ path: APP_ICON, x: 9.58, y: 3.08, w: 1.95, h: 1.95 });

  text(s, TXT.s1.brand, {
    x: MX, y: 2.0, w: 6.2, h: 1.2,
    fontSize: 54, bold: true, color: C.ink,
  });
  text(s, TXT.s1.tagline, {
    x: MX, y: 3.3, w: 6.3, h: 1.25,
    fontSize: S.lead, color: C.accentDeep,
  });
  text(s, TXT.s1.platform, {
    x: MX, y: 4.65, w: 6.3, h: 0.9,
    fontSize: S.body, color: C.ink,
  });
  text(s, TXT.s1.audience, {
    x: MX, y: 5.65, w: 6.3, h: 0.8,
    fontSize: S.label, color: C.muted,
  });
  text(s, TXT.s1.date, {
    x: MX, y: 6.5, w: 6.3, h: 0.4,
    fontSize: S.label, color: C.muted,
  });

  s.addNotes(TXT.s1.notes);
}

// ------------------------------------------------------------------ 2 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s2.title);
  slideNumber(s, 2);

  const rowH = 1.2;
  TXT.s2.rows.forEach((r, i) => {
    const y = 1.72 + i * rowH;
    dot(s, MX, y + 0.06, 0.66, C.accent);
    s.addImage({ path: INK_ICON(r.i), x: MX + 0.15, y: y + 0.21, w: 0.36, h: 0.36 });
    text(s, r.l, {
      x: MX + 0.95, y: y, w: CONTENT_W - 0.95, h: 0.5,
      fontSize: S.body, bold: true, color: C.ink,
    });
    text(s, r.d, {
      x: MX + 0.95, y: y + 0.52, w: CONTENT_W - 0.95, h: 0.5,
      fontSize: S.label, color: C.muted,
    });
  });

  s.addNotes(TXT.s2.notes);
}

// ------------------------------------------------------------------ 3 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s3.title);
  slideNumber(s, 3);

  washPanel(s, { x: MX, y: 2.0, w: CONTENT_W, h: 3.5 });
  text(s, TXT.s3.statement, {
    x: MX + 0.7, y: 2.5, w: CONTENT_W - 1.4, h: 1.95,
    fontSize: S.lead, color: C.ink,
  });
  text(s, TXT.s3.support, {
    x: MX + 0.7, y: 4.7, w: CONTENT_W - 1.4, h: 0.5,
    fontSize: S.label, color: C.muted,
  });

  s.addNotes(TXT.s3.notes);
}

// ------------------------------------------------------------------ 4 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s4.title);
  slideNumber(s, 4);

  TXT.s4.points.forEach((p, i) => {
    const y = 2.05 + i * 1.0;
    dot(s, MX, y + 0.08, 0.34, C.accent);
    text(s, p, {
      x: MX + 0.62, y: y, w: 6.3, h: 0.88,
      fontSize: S.body, color: C.ink,
    });
  });

  placeholder(s, 7.9, 2.0, 4.73, 3.9, TXT.s4.ph);
  s.addNotes(TXT.s4.notes);
}

// ------------------------------------------------------------------ 5 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s5.title);
  slideNumber(s, 5);

  placeholder(s, MX, 2.0, 4.73, 3.9, TXT.s5.ph);

  TXT.s5.points.forEach((p, i) => {
    const y = 2.05 + i * 1.0;
    dot(s, 6.13, y + 0.08, 0.34, C.accent);
    text(s, p, {
      x: 6.75, y: y, w: 5.88, h: 0.88,
      fontSize: S.body, color: C.ink,
    });
  });

  s.addNotes(TXT.s5.notes);
}

// ------------------------------------------------------------------ 6 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s6.title);
  slideNumber(s, 6);

  const cw = (CONTENT_W - 0.6) / 2;
  const ch = 1.95;
  const cells = [
    { x: MX, y: 1.85 },
    { x: MX + cw + 0.6, y: 1.85 },
    { x: MX, y: 4.05 },
  ];

  TXT.s6.cells.forEach((cell, i) => {
    const { x, y } = cells[i];
    washPanel(s, { x, y, w: cw, h: ch });
    s.addImage({ path: INK_ICON(cell.i), x: x + 0.3, y: y + 0.28, w: 0.4, h: 0.4 });
    text(s, cell.l, {
      x: x + 0.86, y: y + 0.25, w: cw - 1.16, h: 0.5,
      fontSize: S.body, bold: true, color: C.ink,
    });
    text(s, cell.d, {
      x: x + 0.3, y: y + 0.9, w: cw - 0.6, h: 0.9,
      fontSize: S.label, color: C.muted,
    });
  });

  placeholder(s, MX + cw + 0.6, 4.05, cw, ch, TXT.s6.ph);
  s.addNotes(TXT.s6.notes);
}

// ------------------------------------------------------------------ 7 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s7.title);
  slideNumber(s, 7);

  const cw = (CONTENT_W - 1.2) / 3;
  TXT.s7.steps.forEach((st, i) => {
    const x = MX + i * (cw + 0.6);
    dot(s, x, 2.05, 1.0, C.accent);
    text(s, st.n, {
      x: x, y: 2.05, w: 1.0, h: 1.0,
      fontSize: S.title, bold: true, color: C.ink, align: "center", valign: "middle",
    });
    text(s, st.l, {
      x: x, y: 3.35, w: cw, h: 0.5,
      fontSize: S.body, bold: true, color: C.ink,
    });
    text(s, st.d, {
      x: x, y: 3.9, w: cw, h: 0.9,
      fontSize: S.label, color: C.muted,
    });
  });

  s.addNotes(TXT.s7.notes);
}

// ------------------------------------------------------------------ 8 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s8.title);
  slideNumber(s, 8);

  const cw = (CONTENT_W - 0.6) / 2;
  const y = 1.85;
  const h = 4.3;

  // kiri: bidang hangat. kanan: bidang bergaris — bukan dua kartu kembar.
  washPanel(s, { x: MX, y, w: cw, h });
  text(s, TXT.s8.leftHead, {
    x: MX + 0.45, y: y + 0.35, w: cw - 0.9, h: 0.5,
    fontSize: S.body, bold: true, color: C.ink,
  });
  text(s, TXT.s8.left.map((t) => ({ text: t, options: { breakLine: true, paraSpaceAfter: 14 } })), {
    x: MX + 0.45, y: y + 1.15, w: cw - 0.9, h: h - 1.5,
    fontSize: S.label, color: C.ink,
  });

  const rx = MX + cw + 0.6;
  shape(s, "roundRect", {
    x: rx, y, w: cw, h, rectRadius: 0.12,
    fill: { color: C.paper }, line: { color: C.muted, width: 1 },
  });
  text(s, TXT.s8.rightHead, {
    x: rx + 0.45, y: y + 0.35, w: cw - 0.9, h: 0.5,
    fontSize: S.body, bold: true, color: C.ink,
  });
  text(s, TXT.s8.right.map((t) => ({ text: t, options: { breakLine: true, paraSpaceAfter: 14 } })), {
    x: rx + 0.45, y: y + 1.15, w: cw - 0.9, h: h - 1.5,
    fontSize: S.label, color: C.ink,
  });

  s.addNotes(TXT.s8.notes);
}

// ------------------------------------------------------------------ 9 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s9.title);
  slideNumber(s, 9);

  TXT.s9.rows.forEach((r, i) => {
    const y = 2.0 + i * 0.92;
    const deep = r.i === "key" || r.i === "secure";
    s.addImage({
      path: deep ? DEEP_ICON(r.i) : INK_ICON(r.i),
      x: MX, y: y + 0.04, w: 0.38, h: 0.38,
    });
    text(s, r.t, {
      x: MX + 0.68, y: y, w: CONTENT_W - 0.68, h: 0.5,
      fontSize: S.body, color: C.ink,
    });
  });

  text(s, TXT.s9.note, {
    x: MX, y: 5.95, w: CONTENT_W, h: 0.5,
    fontSize: S.label, color: C.muted,
  });

  s.addNotes(TXT.s9.notes);
}

// ----------------------------------------------------------------- 10 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s10.title);
  slideNumber(s, 10);
  text(s, TXT.s10.where, {
    x: MX, y: 1.52, w: CONTENT_W, h: 0.5,
    fontSize: S.label, color: C.muted,
  });

  const n = TXT.s10.phases.length;
  const cw = (CONTENT_W - 1.5) / n;
  const railY = 3.82;
  const centres = [];
  for (let i = 0; i < n; i++) centres.push(MX + i * (cw + 0.5) + cw / 2);

  shape(s, "line", {
    x: centres[0], y: railY, w: centres[n - 1] - centres[0], h: 0,
    line: { color: C.muted, width: 1.25 },
  });

  TXT.s10.phases.forEach((ph, i) => {
    const cx = centres[i];
    dot(s, cx - 0.19, railY - 0.19, 0.38, C.accent);
    text(s, ph.l, {
      x: cx - cw / 2, y: 2.42, w: cw, h: 0.95,
      fontSize: S.body, bold: true, color: C.ink, align: "center",
    });
    text(s, ph.t, {
      x: cx - cw / 2, y: 4.25, w: cw, h: 0.5,
      fontSize: S.label, color: C.muted, align: "center",
    });
  });

  text(s, TXT.s10.note, {
    x: MX, y: 5.5, w: CONTENT_W, h: 0.5,
    fontSize: S.label, color: C.muted,
  });

  s.addNotes(TXT.s10.notes);
}

// ----------------------------------------------------------------- 11 -----
{
  const s = addSlide();
  s.background = { color: C.paper };

  dot(s, 8.6, 3.1, 5.0, C.accent);

  text(s, TXT.s11.title, {
    x: MX, y: 1.45, w: 7.4, h: 1.05,
    fontSize: 54, bold: true, color: C.ink,
  });
  text(s, TXT.s11.ask, {
    x: MX, y: 2.6, w: 7.5, h: 1.3,
    fontSize: S.lead, color: C.accentDeep,
  });
  text(s, TXT.s11.qa, {
    x: MX, y: 4.1, w: 7.5, h: 0.5,
    fontSize: S.body, bold: true, color: C.ink,
  });
  TXT.s11.contact.forEach((line, i) => {
    text(s, line, {
      x: MX, y: 4.8 + i * 0.5, w: 7.5, h: 0.5,
      fontSize: S.label, color: C.muted,
    });
  });

  s.addNotes(TXT.s11.notes);
}

// ----------------------------------------------------------------- 12 -----
{
  const s = addSlide();
  s.background = { color: C.paper };
  title(s, TXT.s12.title);
  slideNumber(s, 12);

  TXT.s12.qa.forEach((pair, i) => {
    const y = 1.78 + i * 0.95;
    text(s, [
      { text: pair.q, options: { bold: true, color: C.ink, fontSize: S.label, breakLine: true, paraSpaceAfter: 6 } },
      { text: pair.a, options: { color: C.muted, fontSize: S.label } },
    ], {
      x: MX, y, w: CONTENT_W, h: 0.9,
      fontSize: S.label, color: C.ink,
    });
  });

  s.addNotes(TXT.s12.notes);
}

const outFile = path.join(OUT_DIR, "wargaja-presentasi-rtrw.pptx");
pres.writeFile({ fileName: outFile })
  .then(() => console.log("wrote " + outFile))
  .catch((err) => {
    console.error("GAGAL: " + err.message);
    process.exit(1);
  });
