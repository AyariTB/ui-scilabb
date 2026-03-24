# RULES.md — Panduan Wajib AI Coding Agent (Frontend Focus)

Kode yang dihasilkan HARUS mengikuti aturan ini tanpa terkecuali.  
Standar ini dirancang untuk menghasilkan kode React/Next.js yang **bersih, aman, reusable, testable, dan profesional**.

## 0. 🛠 Ruleset Anti-Bug & High Quality (Prioritas Tertinggi)

1. **Prinsip Arsitektur & Logika**
   - Modularitas: Selalu pecah fungsi/komponen besar menjadi unit kecil yang melakukan SATU HAL SAJA (Single Responsibility Principle).
   - Statelessness: Prioritaskan pure functions & komponen functional murni (input sama → output sama).
   - KISS: Pilih solusi paling sederhana & mudah dibaca, hindari over-abstraksi atau pola canggih yang tidak perlu.

2. **Keamanan & Penanganan Error**
   - Explicit Error Handling: Jangan gunakan try-catch kosong. Tangani setiap error potensial dengan pesan log yang jelas & user-friendly feedback.
   - Input Validation: Anggap semua input dari user/API berbahaya → validasi tipe, panjang, format di awal fungsi/hook.
   - Null-Safety: Selalu cek null/undefined sebelum akses properti (optional chaining + guard clause).

3. **Standar Penulisan Kode**
   - Type Safety: Gunakan TypeScript strict mode. Hindari `any` kecuali benar-benar terpaksa (wajib beri alasan di komentar).
   - Self-Documenting Code: Nama variabel, fungsi, komponen harus sangat deskriptif (contoh: `calculateMonthlyRevenue` > `calcRev`).
   - Comments Policy: Jangan jelaskan “apa” yang dilakukan kode, tapi jelaskan “mengapa” (khususnya logika bisnis, trade-off, hack).
   - Pada comments: Jangan gunakan bahasa inggris, gunakan bahasa indonesia 
   - Pada comments: jangan gunakan tanda strip (-) berlebihan. 

4. **Workflow Output Wajib**
   - Plan Before Code: Sebelum kode, berikan ringkasan singkat (bullet points) tentang:
     - Logika utama / algoritma
     - 2–3 edge cases + cara penanganannya
   - Jika pakai library eksternal: sebutkan versi stabil yang direkomendasikan & dependensi yang perlu diinstall.

## 1. Warna & Theme (UI Consistency)

- WAJIB definisikan semua warna berulang sebagai constant semantic di file terpisah  
  Lokasi rekomendasi: `src/constants/colors.ts` atau `src/theme/colors.ts`

```ts
// Contoh
export const COLORS = {
  primary: { main: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8' },
  neutral: { 50: '#F9FAFB', 900: '#111827' },
  status: { success: '#10B981', error: '#EF4444' },
  // ...
} as const;

5. Standar Penulisan Kode
Type Safety: "Gunakan tipe data yang kuat (misalnya TypeScript daripada JavaScript, atau Type Hinting di Python). Hindari penggunaan tipe any."

Self-Documenting Code: "Gunakan nama variabel dan fungsi yang deskriptif (misal: calculateMonthlyRevenue() daripada calcRev())."

Comments Policy: "Jangan jelaskan apa yang dilakukan kode, tapi jelaskan mengapa logika yang kompleks tersebut digunakan. Gunakan bahasa indonesia"

6. **Hindari Hardcoding Data API atau Text Sensitif**
   - **JANGAN** gunakan string/text langsung yang merepresentasikan data dari API (misal: nama user "Putri", email "putri@example.com", status "active", pesan error "User tidak ditemukan", label button "Simpan Data", dll) di dalam kode komponen, hook, atau util.
   - **WAJIB** gunakan **dummy data / mock data** untuk pengembangan awal:
     - Contoh:
       ```ts
       // src/mocks/user.mock.ts
       export const MOCK_USER = {
         id: 'usr_123',
         name: 'Putri Mahasiswi',
         email: 'putri.mhs@ukk.ac.id',
         role: 'mahasiswa',
         avatar_url: 'https://example.com/avatar.jpg',
       } as const;

       export const MOCK_ERROR_MESSAGE = {
         not_found: 'Data tidak ditemukan. Silakan coba lagi nanti.',
         network: 'Koneksi internet bermasalah. Periksa jaringan Anda.',
       } as const;
7. Gunakan casing snake_case untuk menyamakan dengan backend
8. Pastikan ukuran font dan warna font memiliki keterbacaaan yang baik
9. Hindari penggunaan shadow yang berlebihan, minimalisir penggunaan shadow
10. Hindari penggunaan tracking-wide. Pastikan font konsisten
11. Jaga tampilan yang sudah ada jangan lakukan perubahan jika tidak diminta untuk memperbaiki tampilan