import { useState } from 'react';
import { Search, Filter, ChevronRight, Home } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import CatalogCard from '../components/CatalogCard';

// 1. Deklarasi Interface Data (TypeScript Strict)
export interface LabService {
  id: string;
  thumbnailUrl: string;
  title: string;
  badgeText: string;
  badgeVariant: 'success' | 'danger' | 'warning' | 'default';
  price: string;
  detailUrl: string;
}

// 2. Dummy Data Array
const dummyServices: LabService[] = [
  {
    id: '1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
    title: 'Pengujian Kualitas Air Bersih & Minum',
    badgeText: 'Tersedia',
    badgeVariant: 'success',
    price: 'Rp 450.000',
    detailUrl: '/services/1',
  },
  {
    id: '2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    title: 'Analisis Tanah & Kandungan Mineral',
    badgeText: 'Antrean Pendek',
    badgeVariant: 'warning',
    price: 'Rp 750.000',
    detailUrl: '/services/2',
  },
  {
    id: '3',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1661306478954-3e9a4bb33965?auto=format&fit=crop&w=800&q=80',
    title: 'Karakterisasi Nano Material menggunakan SEM',
    badgeText: 'Tersedia',
    badgeVariant: 'success',
    price: 'Rp 1.250.000',
    detailUrl: '/services/3',
  },
  {
    id: '4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    title: 'Uji Sitotoksisitas (MTT Assay)',
    badgeText: 'Penuh / Tutup',
    badgeVariant: 'danger',
    price: 'Rp 600.000',
    detailUrl: '/services/4',
  },
  {
    id: '5',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508ab6b?auto=format&fit=crop&w=800&q=80',
    title: 'Kalibrasi Timbangan Analitik Ekstra Presisi',
    badgeText: 'Tersedia',
    badgeVariant: 'success',
    price: 'Rp 300.000',
    detailUrl: '/services/5',
  },
  {
    id: '6',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    title: 'Sewa Ruang Laboratorium Dasar (Komunal)',
    badgeText: 'Tersedia',
    badgeVariant: 'success',
    price: 'Rp 500.000 / Hari',
    detailUrl: '/services/6',
  },
  {
    id: '7',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581093196277-9f6089ec3b7b?auto=format&fit=crop&w=800&q=80',
    title: 'Pengujian Kuat Tekan Beton & Struktur Baja',
    badgeText: 'Antrean Pendek',
    badgeVariant: 'warning',
    price: 'Rp 150.000 / Benda',
    detailUrl: '/services/7',
  },
  {
    id: '8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560613271-e23438eebcb3?auto=format&fit=crop&w=800&q=80',
    title: 'Analisis GC-MS Kandungan Minyak Atsiri',
    badgeText: 'Promo',
    badgeVariant: 'default',
    price: 'Rp 950.000',
    detailUrl: '/services/8',
  }
];

const ServicesList = () => {
  // State untuk melengkapi fungsionalitas search input
  const [searchQuery, setSearchQuery] = useState('');

  // Saring data berdasarkan pencarian teks
  const filteredServices = dummyServices.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          
          {/* 3. Breadcrumb Navigasi */}
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
                <span className="text-gray-900 font-bold">Layanan Lab Terpadu</span>
              </li>
            </ol>
          </nav>

          {/* 4. Bagian Header Halaman */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#bd1e24] tracking-tight mb-3">
                Katalog Produk Layanan
              </h1>
              <p className="text-gray-600 max-w-2xl text-[15px] sm:text-base leading-relaxed">
                Kami menyediakan bermacam pengujian teknis, penelitian material, sewa alat ukur canggih, hingga ketersediaan analisis sampel biologi.
              </p>
            </div>
            
            {/* Search Bar & Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
              {/* Kotak Pencarian */}
              <div className="relative w-full md:w-72 lg:w-80 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#bd1e24] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cari layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#bd1e24]/20 focus:border-[#bd1e24] transition-all shadow-sm"
                />
              </div>
              
              {/* Tombol Filter */}
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:text-[#bd1e24] hover:border-red-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bd1e24]/20">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* 5. Grid Katalog (Menerapkan mapping komponen) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 mb-16">
            {filteredServices.map((service) => (
              <CatalogCard
                key={service.id}
                thumbnailUrl={service.thumbnailUrl}
                title={service.title}
                badgeText={service.badgeText}
                badgeVariant={service.badgeVariant}
                price={service.price}
                detailUrl={service.detailUrl}
              />
            ))}
          </div>

          {/* Fallback Jika Pencarian Kosong */}
          {filteredServices.length === 0 && (
             <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300 mb-16 flex flex-col items-center justify-center">
               <div className="bg-gray-50 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                 <Search className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">Pencarian Tidak Ditemukan</h3>
               <p className="text-gray-500 max-w-sm">Maaf, kami tidak dapat menemukan layanan laboratorium dengan kata kunci "{searchQuery}".</p>
             </div>
          )}

          {/* 6. Komponen Pagination */}
          {filteredServices.length > 0 && (
            <div className="flex items-center justify-center border-t border-gray-200 pt-10 pb-16">
              <nav className="relative z-0 inline-flex shadow-sm rounded-xl overflow-hidden" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#bd1e24] transition-colors focus:z-10 focus:ring-2 focus:ring-[#bd1e24]/20">
                  Kembali
                </a>
                
                {/* Halaman Aktif (Contoh: Halaman 1) */}
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
                  8
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

export default ServicesList;
