import { useState } from 'react';
import { Search, Filter, ChevronRight, Home } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import CatalogCard from '../components/CatalogCard';

// 1. Deklarasi Interface Data (TypeScript Strict)
export interface LaboratoryData {
  id: string;
  thumbnailUrl: string;
  title: string;
  badgeText: string;
  badgeVariant: 'success' | 'danger' | 'warning' | 'default';
  price: string;
  detailUrl: string;
}

// 2. Dummy Data Array Sesuai Instruksi
const dummyLabs: LaboratoryData[] = [
  {
    id: '1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574682708365-18868a834d8d?q=80&w=800&auto=format&fit=crop',
    title: 'Laboratorium Bioteknologi Terpadu (LBT)',
    badgeText: 'Tersedia',
    badgeVariant: 'success',
    price: 'Mulai Rp 200.000',
    detailUrl: '/laboratories/1',
  },
  {
    id: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
    title: 'Laboratorium Metalurgi Ekstraktif Khusus',
    badgeText: 'Penuh',
    badgeVariant: 'danger',
    price: 'Mulai Rp 500.000',
    detailUrl: '/laboratories/2',
  },
  {
    id: '3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    title: 'Laboratorium Ilmu Tanah & Lingkungan',
    badgeText: 'Antrean Pendek',
    badgeVariant: 'warning',
    price: 'Mulai Rp 150.000',
    detailUrl: '/laboratories/3',
  },
  {
    id: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508ab6b?q=80&w=800&auto=format&fit=crop',
    title: 'Pusat Analisis Kimia & Fisika Sentral',
    badgeText: 'Tersedia',
    badgeVariant: 'success',
    price: 'Mulai Rp 350.000',
    detailUrl: '/laboratories/4',
  },
  {
    id: '5',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
    title: 'Laboratorium Fisika Material & Bangunan',
    badgeText: 'Tersedia',
    badgeVariant: 'success',
    price: 'Mulai Rp 250.000',
    detailUrl: '/laboratories/5',
  },
  {
    id: '6',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1661306478954-3e9a4bb33965?q=80&w=800&auto=format&fit=crop',
    title: 'Pusat Mikroskop Elektron (SEM-TEM) Lab',
    badgeText: 'Eksklusif',
    badgeVariant: 'default',
    price: 'Mulai Rp 1.500.000',
    detailUrl: '/laboratories/6',
  },
  {
    id: '7',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    title: 'Studio Geofisika & Rekayasa Komputasi',
    badgeText: 'Tersedia',
    badgeVariant: 'success',
    price: 'Mulai Rp 100.000',
    detailUrl: '/laboratories/7',
  },
  {
    id: '8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
    title: 'Laboratorium Kultur Jaringan & Mikrobiologi',
    badgeText: 'Antrean Pendek',
    badgeVariant: 'warning',
    price: 'Mulai Rp 180.000',
    detailUrl: '/laboratories/8',
  }
];

const LabList = () => {
  // State manajemen fungsi pencarian / search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Saring data array sesuai keyword
  const filteredLabs = dummyLabs.filter(lab => 
    lab.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigasi Atas */}
          <nav className="flex text-sm text-gray-500 mb-8 font-medium">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="hover:text-[#bd1e24] flex items-center transition-colors">
                  <Home className="w-[15px] h-[15px] mr-1.5 mb-px" />
                  Beranda
                </a>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400 mx-0.5" />
              </li>
              <li>
                <span className="text-gray-900 font-bold">Daftar Laboratorium</span>
              </li>
            </ol>
          </nav>

          {/* Header Konten, Pencarian & Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#bd1e24] tracking-tight mb-3">
                Katalog Laboratorium
              </h1>
              <p className="text-gray-600 max-w-2xl text-[15px] sm:text-base leading-relaxed">
                Jelajahi dan temukan pilihan fasilitas laboratorium terlengkap dari seluruh fakultas di Universitas Hasanuddin berdasarkan kebutuhan spesifik Anda.
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
              <div className="relative w-full md:w-72 lg:w-80 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#bd1e24] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama laboratorium..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#bd1e24]/20 focus:border-[#bd1e24] transition-all shadow-sm"
                />
              </div>
              
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:text-[#bd1e24] hover:border-red-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bd1e24]/20">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Grid Render Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 mb-16">
            {filteredLabs.map((lab) => (
              <CatalogCard
                 key={lab.id}
                 thumbnailUrl={lab.thumbnailUrl}
                 title={lab.title}
                 badgeText={lab.badgeText}
                 badgeVariant={lab.badgeVariant}
                 price={lab.price}
                 detailUrl={lab.detailUrl}
              />
            ))}
          </div>

          {/* Pesan Kosong Jika Tidak Ada Data*/}
          {filteredLabs.length === 0 && (
             <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300 mb-16 flex flex-col items-center justify-center">
               <div className="bg-gray-50 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                 <Search className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">Pencarian Tidak Ditemukan</h3>
               <p className="text-gray-500 max-w-sm">Maaf, tidak ada laboratorium yang cocok dengan istilah "{searchQuery}".</p>
             </div>
          )}

          {/* Pagination di Footer */}
          {filteredLabs.length > 0 && (
            <div className="flex items-center justify-center border-t border-gray-200 pt-10 pb-16">
              <nav className="relative z-0 inline-flex shadow-sm rounded-xl overflow-hidden" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#bd1e24] transition-colors focus:z-10 focus:ring-2 focus:ring-[#bd1e24]/20">
                  Kembali
                </a>
                
                <a href="#" aria-current="page" className="z-10 bg-red-50/50 border-[#bd1e24] text-[#bd1e24] relative inline-flex items-center px-5 py-2 border text-sm font-bold">
                  1
                </a>
                
                <a href="#" className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#bd1e24] relative inline-flex items-center px-4 py-2 border-y border-r text-sm font-semibold transition-colors focus:z-10 focus:ring-2 focus:ring-[#bd1e24]/20">
                  2
                </a>
                
                <a href="#" className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#bd1e24] hidden sm:inline-flex relative items-center px-4 py-2 border-y border-r text-sm font-semibold transition-colors focus:z-10 focus:ring-2 focus:ring-[#bd1e24]/20">
                  3
                </a>
                
                <span className="relative inline-flex items-center px-4 py-2 border-y border-r border-gray-200 bg-white text-sm font-medium text-gray-400">
                  ...
                </span>
                
                <a href="#" className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#bd1e24] relative inline-flex items-center px-4 py-2 border-y border-r text-sm font-semibold transition-colors focus:z-10 focus:ring-2 focus:ring-[#bd1e24]/20">
                  12
                </a>
                
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#bd1e24] transition-colors focus:z-10 focus:ring-2 focus:ring-[#bd1e24]/20">
                  Lanjut
                </a>
              </nav>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default LabList;
