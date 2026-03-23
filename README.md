# 🚢 Platform Layanan Riset Unhas (UI-UKK-UH)

[![Framework: React 19](https://img.shields.io/badge/Framework-React_19-61DAFB?logo=react)](https://react.dev/)
[![Build: Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Style: Tailwind CSS 4](https://img.shields.io/badge/Style-Tailwind_CSS_4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

## 🚀 Teknologi Utama (Tech Stack)

### **Frontend**
*   **Core**: React 19 + TypeScript (Strict Mode)
*   **State Management**: Zustand (Global) & React Query (Server State)
*   **Routing**: React Router DOM (v7)
*   **Styling**: Tailwind CSS v4 + Framer Motion (Micro-animations)
*   **Components**: Radix UI / Shadcn UI (Customized)
*   **Forms**: React Hook Form + Zod (Validation)
*   **Utilities**: Axios, Lucide React, FullCalendar, Recharts, jsPDF

---

## 🛠 Instalasi Lokal (Development)

Pastikan Anda memiliki **Node.js (v20 atau lebih baru)** dan **npm** yang terinstal di mesin Anda.

### 1. Clone Repository
```bash
git clone https://github.com/netmon-snd-research/ui-ukk-uh.git
cd ui-ukk-uh
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di root folder (salin dari `.env.example` jika tersedia).
```env
VITE_APP_NAME="Platform Layanan Riset Unhas"
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Aplikasi akan berjalan di [http://localhost:5173](http://localhost:5173).

### 5. Build untuk Produksi
```bash
npm run build
```

---

## 📂 Struktur Proyek (Frontend)

Berikut adalah gambaran singkat struktur folder dalam `resources/js`:

*   `/components`: Komponen UI modular dan reusable (Modals, Tables, Banners).
*   `/pages`: Komponen halaman utama aplikasi (Admin Dashboard, Manager Portal, dsb).
*   `/hooks`: Custom React Hooks untuk logika bisnis dan API handling.
*   `/services`: Interface untuk komunikasi dengan API/Mock Data.
*   `/stores`: State global menggunakan Zustand.
*   `/mocks`: Data dummy/palsu untuk pengembangan UI murni.
*   `/schemas`: Skema validasi form menggunakan Zod.
*   `/types`: Definisi tipe data TypeScript secara global.

---

## ⚖️ Standar Penulisan Kode

- **Naming**: Gunakan casing `snake_case` untuk variabel (agar selaras dengan backend) dan nama yang deskriptif.
- **Mock Strategy**: Selau gunakan data dari `/mocks` selama proses pengembangan UI untuk menghindari ketergantungan API.

---