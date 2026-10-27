# Week 6 - Fetch API, DOM, dan Event Handling

Dua halaman web statis (HTML + CSS + JavaScript native, tanpa library).

## Fitur

### 1. Katalog Produk (`public/index.html`)
- Mengambil data produk dari `https://dummyjson.com/products` dengan Fetch API
- Menampilkan nama, harga, kategori, rating, stok, dan gambar produk lewat DOM
- Indikator loading dan pesan error dengan tombol "Coba Lagi"
- Cari berdasarkan nama, filter kategori, dan urutkan harga/nama

### 2. Kalkulator Belanja (`public/form.html`)
- Input: nama barang, harga satuan, jumlah, diskon
- Event `input` (validasi dan pratinjau langsung), `submit` (simpan ke riwayat), `click` (reset, hapus riwayat)
- Validasi:

| Field | Aturan |
|-------|--------|
| Nama | wajib, 3-40 karakter, mengandung huruf |
| Harga | wajib, bilangan bulat, Rp1.000 - Rp100.000.000 |
| Jumlah | wajib, bilangan bulat, 1 - 100 |
| Diskon | wajib, bilangan bulat, 0 - 90 |

## Struktur Folder

```
Week6-KelasX-NIMLengkap/
├── latihan/
│   ├── fetch.js
│   └── test.js
├── public/
│   ├── css/
│   │   ├── form.css
│   │   └── index.css
│   ├── js/
│   │   ├── form.js
│   │   └── index.js
│   ├── form.html
│   └── index.html
└── README.md
```

## Cara Menjalankan
Buka `public/index.html` di browser (butuh koneksi internet untuk halaman Katalog).
