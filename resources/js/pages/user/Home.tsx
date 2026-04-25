import { 
  Search, 
  Shapes, 
  Pipette, 
  LineChart, 
  Wrench, 
  CalendarDays, 
  Package, 
  GraduationCap, 
  Ship,
  ArrowUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from './components/MainLayout';

const stats = [
  { value: "50+", label: "Laboratorium Terpadu" },
  { value: "1,200+", label: "Alat Uji & Instrumen" },
  { value: "15,000+", label: "Layanan Pengujian/Tahun" },
  { value: "200+", label: "Mitra Industri & Riset" }
];

const categories = [
  { name: "Kategori", icon: Shapes },
  { name: "Sample", icon: Pipette },
  { name: "Analisis", icon: LineChart },
  { name: "Jasa", icon: Wrench },
  { name: "Penyewaan", icon: CalendarDays },
  { name: "Produk", icon: Package },
  { name: "Kursus", icon: GraduationCap },
  { name: "Kapal", icon: Ship }
];

const Home = () => {
  return (
    <MainLayout>
      {/* 
        =======================================================
        BAGIAN 1: HERO SECTION DENGAN ROUNDED BOX (Sesuai Referensi Merah Besar)
        =======================================================
      */}
      <section className="w-full px-4 lg:px-8 py-8 bg-white">
        <div className="relative w-full min-h-[500px] lg:min-h-[550px] rounded-3xl overflow-hidden shadow-lg flex items-center justify-center pt-16 pb-12 px-6">
          
          {/* Latar Belakang Gambar & Overlay Gelap untuk Hero */}
          <div className="absolute inset-0 z-0 bg-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop" 
              alt="Laboratorium Background" 
              className="w-full h-full object-cover opacity-60"
            />
            {/* Layer 1: Gradien merah gelap khas identitas */}
            <div className="absolute inset-0 bg-linear-to-r from-gray-900/95 via-[#bd1e24]/70 to-[#bd1e24]/80 mix-blend-multiply"></div>
          </div>

          {/* Konten Text Pilihan, Pencarian Besar, & Statistik */}
          <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 tracking-tight">
              Pusat Pengujian & Riset <br /> 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-200 to-white">Universitas Hasanuddin</span>
            </h1>
            
            <p className="text-lg text-gray-200 max-w-3xl mb-12 leading-relaxed font-medium">
              Temukan dan pesan secara langsung layanan uji sampel, sewa alat laboratorium, hingga pelatihan sertifikasi.
            </p>

            {/* Kotak Input Pencarian Besar */}
            <div className="w-full max-w-3xl bg-white p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-2xl focus-within:ring-4 focus-within:ring-white/30 transition-all duration-300">
              <div className="flex w-full items-center pl-4 pr-2">
                <Search className="w-6 h-6 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Cari jenis pengujian, alat, atau layanan..." 
                  className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-[15px] sm:text-lg py-3 px-3"
                />
              </div>
              <button className="w-full sm:w-auto bg-[#bd1e24] hover:bg-[#a01a1f] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shrink-0 flex items-center justify-center gap-2 shadow-sm">
                Cari Layanan
              </button>
            </div>

            {/* Statistik (Ditetapkan dalam instruksi gabungan) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-16 sm:mt-24 w-full border-t border-white/20 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center text-center group">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1 group-hover:text-red-200 transition-colors">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-200 font-medium uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 
        =======================================================
        BAGIAN 2: DERETAN KATEGORI (HORIZONTAL ICONS)
        =======================================================
      */}
      <section className="bg-white w-full border-b border-gray-100 shadow-sm relative z-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-y-8 gap-x-2 lg:px-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 cursor-pointer group w-[80px] sm:w-auto">
                <div className="w-[60px] h-[60px] sm:w-16 sm:h-16 rounded-[18px] bg-white border-[1.5px] border-gray-200 shadow-sm flex items-center justify-center group-hover:border-[#bd1e24] group-hover:shadow-md transition-all duration-300">
                  <cat.icon className="w-7 h-7 text-[#b02222] group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                </div>
                <span className="text-[13px] font-semibold text-gray-800">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latar Abu-abu Pembatas untuk Seksi Tabel Render Grid Bawah */}
      <div className="w-full bg-[#ebebeb] py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* 
            =======================================================
            BAGIAN 3: GRID LAYANAN (5 KOLOM SESUAI GAMBAR)
            =======================================================
          */}
          <section className="mb-20">
            <h2 className="text-center text-[#bd1e24] font-bold text-xl uppercase tracking-widest mb-1.5">LAYANAN</h2>
            <div className="w-full h-[2px] bg-[#bd1e24] mb-10"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Link to={`/services/${i + 1}`} key={i} className="bg-white p-3.5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer">
                  {/* Blok Thumbnail Placeholder */}
                  <div className="w-full aspect-square bg-[#e5e5e5] mb-3 overflow-hidden">
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500"></div>
                  </div>
                  
                  {/* Teks Judul Layanan */}
                  <h3 className="text-[13.5px] font-bold text-gray-800 leading-snug mb-1 group-hover:text-[#bd1e24] transition-colors">
                    Nama Layanan yang ditampilkan
                  </h3>
                  
                  <p className="text-[11px] font-medium text-gray-400 mb-4">Nama Laboratorium</p>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-[#bd1e24] font-extrabold text-[15px] tracking-tight">Rp666.666</span>
                    <span className="text-[10px] text-gray-400 font-medium">66+ transaksi</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 
            =======================================================
            BAGIAN 4: GRID LABORATORIUM (2 KOLOM SESUAI GAMBAR)
            =======================================================
          */}
          <section>
            <h2 className="text-center text-[#bd1e24] font-bold text-xl uppercase tracking-widest mb-1.5">LABORATORIUM</h2>
            <div className="w-full h-[2px] bg-[#bd1e24] mb-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Link to={`/laboratories/${i + 1}`} key={i} className="bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer">
                  {/* Blok Thumbnail Lab */}
                  <div className="w-full h-56 bg-[#e5e5e5] mb-5 overflow-hidden">
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-500"></div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-[19px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#bd1e24] transition-colors">
                        Nama Laboratorium
                      </h3>
                      <p className="text-[13px] font-medium text-gray-400">Fakultas Asal Laboratorium</p>
                    </div>
                    
                    {/* Aksi "Detail ^" Sesuai Mockup */}
                    <div className="flex items-center gap-2 text-[#bd1e24] font-bold text-[15.5px]">
                      Detail
                      <ArrowUp className="w-6 h-6 stroke-[3px]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>

    </MainLayout>
  );
};

export default Home;
