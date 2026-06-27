Berikut adalah penyesuaian konsepnya untuk Single Furnace Tracker:

1. Tampilan Utama (Dashboard Monitor)
Karena layar sepenuhnya didedikasikan untuk satu furnace, kita bisa memaksimalkan ukuran elemen visual:

Animasi Baterai Raksasa (Centerpiece): Sebuah tabung atau indikator baterai besar di tengah layar.

Animasi pengisian (filling) bergerak dari bawah ke atas seiring berjalannya waktu.

Bisa dibagi menjadi 9 segmen/garis batas di dalam baterai tersebut, yang masing-masing mewakili tahapan (dari Charging di paling bawah, hingga Tapping 2 di paling atas).

Panel Informasi Aktif (Kiri/Kanan Baterai):

Status Saat Ini: Teks ukuran besar (contoh: PROSES AKTIF: CEK TEMPERATURE).

Waktu Fase Ini: Countdown (hitung mundur) waktu standar untuk fase yang sedang berjalan.

Total Waktu (Stopwatch): Waktu yang sudah berjalan dari target total 72 menit.

Tombol Kontrol Utama (Bawah Baterai):

▶️ START (Hijau, ukuran besar)

⏸️ PAUSE (Kuning/Oranye, untuk menahan waktu jika ada trouble atau jeda tak terduga)

🔄 RESET (Merah, membutuhkan konfirmasi pop-up agar tidak tidak sengaja tertekan, untuk mereset seluruh siklus).

2. Logika Visual & Alarm (Abnormality)
Di lantai produksi, indikasi visual sangat penting. Kita bisa menerapkan sistem warna peringatan:

Normal (Hijau/Biru): Jika proses berjalan sesuai atau di bawah standar waktu konfigurasinya.

Warning (Kuning Kedip): Jika waktu di fase tersebut sisa 1-2 menit lagi.

Overtime (Merah Kedip & Suara): Jika waktu aktual melebihi waktu standar yang di-setting untuk fase tersebut. Ini sangat penting untuk pelaporan Leader Line jika terjadi deviasi dari standar 72 menit.

. Halaman Konfigurasi Waktu (Settings)
Halaman khusus (bisa dilindungi PIN Leader Line) untuk mengatur standar waktu.

Terdapat form input angka (dalam menit) untuk memecah total 72 menit ke dalam 9 proses:

Charging

Heating Up

Sample

Adjust

Sample Adjust

Cek Temperature

Buang Terak

Tapping 1

Tapping 2

Sistem akan otomatis menjumlahkan total waktu dari 9 proses tersebut untuk memastikan apakah masih sesuai dengan standar (72 menit) atau ada deviasi.

3. Konsep Logika Aplikasi
Pergerakan Animasi: Tinggi "baterai" dihitung menggunakan persentase. Rumusnya: (Waktu Berjalan / Total Waktu Konfigurasi) * 100%.

Transisi Proses: Setiap timer proses (misal Charging) habis, sistem akan memberikan notifikasi visual (berkedip) atau suara (beep), lalu secara visual masuk ke area proses selanjutnya (Heating up).

Rekomendasi Tech Stack
Untuk membangun antarmuka yang responsif dan animasi yang mulus, kita bisa menggunakan ekosistem pengembangan modern yang solid:

Front-End: React (atau Next.js) untuk membangun komponen dashboard yang dinamis.

Styling & Animasi: Tailwind CSS. Animasi "baterai terisi" dari bawah ke atas sangat mudah diimplementasikan menggunakan utilitas height persentase (h-0 ke h-full) dan transition-all bawaan Tailwind.

State Management: Zustand atau React Context untuk mengatur state timer (Start, Pause, Reset) di setiap furnace agar tidak berbenturan satu sama lain.