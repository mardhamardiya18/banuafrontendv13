# Aktivasi kategori Add-on

## Backend

Unggah perubahan berikut dari project backend:

- `app/Http/Controllers/AddOnCategoryController.php`
- `app/Http/Controllers/AddonReportController.php`
- `app/Http/Requests/AddOnRequest.php`
- `app/Http/Resources/AddOnResource.php`
- `app/Models/AddOn.php`
- `routes/api.php`
- `database/migrations/2026_10_03_000000_create_add_on_categories.php`

Setelah database tersedia, jalankan dari direktori Laravel:

```sh
php artisan migrate --path=database/migrations/2026_10_03_000000_create_add_on_categories.php --force
php artisan route:clear
```

Migrasi menambahkan tabel kategori dan kolom `add_ons.category_id`. Nama add-on yang sama dengan `Ongkir` setelah menghapus spasi awal/akhir dan mengabaikan kapitalisasi akan dimasukkan ke kategori Ongkir. Nama lain, seperti `Ongkir Banjarbaru`, perlu dipilih kategorinya melalui form Add-Ons. ID, harga master, dan baris transaksi lama tetap dipertahankan.

## Frontend

Upload isi `dist` hasil `npm run build` setelah backend dan migrasi siap.

## Penggunaan

1. Di **Add-Ons**, edit add-on untuk menentukan kategorinya. Kategori baru dapat dibuat langsung dari form.
2. Di **Finance → Rekap Add-ons**, pilih kategori **Ongkir**. **Semua varian** terpilih otomatis.
3. Pilih bulanan, tahunan, atau keseluruhan. Pilih satu varian jika ingin mempersempit rekap.
4. Rincian harga memakai harga saat transaksi. Jumlah order pada kartu ringkasan dihitung unik; jumlah order per harga tidak boleh dijumlahkan karena satu order dapat memiliki beberapa tarif.

Perubahan kategori pada master mengubah pengelompokan rekap historis untuk add-on tersebut. Nominal transaksi tidak berubah.

## Status lokal

Build frontend, tes rekap backend, serta uji browser dengan API tiruan sudah dijalankan. Migrasi ke MySQL lokal belum berhasil karena koneksi `127.0.0.1:3306` ditolak. Aktifkan MySQL Laragon kemudian jalankan perintah migrasi di atas.
