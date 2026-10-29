# Wargaja — Audit Fitur (Feature Audit)

Sumber: kode sumber di `D:\Wargaja` (basis kode **Rukunin** oleh Squadron Team, dipakai ulang untuk merek **Wargaja**).
Tujuan: memastikan presentasi hanya menyebut fitur yang benar-benar ada. Nama "Rukunin" hanya dipakai di dokumen internal ini sebagai nama basis kode, tidak pernah sebagai nama produk di depan warga.

Legenda status:
- **TERVERIFIKASI** — ada layar + layanan/repositori + model, dan rutenya benar-benar bisa dibuka.
- **SEBAGIAN** — tampilan ada, tetapi datanya contoh/dummy, hanya di memori, atau tidak tersambung.
- **BELUM** — hanya disebut, dikomentari, atau tidak ada.

> Catatan metode: audit ini memeriksa `pubspec.yaml`, `README.md`, `lib/main.dart`, semua berkas rute (`lib/routes/`), lapisan halaman per peran, seluruh repositori (`lib/repositories/`, 16 berkas), seluruh layanan (`lib/services/`, `lib/modules/*/services/`), serta modul community/marketplace/activities/notification dan konfigurasi Firebase. Perilaku beberapa layar dipastikan dengan membaca langsung blok kode yang menyimpan data (mis. `report_issue_screen.dart`).

---

## 1. Yang benar-benar sudah bisa dipakai (dipakai di slide 4 sampai 10)

| Fitur | Peran | Bukti di kode |
|---|---|---|
| Iuran warga: lihat tagihan & riwayat pembayaran | warga, sekretaris, bendahara | `lib/modules/community/services/dues_service.dart` (koleksi Firestore `dues_payments`, `getUserPayments`) · `pages/community/dues_screen.dart` |
| Unggah bukti transfer iuran | warga | `dues_service.dart` → `submitPaymentWithFile` (Firebase Storage `receipts/...`, status `pending`) · `payment_confirmation_screen.dart` |
| Verifikasi/tolak pembayaran oleh bendahara | bendahara | `dues_service.dart` → `verifyPayment` / `rejectPayment` · `pages/treasurer/data_iuran_page.dart`, `data_iuran_detail.dart` |
| Bantuan penandaan bukti pembayaran mencurigakan | bendahara | `lib/services/ml_firebase_service.dart` → `detectFakeReceipt` (endpoint Cloud Run) dipanggil di `data_iuran_detail.dart`; pemeriksaan sisi klien: `payment_confirmation_screen.dart` + `lib/utils/metrics/ssim_metric.dart` |
| Pengajuan surat & dokumen (kirim + lihat riwayat) | warga, sekretaris | `lib/modules/community/services/document_service.dart` → `createDocumentRequest` / `getUserDocumentRequests` (koleksi Firestore `document_requests`, lampiran via `StorageService`) · `document_request_form_screen.dart`, `documents_screen.dart` |
| Kegiatan warga: lihat, buat, ikut/keluar | semua peran | `lib/modules/activities/services/activity_service.dart` (koleksi `activities`: stream, `createEvent`, `updateEvent`, `deleteEvent`, `joinEvent`, `leaveEvent`) · `activity_screen.dart`, `pages/rt/activities/activities_screen.dart` |
| Pasar warga: toko, produk, keranjang, pesanan | semua peran | `modules/marketplace/services/product_service.dart` (`marketplace_products`), `shop_service.dart` (`marketplace_shops`), `cart_service.dart` (`user_carts`), `order_service.dart` (`orders`) |
| Lihat data kependudukan | warga, sekretaris | `modules/community/pages/population_info_screen.dart` (membaca koleksi `users`) |
| Lihat data keluarga/KK | warga, sekretaris | `modules/community/pages/family_details_screen.dart` (membaca `users`) |
| Notifikasi pengingat kegiatan di perangkat | semua peran | `lib/services/notification_service.dart` (`flutter_local_notifications`); widget beranda Android: `activity_widget_service.dart` + `android/.../ActivityWidgetProvider.kt` |
| Ekspor laporan iuran (PDF/Excel/CSV) | warga, sekretaris, bendahara | `lib/modules/community/services/report_generator_service.dart` |
| Masuk dengan email & kata sandi, atau akun Google | semua peran | `lib/modules/auth/services/auth_service.dart` (`signIn`, `signUp`, `sendPasswordResetEmail`, `signInWithGoogle`) · `google_auth_service.dart` |
| Pendataan awal (onboarding) | warga | `lib/modules/auth/services/onboarding_service.dart` → menulis profil ke `users/{uid}` |
| Kunci aplikasi dengan sidik jari/wajah (perangkat) | semua peran | `lib/services/biometric_auth_service.dart` (`local_auth`) · `pages/biometric_lock_screen.dart` |
| Enam peran dengan tampilan berbeda | semua | `lib/utils/role_based_navigator.dart` (admin, ketua_rt, ketua_rw, secretary, treasurer, resident) · `lib/routes/*_routes.dart` |

Referensi koleksi Firestore yang dipakai kode: `users`, `activities`, `marketplace_shops`, `marketplace_products`, `products`, `user_carts`, `orders`, `dues_payments`, `user_payments`, `document_requests`.

---

## 2. Tampilan ada tetapi belum tersambung (tidak dipakai di slide sebagai fitur yang siap)

| Fitur | Status | Bukti |
|---|---|---|
| **Lapor masalah (report issue)** | SEBAGIAN — tidak tersimpan | `lib/pages/resident/report_issue_screen.dart` → `_submitReport()` berisi komentar `// Simulate API call` + `Future.delayed`; tidak ada Firestore/Storage. Hanya menampilkan dialog berhasil. |
| **Kirim saran (submit suggestion)** | SEBAGIAN — tidak tersimpan | `lib/pages/resident/submit_suggestion_screen.dart` → `_submitSuggestion()` sama: `// Simulate API call`. |
| Pengumuman warga (baca) | SEBAGIAN — data contoh | Rute `/resident/announcements` memakai `pages/rt/announcements/announcements_screen.dart` dengan `lib/repositories/announcementsRT.dart` (daftar statis, bukan Firestore). |
| Kelola pengajuan surat di sisi pengurus | SEBAGIAN — tidak tersambung | `pages/rt/surat_form_warga/kelola_pengajuan_surat_screen.dart` memakai `repositories/document_requests_repository.dart` (demo di memori), padahal pengajuan warga tersimpan di Firestore `document_requests`. Alur belum menyatu. |
| Transparansi keuangan | SEBAGIAN — data statis | `modules/community/pages/finance_transparency_screen.dart` → `finance_transparency_section.dart`; angka dari fungsi lokal `_getIncomes()`/`_getExpenses()`, bukan Firestore. Ekspor PDF/Excel/CSV-nya nyata. |
| Data rumah (home details) | SEBAGIAN | `modules/community/pages/home_details_screen.dart` masih memuat catatan `// TODO: Load data from backend/database`. |
| Riwayat transaksi bendahara | SEBAGIAN — dummy | `pages/treasurer/transactions_page.dart` memakai `repositories/transactions_repository.dart` (daftar hardcoded). |
| Pemasukan & pengeluaran bendahara | SEBAGIAN | `pemasukan_screen.dart`, `pengeluaran_screen.dart` — tidak ditemukan penyimpanan Firestore/repositori. |
| Kategori & analisis bendahara | SEBAGIAN | `kategori_screen.dart` (`category_repository.dart`, singleton di memori); `analysis_screen.dart` memakai `_dummySeries`. |
| Riwayat pembayaran & kwitansi digital (menu warga) | BELUM — tautan mati | Menu mengarah ke `/resident/payment-history` dan `/resident/digital-receipts`, keduanya **tidak punya rute**. Ketuk akan menampilkan galat navigasi. |
| Daftar warga, keluarga, wilayah (RT) | SEBAGIAN — dummy | `warga_list_screen.dart`, `family_list_screen.dart`, `wilayah_rt_screen.dart` memakai `WargaRepository.generateDummy(...)`, `streets.dart`. |
| Laporan warga (RT) & statistik | SEBAGIAN — dummy | `manage_reports_screen.dart` (`reports_repository.dart`, demo di memori); `laporan_rt_screen.dart` (`statistik_repository.dart`, hardcoded). |
| Surat RT→RW, mutasi, rapat | SEBAGIAN — di memori | `surat_to_rw/screen.dart` (`lib/models/rt_letter.dart`), `mutasi_list_screen.dart`, `meetings_screen.dart` (`meeting_repository.dart`). |
| Seluruh modul RW (data warga, iuran, kegiatan, laporan, monitoring, kinerja RT) | SEBAGIAN — dummy/simulasi | `pages/rw/...` memakai `DummyWargaData`, `DummyStatusIuranData`, `DummyData`, `DummyKegiatanData`; `monitoring_socket_service.dart` hanyalah `Timer.periodic` berisi angka acak. |
| Modul sekretaris (surat, arsip, notulen, laporan bulanan) | SEBAGIAN — di memori | `lib/pages/secretary/` tidak memakai `FirebaseFirestore` sama sekali; data hilang saat aplikasi ditutup (`minutes_screen.dart`, `letter_history_screen.dart`, `monthly-reports_screen.dart`, `meeting_service.dart`). |
| Modul admin (verifikasi, permintaan akun, peran, log, backup, analitik) | SEBAGIAN — mock | `lib/pages/admin/` tidak memakai Firestore; mis. `admin_activities_screen.dart` (`_mockActivities`), `verifikasi_list_page.dart`, `permintaan_akun_list_page.dart`, `admin_backup_data_page.dart` ("Download backup (dummy)"). |
| Rute `/rt/iuran` | BELUM | Masih berupa `Placeholder()` dengan komentar `// TODO: Create IuranScreen` (`lib/routes/rt_routes.dart`). |
| Unggah foto KTP/KK saat pendaftaran | BELUM | Layar ada, tetapi tidak ada pemakaian `image_picker`/Firebase Storage di modul auth; hanya kolom teks. |
| Lampiran foto pada lapor masalah | BELUM | `report_issue_screen.dart` masih memuat `// TODO: Implement image picker`. |

---

## 3. Klaim yang tidak boleh dipakai (dan sebabnya)

| Klaim | Kenapa tidak boleh |
|---|---|
| Pembayaran otomatis / payment gateway | Tidak ada integrasi gateway apa pun (pencarian nama gateway: midtrans, xendit, tripay, duitku, stripe, gopay, ovo, shopeepay → tidak ada). Alurnya unggah bukti + verifikasi manusia (`isAutoVerified: false`). |
| Verifikasi otomatis | Hanya komentar; statusnya tetap menunggu verifikasi pengurus. |
| Notifikasi push ke ponsel warga | Hanya notifikasi lokal terjadwal di perangkat; `firebase_messaging` tidak ada di `pubspec.yaml`. |
| Enkripsi, sertifikasi, cadangan data, jaminan keamanan | Tidak dapat diverifikasi. Tidak ada berkas aturan keamanan server. |
| Aturan akses berbasis server (security rules) | Tidak ada `firestore.rules`, `storage.rules`, atau `firestore.indexes.json` di repositori. Firebase App Check juga dinonaktifkan (komentar di `lib/main.dart`). |
| Data warga dikelola penuh oleh pengurus | Layar pengelolaan data warga masih memakai data dummy (bagian 2). |
| Melihat daftar warga / kontak darurat / riwayat pembayaran / kwitansi digital | Keempatnya tautan mati tanpa rute. |
| Login dengan sidik jari | Sidik jari/wajah hanyalah pengunci aplikasi di perangkat, bukan cara masuk ke akun. |
| Deteksi bukti palsu sebagai "AI yang selalu benar" | Yang ada: satu endpoint eksternal + pemeriksaan kemiripan gambar di ponsel. Tidak ada angka akurasi yang terukur di repositori. |
| Aplikasi berjalan penuh di iPhone | Inferensi model hanya diimplementasikan untuk Android; tidak ada implementasi di `ios/`. |

---

## 4. Perbedaan antara README dan kenyataan

| Klaim README | Kenyataan di kode |
|---|---|
| "Community finances and payments" | Pencatatan + unggah bukti + verifikasi pengurus. Tidak ada pembayaran daring. |
| "Firebase ... notifications" | Hanya notifikasi lokal di perangkat. Tidak ada push/FCM. |
| "Google Cloud Platform + Vertex AI ... custom ML model ... fake receipt" | Sebagian benar: inferensi di perangkat (Android) + endpoint Cloud Run untuk deteksi bukti + Firebase Functions. Detail "Vertex AI" tidak terlihat di repositori (tidak ada berkas fungsi/infrastruktur). |
| "manage administrative documents" | Pengajuan warga nyata (Firestore). Verifikasi di sisi pengurus masih memakai repositori contoh, jadi belum tersambung. |
| "events, meetings, and announcements" | Kegiatan nyata (Firestore). Pengumuman RT dan rapat masih data contoh. |
| "Android, iOS, and website" | Model ML dan widget beranda hanya Android. |

---

## 5. Catatan merek (penting)

- Nama yang tampil di dalam aplikasi saat ini adalah **"Rukunin"** (`lib/l10n/app_id.arb` → `appTitle`), begitu pula di `app_en.arb` dan `app_jv.arb`.
- Karena itu, tangkapan layar aplikasi apa adanya tidak disisipkan: setiap tangkapan layar akan menampilkan nama lama. Deck Wargaja memakai **mockup yang digambar dari bentuk dan tulisan** (slide 5, "Gambaran tampilan aplikasi"), memakai nama menu yang benar-benar ada di aplikasi, dan diberi keterangan tegas "bukan tangkapan layar, angka hanya contoh". Catatan `VISUAL TO ADD` tetap ditaruh di slide 4 dan 8 supaya pengurus menyisipkan tangkapan layar asli setelah aplikasi berganti nama menjadi Wargaja.
- Saran untuk tim: ganti `appTitle` di ketiga berkas lokalisasi menjadi "Wargaja" **setelah** keputusan merek disetujui, lalu ambil tangkapan layar baru untuk slide 4 dan 8.
- Aset nyata yang sudah ada di repositori dan bisa dipakai untuk materi pendamping: `docs/img/banner.png`, `docs/img/rukunin-app-preview.png`, `docs/img/architectural-diagram.jpg`. Ketiganya masih memuat merek lama, jadi belum dipakai di dalam deck.

---

## 6. Fakta rinci yang dipakai di deck (verifikasi lanjutan)

Bagian ini mencatat detail yang dipakai untuk menambah informasi pada deck sosialisasi. Semua diambil langsung dari kode.

### 6.1 Jenis surat dan dokumen yang tersedia (slide 9)

Enam jenis, didefinisikan di `lib/routes/resident_routes.dart` (dan rute setara untuk peran secretary dan treasurer):

| Jenis | `documentType` | Judul di aplikasi |
|---|---|---|
| Surat keterangan domisili | `domicile` | "Surat Keterangan Domisili" |
| Surat keterangan tidak mampu | `sktm` | "Surat Keterangan Tidak Mampu" |
| Surat keterangan usaha | `business` | "Surat Keterangan Usaha" |
| Permohonan koreksi data | `correction` | "Permohonan Koreksi Data" |
| Surat keterangan keluarga | `family` | "Surat Keterangan Keluarga" |
| Surat lainnya | `other` | "Surat Lainnya" |

Rute: `/resident/community/documents/{domicile|sktm|business|correction|family|other}` → `DocumentRequestFormScreen`.

Kolom yang diisi pada formulir (`lib/modules/community/pages/document_request_form_screen.dart`): **Tujuan Pengajuan**, **Catatan Tambahan**, dan **Lampiran Dokumen** (unggahan).

### 6.2 Alur akun warga (slide 11 dan 12)

- **Buat akun:** `lib/modules/auth/pages/sign_up_screen.dart` — isian: nama lengkap, email, kata sandi, konfirmasi kata sandi; atau daftar dengan Google. Lihat juga `lib/modules/auth/services/auth_service.dart` → `signUp` (`createUserWithEmailAndPassword`) dan `_createUserDocument`.
- **Masuk:** `sign_in_screen.dart` — email dan kata sandi, atau masuk dengan Google.
- **Lupa kata sandi:** tombol "Lupa kata sandi?" di `sign_in_screen.dart` → `AuthService.sendPasswordResetEmail`.
- **Peran tidak dipilih sendiri:** `auth_service.dart` menulis `role: 'resident'` saat pendaftaran; peran lain diberikan pengurus (`lib/utils/role_based_navigator.dart`).
- **Pengisian data sekali saja:** `OnboardingService.submitOnboardingData` (`onboarding_service.dart`) menulis `onboardingCompleted: true` setelah data diisi.

### 6.3 Isian data warga (slide 12)

Dari `lib/modules/auth/pages/onboarding/ktp_page.dart` dan `kk_page.dart`:

- Halaman KTP: NIK (16 digit), tempat lahir, tanggal lahir, jenis kelamin, alamat, RT, RW, kelurahan, kecamatan, agama, status perkawinan, pekerjaan, pendidikan terakhir (opsional).
- Halaman KK: nomor kartu keluarga (16 digit), nama kepala keluarga, hubungan dengan kepala keluarga.
- Halaman pembuka (`welcome_page.dart`) menyatakan dua langkah tersebut secara eksplisit: data KTP dan data KK.

### 6.4 Pemberitahuan verifikasi data (slide 13)

Aplikasi sendiri menyatakan kepada warga, pada halaman pembuka pendaftaran:

> `dataVerificationNotice` — "Data yang Anda masukkan akan diverifikasi oleh pengurus ..." (`lib/l10n/app_id.arb`)

**Catatan penting:** pernyataan itu ada di sisi aplikasi/warga. Menu pemeriksaan data di sisi pengurus belum selesai (see bagian 2: verifikasi & permintaan akun masih mock). Karena itu deck menyebut "diperiksa pengurus" sebagai rencana yang sedang disiapkan, bukan sebagai pemeriksaan yang sudah berjalan.

### 6.5 Notifikasi dan ekspor

- **Pengingat kegiatan di perangkat:** `lib/services/notification_service.dart` (`flutter_local_notifications`, `scheduleEventReminders`). Hanya lokal di ponsel; tidak ada push ke semua warga.
- **Ekspor laporan:** `lib/modules/community/services/report_generator_service.dart` — laporan iuran dapat diekspor ke PDF, Excel, dan CSV.

---

## 7. Review deck eksternal: `Presentasi Sosialisasi Aplikasi Wargaja.pptx`

Ada satu berkas deck lain di folder `presentation/` bernama `Presentasi Sosialisasi Aplikasi Wargaja.pptx` (14 slide, metadata menyebut "generated using python-pptx"). Berkas ini **bukan** keluaran `Wargaja_Presentasi_Warga.build.cjs`. Isinya diperiksa baris per baris dan ditemukan beberapa klaim yang **tidak didukung kode**. Deck itu tidak dihapus, tetapi klaim-klaim ini tidak dipakai di deck Wargaja yang terverifikasi.

### 7.1 Klaim yang tidak boleh dipakai (harus diganti sebelum presentasi)

| Slide di deck eksternal | Klaim | Kenapa salah / tidak boleh |
|---|---|---|
| 1 | "transparansi keuangan" sebagai janji utama | Transparansi keuangan masih memakai data contoh (`finance_transparency_section.dart` memakai `_getIncomes()`/`_getExpenses()` lokal). |
| 3 | "Dapat diakses melalui Smartphone Android & iOS" | Inferensi model dan widget beranda hanya Android; tidak ada implementasi iOS (tidak ada berkas ONNX di `ios/`). |
| 3 | "Pencatatan iuran real-time & otomatis" | Tidak ada pencatatan otomatis. Bukti transfer diunggah, lalu diverifikasi manusia (status `pending`, `isAutoVerified: false`). |
| 3 | "Laporan keuangan terbuka untuk seluruh warga" | Layar transparansi keuangan masih data statis, bukan laporan nyata. |
| 4 | "notifikasi pengingat iuran bulanan" | Notifikasi yang ada hanya pengingat kegiatan di perangkat (`notification_service.dart`). Tidak ada pengingat iuran otomatis. |
| 4 | "Setiap transaksi tercatat otomatis ... sebagai bukti sah" | Pencatatan dilakukan setelah pengurus memverifikasi; "bukti sah" adalah klaim hukum yang tidak bisa dibuktikan aplikasi. |
| 5 | Angka kas "Rp 7.000.000 / Rp 4.000.000 / Rp 3.000.000" sebagai data nyata | Angka ini tidak ada di kode mana pun. Menyajikan angka rekaan sebagai laporan kas berisiko menyesatkan warga. |
| 7 | "Unduh Dokumen — surat pengantar siap diunduh atau dicetak" | Aplikasi hanya mencatat permintaan surat (koleksi `document_requests`). Tidak ada pembuatan atau pengunduhan berkas surat. |
| 8 | "Tombol Bantuan Darurat ... sinyal bantuan cepat" | Tidak ada fitur darurat di kode. Rute `emergency-contacts` justru termasuk tautan mati (tidak punya rute). |
| 8 | "Pemberitahuan ... langsung ke HP warga" | Hanya notifikasi lokal di perangkat; tidak ada push/FCM (`firebase_messaging` tidak ada di `pubspec.yaml`). |
| 9 | "Enkripsi Data ... standar enkripsi terpercaya" | Tidak dapat diverifikasi. Tidak ada berkas aturan keamanan server. Ini jaminan keamanan yang harus dihindari. |
| 9 | "Hanya warga terverifikasi yang dapat mengakses" | Pemeriksaan/verifikasi akun belum berjalan (halaman verifikasi dan permintaan akun masih mock). Yang benar-benar berjalan adalah pemisahan tampilan menurut peran. |
| 10 | Empat gambar antarmuka dengan angka "Rp 5.000.000 / Rp 4.000.000 / Rp 1.000.000" | Angka rekaan di dalam gambar. Selain itu tangkapan layar akan menampilkan nama lama "Rukunin". |
| 11 | "Rekapitulasi Otomatis — Laporan kas dapat diunduh" | Bagian ekspor (PDF/Excel/CSV) memang ada (`report_generator_service.dart`), tetapi "rekapitulasi otomatis" berlebihan: angkanya masih perlu diisi/diverifikasi pengurus. |
| 12 | "Dapatkan Wargaja di Google Play Store atau App Store" | Aplikasi belum diterbitkan. Yang ada hanya edisi uji coba (README menyebut Firebase App Distribution). |
| 12 | "Daftarkan data diri dan pilih lokasi RT/RW tempat tinggal Anda" | Tidak ada fitur memilih lokasi/RT/RW. Saat mendaftar, peran otomatis "resident"; RT/RW hanya diisi sebagai teks saat pendaftaran. |
| 12 | "Setelah disetujuI pengurus, nikmati seluruh layanan" | Tidak ada gerbang persetujuan yang berjalan. Yang ada hanya gerbang pengisian data (`onboardingCompleted`). |
| 10, 11, 12 | Kalimat pemasaran: "Kaya fitur nan multi-fungsi", "Keuangan terjamin transparan" | Bahasa iklan tanpa dasar; tidak cocok untuk audiens warga dan melemahkan kepercayaan. |
| 4 | Judul "MODUL UTAM" dan "Akses Aksesibilitas Mudah" | Salah ketik: seharusnya "MODUL UTAMA"; kata "Akses" terduplikasi. |

### 7.2 Informasi yang kurang di deck eksternal (dan sudah ada di deck Wargaja)

- Definisi sederhana "apa itu Wargaja" dalam satu kalimat.
- Daftar pengguna dan perannya (warga, pengurus RT/RW, sekretaris, bendahara, admin).
- Daftar konkret surat yang bisa diajukan (enam jenis, dengan nama resminya).
- Apa yang perlu disiapkan warga sebelum mulai (ponsel Android, email, NIK/KTP, nomor KK).
- Cara membuat akun sendiri dan menu "Lupa kata sandi".
- Halaman tanya jawab (wajib memakai? iuran otomatis? grup WhatsApp? keamanan data?).
- Kejujuran status: mana yang sudah tersedia dan mana yang masih disiapkan.
- Kejujuran data: tanpa klaim enkripsi/sertifikasi/cadangan.
- Catatan bahwa "Lapor Masalah" dan "Kirim Saran" belum tersambung.

### 7.3 Soal "foto mockup" di deck eksternal — hasil pemeriksaan

Deck eksternal disebut memiliki foto mockup aplikasi. Setelah berkasnya dibongkar, hasilnya:

- Deck itu memuat **20 gambar**, semuanya **ikon kecil**, bukan tangkapan layar: ukuran berkas 246–1.291 byte, dimensi 8×8 sampai 60×81 piksel (mis. `image15.png` 8×8 piksel, 273 byte). Ukuran tampilnya di slide hanya 0,07–0,33 inci.
- Jadi tampilan ponsel di slide 10, 11, dan 12 **bukan foto**: seluruh isinya digambar memakai bentuk dan tulisan (teks "Menu Warga", "Keuangan RT", "Total Pemasukan: Rp 5.000.000", strip kalender "S M T W T F S", tombol "Bayar Iuran" dan "Riwayat", dan seterusnya). Tidak ada satu pun berkas gambar yang berisi antarmuka aplikasi.
- **Tidak ada yang dihapus.** Berkas `Presentasi Sosialisasi Aplikasi Wargaja.pptx` tetap utuh di folder `presentation/`, termasuk 20 ikonnya. Ikon-ikon itu juga disalin ke `presentation_source/assets/mockups/` sebagai cadangan supaya tidak hilang.
- Karena tidak ada foto yang bisa dipakai, deck Wargaja **membuat ulang** gambaran tampilan itu sebagai slide 7 ("Gambaran tampilan aplikasi"), memakai nama menu yang benar-benar ada di aplikasi (`Selamat datang kembali!`, `Warga RW 05`, `Jatuh Tempo Iuran`, `Pengumuman: Jadwal Ronda`, `Menu Warga`, `Informasi Kependudukan`, `Data Keluarga (KK)`, `Data Rumah`, `Bayar Iuran`, `Riwayat Pembayaran`, `Ajukan Surat`, `Transparansi Keuangan`, `Beranda`, `Pasar`, `Kegiatan`, `Akun`). Semuanya bisa diedit, dan slide itu diberi keterangan "bukan tangkapan layar, angka hanya contoh".
- Yang **tidak** diambil dari mockup deck eksternal: angka rupiah rekaan (Rp 7.000.000, Rp 5.000.000, Rp 4.000.000, Rp 3.000.000, Rp 1.000.000, Rp 2.000.000). Angka-angka itu tidak ada di kode dan tidak boleh ditampilkan seolah laporan kas nyata.

### 7.4 Cara aman memakai deck eksternal

Kalau deck eksternal tetap ingin dipakai, wajib lebih dulu: (1) hapus klaim enkripsi, tombol darurat, Play/App Store, dukungan iOS, dan semua angka rupiah rekaan; (2) ganti "otomatis" menjadi "diverifikasi pengurus"; (3) tambahkan daftar status "sudah tersedia vs masih disiapkan"; (4) tambahkan halaman tanya jawab. Deck Wargaja yang dihasilkan skrip ini sudah memenuhi semuanya, dan `verify_deck.py` menolak kata "ios", "play store", "app store", "enkripsi", "bantuan darurat", dan "real-time" bila muncul kembali.

---

## 8. Cara audit ini bisa diulang

1. Cek fitur yang "TERVERIFIKASI": cari rutenya di `lib/routes/`, lalu cocokkan dengan layanan yang menyimpan datanya (`FirebaseFirestore`/`collection(`).
2. Cek fitur "SEBAGIAN": cari kata `dummy`, `mock`, `Simulate`, `generateDummy`, atau repositori di `lib/repositories/`.
3. Cek tautan mati: bandingkan setiap `context.push('/...')` dengan daftar `path:` di `lib/routes/`.
4. Cek klaim yang tidak boleh: pastikan tidak ada berkas `firestore.rules`, `storage.rules`, `firebase_messaging`, atau perpustakaan payment gateway.
