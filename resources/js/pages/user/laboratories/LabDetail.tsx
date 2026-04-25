import { useState } from 'react';
import { User, Building2, MapPin, Hash, Package, CheckSquare } from 'lucide-react';
import MainLayout from '../components/MainLayout';

const LabDetail = () => {
  // State untuk Switching Tabs
  const [activeTab, setActiveTab] = useState<'layanan' | 'alat'>('alat');

  // Dummy Alat
  const tools = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    name: "Nama Alat yang ditampilkan",
    count: 16,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type"
  }));

  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-0">
        
        {/* ========================================================= 
            BAGIAN HEADER: DETAIL LABORATORIUM UTAMA
            ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            
            {/* Kiri: Kotak Gambar Utama (Placeholder) */}
            <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 aspect-4/3 bg-[#d9d9d9] rounded-lg shadow-inner overflow-hidden"></div>

            {/* Kanan: Informasi & Grid Detail */}
            <div className="flex-1 w-full">
              <h1 className="text-3xl lg:text-[40px] font-bold text-black mb-8 tracking-tight">
                Nama Laboratorium
              </h1>
              
              <div className="flex flex-col xl:flex-row gap-y-7 gap-x-12">
                 
                 {/* Kolom Informasi A (Identitas) */}
                 <div className="flex flex-col gap-6 flex-1">
                    <div className="flex text-[14.5px]">
                       <User className="w-4 h-4 mt-0.5 text-[#bd1e24] shrink-0 fill-[#bd1e24] mr-3" />
                       <p className="text-gray-900 leading-snug">
                          <span className="font-bold text-black mr-1">Kepala Laboratorium :</span> 
                          Prof. Dr. Ir. Nama Kepala Laboratorium
                       </p>
                    </div>
                    <div className="flex text-[14.5px]">
                       <Hash className="w-4 h-4 mt-0.5 text-[#bd1e24] shrink-0 mr-3" strokeWidth={3} />
                       <p className="text-gray-900 leading-snug">
                          <span className="font-bold text-black mr-1">NIP Kepala Laboratorium :</span> 
                          196007011986011001
                       </p>
                    </div>
                    <div className="flex text-[14.5px]">
                       <Building2 className="w-4 h-4 mt-0.5 text-[#bd1e24] shrink-0 fill-[#bd1e24] mr-3" />
                       <p className="text-gray-900 leading-snug">
                          <span className="font-bold text-black mr-1">Fakultas/Lembaga :</span> 
                          Fakultas atau Lembaga Laboratorium
                       </p>
                    </div>
                    <div className="flex text-[14.5px]">
                       <MapPin className="w-4 h-4 mt-0.5 text-[#bd1e24] shrink-0 fill-[#bd1e24] mr-3" />
                       <p className="text-gray-900 leading-snug">
                          <span className="font-bold text-black mr-1">Alamat :</span> 
                          Jl. Laboratorium berada
                       </p>
                    </div>
                 </div>

                 {/* Kolom Informasi B (Statistik) */}
                 <div className="flex flex-col gap-6 lg:w-48 xl:w-56 mt-2 xl:mt-0 lg:border-l xl:border-none lg:pl-6 xl:pl-0 border-gray-100">
                    <div className="flex items-center text-[14.5px]">
                       <div className="w-4 h-4 flex items-center justify-center mr-3 text-[#bd1e24]">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                       </div>
                       <p className="text-gray-900">
                          <span className="font-bold text-black mr-1">Alat :</span> 12
                       </p>
                    </div>
                    <div className="flex items-center text-[14.5px]">
                       <Package className="w-4 h-4 text-[#bd1e24] shrink-0 mr-3" strokeWidth={2.5} />
                       <p className="text-gray-900">
                          <span className="font-bold text-black mr-1">Layanan :</span> 20
                       </p>
                    </div>
                    <div className="flex items-center text-[14.5px]">
                       <CheckSquare className="w-4 h-4 text-[#bd1e24] shrink-0 mr-3" strokeWidth={2.5} />
                       <p className="text-gray-900">
                          <span className="font-bold text-black mr-1">Transaksi :</span> 66
                       </p>
                    </div>
                 </div>

              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= 
            BAGIAN TABS NAVIGASI TENGAH LAYAR
            ========================================================= */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-4 sm:mt-10">
           <div className="flex justify-center border-b border-gray-300">
              <div className="flex space-x-12 sm:space-x-20">
                 <button 
                   onClick={() => setActiveTab('layanan')}
                   className={`pb-5 text-[22px] sm:text-2xl px-2 transition-all font-medium ${activeTab === 'layanan' ? 'border-b-[3px] border-[#bd1e24] text-black font-bold' : 'text-gray-900 border-b-[3px] border-transparent hover:text-[#bd1e24]'}`}
                 >
                    Layanan
                 </button>
                 <button 
                   onClick={() => setActiveTab('alat')}
                   className={`pb-5 text-[22px] sm:text-2xl px-2 transition-all font-medium ${activeTab === 'alat' ? 'border-b-[3px] border-[#bd1e24] text-[#bd1e24]' : 'text-gray-900 border-b-[3px] border-transparent hover:text-[#bd1e24]'}`}
                 >
                    Alat
                 </button>
              </div>
           </div>
        </div>

        {/* ========================================================= 
            BAGIAN KONTEN TABS BAWAH (GRID ALAT MOCKUP)
            ========================================================= */}
        <div className="bg-[#ebebeb] w-full pt-12 pb-20 mt-[2px]">
           <div className="max-w-7xl mx-auto px-4 lg:px-8">
              
              {/* Tab: ALAT (Sesuai Referensi Gambar Utama) */}
              {activeTab === 'alat' && (
                 <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                       {tools.map(tool => (
                          <div key={tool.id} className="bg-white flex flex-col group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200">
                             
                             {/* Gambar Kotak */}
                             <div className="w-full aspect-4/3 sm:aspect-[4/3.2] bg-[#e3e3e3] border-b border-gray-100 p-2 overflow-hidden">
                                <div className="w-full h-full group-hover:scale-105 transition-transform duration-500 bg-gray-200"></div>
                             </div>
                             
                             {/* Teks Deskriptif Kartu */}
                             <div className="p-4 flex flex-col h-full bg-white">
                                <div className="flex justify-between items-start mb-3 gap-3">
                                   <h3 className="font-bold text-black text-[14.5px] leading-tight group-hover:text-[#bd1e24] transition-colors">{tool.name}</h3>
                                   <p className="text-xs font-semibold text-gray-800 shrink-0 mt-0.5">
                                      Jumlah: <span className="text-[#bd1e24] text-[15px] font-bold tracking-wide">{tool.count}</span>
                                   </p>
                                </div>
                                <p className="text-[10.5px] font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Description:</p>
                                <p className="text-[10.5px] text-gray-500 leading-relaxed text-justify line-clamp-4">{tool.description}</p>
                             </div>

                          </div>
                       ))}
                    </div>

                    <div className="flex justify-center">
                       <button className="bg-[#b32b2b] text-white font-medium px-10 py-3.5 hover:bg-[#8f2121] transition-all text-[15px] tracking-wide rounded-[3px] shadow-sm">
                         Lihat Lainnya
                       </button>
                    </div>
                 </>
              )}

              {/* Tab: LAYANAN */}
              {activeTab === 'layanan' && (
                 <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400">
                    <Package className="w-16 h-16 mb-4 text-[#bd1e24]/50" />
                    <h3 className="text-xl font-bold text-gray-800">Layanan Laboratorium</h3>
                    <p className="mt-2 text-sm">Daftar layanan dari laboratorium ini terkait Pengujian dan Jasa.</p>
                 </div>
              )}

           </div>
        </div>

      </div>
    </MainLayout>
  )
}
export default LabDetail;
