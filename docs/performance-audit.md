# Audit performa frontend publik — 21 September 2026

Perubahan berada di repository dan build lokal; belum dipublikasikan ke hosting. Laporan Lighthouse HTML/JSON dan screenshot disimpan di `.performance/` (diabaikan Git).

## Penyebab dan perbaikan

| Temuan | Perbaikan |
| --- | --- |
| HTML awal kosong; halaman menunggu Vue, router, dan CSS rute. | Prerender beranda, kerangka katalog, dan 21 kerangka detail produk. CSS rute ditemukan langsung dari HTML. Vue melakukan hydration saat browser senggang. |
| Poppins dan seluruh font Boxicons diambil dari dua CDN tambahan. | Font yang sama dilayani lokal; Boxicons disubset ke 33 ikon yang digunakan, sekitar 116 KB menjadi 3 KB. Pulang TTF 41 KB menjadi WOFF2 18 KB. Lisensi disertakan. |
| Preload hero mobile tidak cocok dengan `img` yang selalu meminta gambar desktop. | `picture` memilih satu gambar sesuai breakpoint; preload hero global yang tidak relevan untuk rute lain dihapus. |
| Animasi masuk menahan teks LCP; blur dan animasi berulang menambah pekerjaan mobile. | Penundaan hero dan efek mahal disederhanakan hanya pada breakpoint mobile. Ukuran huruf mobile tetap ekuivalen. |
| Banner katalog 738 KB dan dua testimoni sekitar 1,65 MB. | Varian mobile: banner 39 KB; testimoni 49 KB dan 88 KB. Desktop tetap memakai file asli. |
| Foto API ada yang 1–1,5 MB; audit katalog mengunduh sekitar 14 MB. | 67 referensi gambar publik memiliki varian WebP 320/768 px, dipilih lewat `srcset`. Gambar desktop tetap asli. |
| Bundle publik membawa Axios dan utilitas CSS admin. | Axios dimuat ketika diperlukan untuk autentikasi/admin; GET katalog memakai `fetch` tanpa header yang memicu preflight. Utilitas CSS admin dimuat bersama rute admin. |
| Detail produk bergeser ketika galeri muncul; bundle galeri besar. | Ruang gambar tersedia sejak awal. Swiper diganti galeri native dengan scroll snap, tombol, thumbnail, dan keyboard. Foto awal tidak perlu menunggu data harga. |
| Navigasi awal memaksa pembacaan layout untuk menggulir ke posisi nol. | Scroll awal yang redundan dihapus; link anchor tetap ditangani. |

Harga, minimum pesanan, status toko, dan data autentikasi **tidak dibekukan ke HTML build**. Harga dan pemesanan baru tampil sesudah API menjawab. Foto awal menggunakan petunjuk aset publik; respons API tetap memperbarui foto yang berubah.

## Metode pengujian

Hasil laboratorium yang tercatat pada build hasil optimasi:

| Halaman | Perangkat | Performance | FCP | LCP | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Beranda | Mobile | 99 | 1,46 dtk | 2,02 dtk | 22 ms | 0,0006 |
| Katalog | Mobile | 99 | 1,31 dtk | 1,86 dtk | 34 ms | 0,0082 |
| Detail Snackbox 2Kue+Air | Mobile | 99 | 1,22 dtk | 1,89 dtk | 40 ms | 0 |
| Detail Tumpeng Reguler | Mobile | 99 | 1,21 dtk | 1,83 dtk | 15 ms | 0 |
| Beranda | Desktop | 100 | 0,36 dtk | 0,52 dtk | 0 ms | <0,0001 |

File laporan: `.performance/final-home-mobile.html`, `.performance/final-catalog-mobile.html`, `.performance/final-product-mobile.html`, `.performance/final-tumpeng-mobile.html`, dan `.performance/final-home-desktop.html`. Beranda tercatat 97–99 dalam pengukuran lanjutan, dengan 99 pada pengukuran final. Pengujian mencakup sampel rute; bukan klaim bahwa seluruh produk dan seluruh kondisi jaringan selalu mencapai skor yang sama.

Enam tes Node lulus. Uji browser mencakup desktop/mobile, API katalog nyata, pencarian, pemilihan gambar, navigasi, tombol galeri/keyboard, redirect admin tanpa login, HTML tanpa JavaScript, serta overlay toko tutup. Tidak ditemukan error browser atau hydration dalam pengujian tersebut. Posisi dan dimensi desktop untuk judul, foto hero, blok hero, produk unggulan, testimoni, dan footer identik dengan baseline pada viewport 1440×1000.

- Lighthouse 13.5.0, preset mobile standar dengan simulated throttling; preset desktop resmi untuk pengujian desktop.
- Build produksi lokal disajikan dengan HTTPS, HTTP/2, gzip, dan cache browser dingin. Hanya DNS di browser pengujian yang mengarah ke lokal; tidak ada perubahan DNS publik, hosts file, atau sertifikat sistem.
- API katalog tetap memakai server nyata. Situs produksi diperiksa dan memang menggunakan HTTP/2 serta Brotli.
- Screenshot pengguna mencatat 81 mobile pada Lighthouse 13.4.1. Angka tersebut tidak identik dengan lingkungan lokal. Baseline lokal juga berfluktuasi; gunakan laporan dengan konfigurasi sama untuk perbandingan.
- Skor laboratorium bukan jaminan seluruh sesi pengguna atau skor PageSpeed setelah deploy. TTFB hosting, API, perangkat, jaringan, dan perubahan katalog tetap memengaruhi hasil.

## Menjalankan ulang

```powershell
npm install
npm run build
npm test
npm run test:public
npm run audit:performance -- home-mobile / --production-origin
npm run audit:performance -- catalog-mobile /katalog --production-origin
npm run audit:performance -- product-mobile /produk/snackbox-2kueair --production-origin
npm run audit:performance -- home-desktop / --desktop --production-origin
```

Alat browser memakai Microsoft Edge yang terpasang; `AUDIT_BROWSER` dapat diubah untuk channel browser lain yang terpasang. Jalankan audit satu per satu agar CPU dan port pengujian tidak saling mengganggu. `--production-origin` tetap mengaudit **build lokal**, bukan menerbitkan perubahan.

Jika font/ikon atau foto katalog berubah:

```powershell
npm run assets:optimize
npm run assets:catalog
npm run build
```

Foto baru yang belum ada dalam manifest tetap menggunakan URL asli dari API. Untuk menjaga ukuran unduhan mobile, regenerasikan aset sebelum rilis berikutnya. Solusi backend jangka panjang adalah menghasilkan thumbnail responsif ketika foto diunggah; backend tidak diubah dalam pekerjaan ini.

## Deployment

### Efisiensi ukuran paket

Revisi lanjutan mengurangi foto katalog dari 150 file (9,40 MiB) menjadi 76 file (2,86 MiB): dua kandidat 320/768 px, WebP quality 75 dengan effort 6. Gambar desktop tetap menggunakan sumber asli. Nama file mencakup versi kualitas agar cache lama tidak tertukar. Generator membersihkan varian yang tidak lagi dirujuk dan mempertahankan entri gambar yang gagal diunduh.

Total `dist` hasil build adalah 8.820.002 byte (8,41 MiB); ZIP lengkap `deploy-optimized.zip` adalah 7.525.764 byte (7,18 MiB), turun sekitar 48% dari arsip sebelumnya 13,75 MiB. ZIP dibuat di luar `dist` agar tidak ikut dikemas kembali. Arsip sebelumnya disimpan di `.performance/assets-before-size-optimization.zip`.

Audit ulang lokal: katalog mobile 99 (LCP 1,86 detik), detail snackbox mobile 99 (LCP 1,83 detik, CLS 0). Laporan: `.performance/compact-catalog-mobile.html` dan `.performance/compact-product-mobile.html`. Build, enam tes Node, dan validasi seluruh 67 referensi/76 file gambar lulus. Angka ukuran paket merupakan seluruh aset deployment, bukan jumlah unduhan satu kunjungan. Untuk memindahkan biaya penyimpanan foto keluar dari frontend sepenuhnya, backend/CDN perlu menyediakan varian foto responsif; perubahan tersebut belum dilakukan.

- Unggah **seluruh isi `dist/`**, termasuk `.htaccess`, font, `catalog-media/`, `spa.html`, `katalog.html`, dan HTML produk. Tidak perlu menjalankan server Node untuk prerender ini.
- Apache: `.htaccess` memilih HTML statis yang tersedia dan mengarahkan rute dinamis lain ke `spa.html`, serta mengaktifkan kompresi jika modul tersedia.
- Vercel: konfigurasi di root `vercel.json` digunakan. Build memperbarui daftar rewrite produk yang dikenal; commit konfigurasi hasil build bersama perubahan aset.
- Rute/produk baru yang belum diprerender tetap dilayani oleh SPA. Jangan mengembalikan fallback semua rute ke HTML beranda karena akan menampilkan konten beranda sementara pada rute lain.
- Setelah deploy, ulangi PageSpeed mobile dan desktop pada beranda, katalog, serta beberapa detail produk. Data lapangan Core Web Vitals tidak berubah seketika mengikuti satu deployment.

## Rujukan teknis

Prerender dan hydration mengikuti [panduan Vue SSR](https://vuejs.org/guide/scaling-up/ssr) dan [Vite prerender](https://vite.dev/guide/ssr). Pemisahan sumber utilitas mengikuti [Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files). Prioritas font/gambar dan pengurangan render delay mengikuti [panduan optimasi LCP](https://web.dev/articles/optimize-lcp).

