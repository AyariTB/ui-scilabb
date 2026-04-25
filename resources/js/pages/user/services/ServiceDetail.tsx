import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Building2, MapPin, Minus, Plus } from 'lucide-react';
import MainLayout from '../components/MainLayout';

const ServiceDetail = () => {
   // State untuk kontrol kuantitas formulir pengajuan
   const [quantity, setQuantity] = useState(1);
   const [notes, setNotes] = useState('');

   return (
      <MainLayout>
         <div className="bg-white min-h-screen py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
               
               {/* Breadcrumb Navigasi Kiri Atas */}
               <nav className="text-[13px] text-gray-500 mb-8 sm:mb-10 font-medium tracking-wide flex items-center flex-wrap">
                  <Link to="/laboratories" className="hover:text-[#bd1e24] transition-colors">Laboratorium</Link>
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/services" className="hover:text-[#bd1e24] transition-colors">Sample</Link>
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-900 font-bold">Meth</span>
               </nav>

               {/* Layout Grid 2 Kolom Utama */}
               <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                  
                  {/* ========================================================= 
                      KOLOM KIRI: GALERI GAMBAR
                      ========================================================= */}
                  <div className="w-full lg:w-5/12 xl:w-1/2 flex flex-col gap-4">
                     {/* Kotak Besar Utama */}
                     <div className="w-full aspect-square bg-[#d9d9d9] rounded-lg shadow-sm border border-gray-100 mb-1"></div>
                     
                     {/* Deretan Kotak Kecil Sub-Gallery */}
                     <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide w-full snap-x">
                        {Array.from({length: 5}).map((_, i) => (
                           <div 
                             key={i} 
                             className="w-[85px] sm:w-[90px] h-[85px] sm:h-[90px] shrink-0 bg-[#d9d9d9] rounded-lg cursor-pointer hover:ring-2 ring-offset-1 hover:ring-[#bd1e24] transition-all snap-start shadow-sm border border-gray-100"
                           ></div>
                        ))}
                     </div>
                  </div>

                  {/* ========================================================= 
                      KOLOM KANAN: INFORMASI & FORM INTERAKTIF
                      ========================================================= */}
                  <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col">
                     
                     <h1 className="text-[32px] sm:text-4xl font-extrabold text-black mb-1.5 tracking-tight leading-tight">
                        Nama Product Layanan
                     </h1>
                     <p className="text-[13px] text-gray-500 font-medium tracking-wide mb-1.5">66+ Transaksi</p>
                     
                     <h2 className="text-[40px] sm:text-[44px] font-bold text-[#bd1e24] tracking-tight mb-10 mt-1">
                        Rp666.666
                     </h2>

                     {/* Atribut Laboratorium */}
                     <div className="flex flex-col gap-5 mb-14 border-t border-b border-gray-100 py-8">
                        <div className="flex gap-4 items-center">
                           <FlaskConical className="w-[22px] h-[22px] text-[#bd1e24] shrink-0 fill-[#bd1e24] stroke-white stroke-1" />
                           <span className="text-[15.5px] font-bold text-gray-900 tracking-wide">Nama Laboratorium</span>
                        </div>
                        <div className="flex gap-4 items-center">
                           <Building2 className="w-[22px] h-[22px] text-[#bd1e24] shrink-0 fill-[#bd1e24] stroke-white stroke-1" />
                           <span className="text-[15.5px] font-bold text-gray-900 tracking-wide">Fakultas Laboratorium</span>
                        </div>
                        <div className="flex gap-4 items-start">
                           <MapPin className="w-[22px] h-[22px] text-[#bd1e24] shrink-0 fill-[#bd1e24] mt-0.5 stroke-[#bd1e24] stroke-1" />
                           <span className="text-[15.5px] font-bold text-gray-900 leading-snug tracking-wide">
                              Jl. Alamat Fakultas No 1
                           </span>
                        </div>
                     </div>

                     {/* Form Formulir Kuantitas & Catatan */}
                     <div className="flex flex-col gap-y-7 flex-1 mb-6">
                        
                        {/* Selector Kuantitas */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                           <label className="text-[13px] text-gray-500 w-full sm:w-48 font-medium">Kuantitas</label>
                           <div className="flex items-center justify-between border border-gray-300 rounded-sm w-[150px] shadow-sm">
                              <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3.5 py-2 hover:bg-gray-100 transition-colors text-gray-600 focus:outline-none"
                              >
                                 <Minus className="w-[18px] h-[18px] stroke-[2.5px]" />
                              </button>
                              <div className="px-5 py-2 border-x border-gray-300 text-sm font-bold w-12 text-center text-gray-800 bg-gray-50">
                                 {quantity}
                              </div>
                              <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3.5 py-2 hover:bg-gray-100 transition-colors text-gray-600 focus:outline-none"
                              >
                                 <Plus className="w-[18px] h-[18px] stroke-[2.5px]" />
                              </button>
                           </div>
                        </div>

                        {/* Textarea Catatan Tambahan */}
                        <div className="flex flex-col sm:flex-row gap-3">
                           <label className="text-[13px] text-gray-500 w-full sm:w-48 mt-2 shrink-0 font-medium tracking-wide">
                              Catatan Tambahan
                           </label>
                           <textarea 
                              className="flex-1 w-full border border-gray-300 rounded-lg shadow-sm p-4 min-h-[140px] resize-y text-[15px] focus:outline-none focus:border-[#bd1e24] focus:ring-1 focus:ring-[#bd1e24] transition-all bg-gray-50/50"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                           ></textarea>
                        </div>
                     </div>

                     {/* Tombol Aksi (Ajukan Layanan & WA) */}
                     <div className="flex flex-col sm:flex-row justify-end mt-12 gap-x-5 gap-y-4">
                        <button className="flex items-center justify-center gap-3 bg-[#b32b2b] hover:bg-[#8f2121] text-white px-8 py-3.5 rounded-[5px] font-medium transition-colors text-[15px] tracking-wide w-full sm:w-auto shadow-sm">
                           <div className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center">
                              {/* Custom Inline SVG WhatsApp Icon meniru referensi gambar */}
                              <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-[#25D366] text-[#25D366]">
                                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                              </svg>
                           </div>
                           +62 81244 934 059
                        </button>
                        
                        <button className="bg-[#bd1e24] hover:bg-[#a01a1f] text-white px-10 py-3.5 rounded-[5px] font-medium transition-colors text-[15px] tracking-wide w-full sm:w-auto shadow-sm">
                           Ajukan Layanan
                        </button>
                     </div>

                  </div>
               </div>

            </div>
         </div>
      </MainLayout>
   );
};

export default ServiceDetail;
