import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  ChevronDown, 
  Search, 
  Bell, 
  ShoppingCart, 
  User, 
  Menu, 
  X 
} from 'lucide-react';

const TopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="w-full font-sans bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:flex justify-between items-center bg-[#bd1e24] text-white text-xs px-6 lg:px-8 py-2 border-b border-[#a01a1f]">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5" />
          <span>+628123456789</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:text-gray-200">
            <ChevronDown className="w-3.5 h-3.5" />
            Bahasa Indonesia
          </button>
          <Link to="/" className="hover:text-gray-200">Lokasi Unit Kerja Khusus</Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-gray-100">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img 
            src="/logo-unhas.png" 
            alt="Unhas" 
            className="h-10 w-auto object-contain" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
          />
          <div className="flex flex-col text-[#bd1e24] font-bold leading-none">
            <span className="text-[17px]">SciLab</span>
            <span className="text-[22px] mt-0.5">HUB</span>
          </div>
        </Link>

        {/* Nav & Search Area (Desktop) */}
        <div className="hidden lg:flex items-center flex-1 ml-8 xl:ml-12 gap-6 xl:gap-8 overflow-hidden">
          {/* Nav Links */}
          <nav className="flex items-center gap-6 shrink-0 text-[15px] font-medium text-gray-800">
            <Link to="/services" className="flex items-center gap-1.5 cursor-pointer hover:text-[#bd1e24] transition-colors">
              Layanan
            </Link>
            <Link to="/laboratories" className="flex items-center gap-1.5 cursor-pointer hover:text-[#bd1e24] transition-colors">
              Laboratorium
            </Link>
            <Link to="/artikel" className="hover:text-[#bd1e24] transition-colors">Artikel</Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl flex items-center bg-[#f1f5f9] rounded-full px-4 py-2 transition-colors focus-within:bg-[#e2e8f0]">
            <input 
              type="text" 
              placeholder="Cari Layanan" 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-500"
            />
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors shrink-0 ml-1">
               <Search className="w-4 h-4 text-gray-500 hover:text-[#bd1e24]" />
            </button>
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center justify-end gap-5 text-gray-800 ml-6 shrink-0">
          <button className="hover:text-[#bd1e24] transition-colors p-1" aria-label="Notifikasi">
            <Bell className="w-5 h-5" />
          </button>
          <button className="hover:text-[#bd1e24] transition-colors p-1" aria-label="Keranjang">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <Link to="/profile" className="flex items-center gap-2.5 hover:text-[#bd1e24] transition-colors group">
            <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-[#bd1e24] transition-colors">
               <User className="w-5 h-5" />
            </div>
            <span className="text-[15px] font-medium whitespace-nowrap">John Doe</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-gray-800 p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Tampilkan Menu"
        >
          {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu Area */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 flex flex-col shadow-md">
          {/* Mobile Search */}
          <div className="p-4 bg-gray-50">
            <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 focus-within:border-gray-300">
              <input 
                type="text" 
                placeholder="Cari Layanan" 
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-500"
              />
              <Search className="w-4 h-4 text-gray-500 ml-2" />
            </div>
          </div>
          
          {/* Mobile Nav Links */}
          <nav className="flex flex-col px-4 py-2 text-[15px] font-medium text-gray-800 divide-y divide-gray-100">
            <Link to="/services" className="flex items-center justify-between py-3.5 cursor-pointer hover:text-[#bd1e24]">
              <span>Layanan</span>
            </Link>
            <Link to="/laboratories" className="flex items-center justify-between py-3.5 cursor-pointer hover:text-[#bd1e24]">
              <span>Laboratorium</span>
            </Link>
            <Link to="/artikel" className="py-3.5 block hover:text-[#bd1e24]">Artikel</Link>
          </nav>

          {/* Mobile Divider */}
          <div className="h-2 w-full bg-gray-50"></div>

          {/* Mobile Account & Actions */}
          <div className="px-4 py-4 flex flex-col gap-5 text-gray-800">
            <button className="flex items-center justify-between w-full group hover:text-[#bd1e24] transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500 group-hover:text-[#bd1e24]" />
                <span className="font-medium">Notifikasi</span>
              </div>
            </button>
            <button className="flex items-center justify-between w-full group hover:text-[#bd1e24] transition-colors">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-gray-500 group-hover:text-[#bd1e24]" />
                <span className="font-medium">Keranjang Belanja</span>
              </div>
            </button>
            <Link to="/profile" className="flex items-center justify-between w-full group hover:text-[#bd1e24] transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-[#bd1e24] transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-medium leading-none">John Doe</span>
                  <span className="text-xs text-gray-500 mt-1">Akun Saya</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNavbar;
