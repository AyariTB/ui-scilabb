import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full font-sans">
      {/* Bagian Utama Footer */}
      <div className="bg-[#bd1e24] text-white pt-16 pb-12 px-6 lg:px-12 relative overflow-hidden">
        
        {/* Elemen Dekoratif Opsional (Bisa diganti image watermark logo kampus) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none flex justify-center lg:justify-end lg:-mr-32 items-center">
            {/* Watermark circle fallback */}
            <div className="w-[500px] h-[500px] rounded-full border-40 border-white/20 blur-xl"></div>
        </div>

        {/* Grid Konten */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
          
          {/* Kolom 1 & 2: Tentang Kami */}
          <div className="lg:col-span-2 md:pr-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/10 p-1 rounded-md shrink-0">
                <img 
                  src="/logo-unhas.png" 
                  alt="Logo Unhas" 
                  className="w-[60px] h-auto object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="h-12 w-0.5 bg-[#3b82f6] hidden sm:block shrink-0"></div>
              <div className="flex flex-col font-bold text-lg leading-tight tracking-wide">
                <span>UNIT KERJA KHUSUS</span>
                <span>UNIVERSITAS HASANUDDIN</span>
              </div>
            </div>
            
            <p className="text-[14px] text-gray-100/90 leading-relaxed max-w-lg text-justify font-light">
              UKK Layanan Sains dan Laboratorium adalah Unit kerja khusus yang mengelola 
              dan mengkoordinasikan aktivitas layanan sains dan laboratorium termasuk 
              kajian ilmiah, pelatihan, pengembangan dan optimalisasi pemanfaatan 
              laboratorium untuk sivitas akademika Universitas Hasanuddin, instansi/ 
              lembaga penelitian, masyarakat, dan industri.
            </p>
          </div>

          {/* Kolom 3: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-2">Quick Links</h3>
            <div className="w-24 h-[2px] bg-[#3b82f6] mb-6"></div>
            
            <ul className="flex flex-col gap-3.5 text-sm font-medium text-gray-100/90">
              <li>
                <Link to="/" className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300">
                  <ChevronRight className="w-4 h-4 text-[#60a5fa]" />
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300">
                  <ChevronRight className="w-4 h-4 text-[#60a5fa]" />
                  Layanan Sains
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300">
                  <ChevronRight className="w-4 h-4 text-[#60a5fa]" />
                  Fasilitas & Unit
                </Link>
              </li>
              <li>
                <Link to="/artikel" className="flex items-center gap-2 hover:text-white hover:translate-x-1.5 transition-all duration-300">
                  <ChevronRight className="w-4 h-4 text-[#60a5fa]" />
                  Artikel & Berita
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Hubungi Kami */}
          <div>
            <h3 className="text-xl font-bold mb-2">Hubungi Kami</h3>
            <div className="flex w-full mb-6">
                <div className="w-16 h-[2px] bg-[#2563eb]"></div>
                <div className="w-full h-px bg-white/20 mt-[0.5px]"></div>
            </div>

            <div className="flex flex-col gap-5 text-sm text-gray-100/90">
              <div className="flex gap-3 items-start group">
                <div className="bg-white/10 p-2 rounded transform group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white/50 mb-0.5 uppercase tracking-wider">Email</span>
                  <a href="mailto:ukk@unhas.ac.id" className="hover:underline font-medium text-white">ukk@unhas.ac.id</a>
                </div>
              </div>
              
              <div className="flex gap-3 items-start group">
                <div className="bg-white/10 p-2 rounded transform group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white/50 mb-0.5 uppercase tracking-wider">Nomor Telepon</span>
                  <a href="tel:+628123456789" className="hover:underline font-medium text-white">+628123456789</a>
                </div>
              </div>

              <div className="flex gap-3 items-start group">
                <div className="bg-white/10 p-2 rounded transform group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white/50 mb-0.5 uppercase tracking-wider">Lokasi</span>
                  <p className="leading-relaxed font-medium text-white">
                    Sekretariat UKK<br/>
                    Gedung Rektorat Lantai 6<br/>
                    Kampus Unhas Tamalanrea
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bagian Copyright Bar */}
      <div className="bg-[#2a2a2a] text-gray-400 text-xs py-4 px-6 lg:px-12 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3">
          <span className="tracking-wide">Copyright &copy; 2026</span>
          <span className="text-center sm:text-left tracking-wide">
            UKK Layanan Sains dan Laboratorium Universitas Hasanuddin
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
