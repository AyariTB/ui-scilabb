import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  ShoppingCart, 
  History, 
  HeadphonesIcon, 
  LogOut,
  Camera
} from 'lucide-react';
import MainLayout from './components/MainLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// ----------------------------------------------------
// KOMPONEN INTERNAL: Sidebar Navigasi User
// ----------------------------------------------------
const UserSidebar = () => {
    return (
        <div className="flex flex-col gap-4 w-full md:w-64 shrink-0">
            {/* Header User Center */}
            <div className="bg-[#f0f0f0] rounded-tl-xl rounded-br-2xl p-4 flex items-center justify-center font-bold text-gray-800 shadow-sm cursor-pointer hover:bg-gray-200 transition-colors">
                <User className="w-5 h-5 mr-3" strokeWidth={2.5} />
                User Center
            </div>
            
            {/* Menu List */}
            <div className="bg-[#f0f0f0] rounded-xl py-6 shadow-sm flex flex-col items-center">
                <nav className="flex flex-col w-full px-4 gap-1.5">
                    <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-white hover:rounded-xl hover:shadow-sm transition-all duration-300 w-full text-left font-semibold">
                        <Bell className="w-[18px] h-[18px] mr-4 text-gray-800" strokeWidth={2.5} />
                        Notification
                    </button>
                    <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-white hover:rounded-xl hover:shadow-sm transition-all w-full text-left font-semibold">
                        <ShoppingCart className="w-[18px] h-[18px] mr-4 text-gray-800" strokeWidth={2.5} />
                        Keranjang
                    </button>
                    <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-white hover:rounded-xl hover:shadow-sm transition-all w-full text-left font-semibold">
                        <History className="w-[18px] h-[18px] mr-4 text-gray-800" strokeWidth={2.5} />
                        Order History
                    </button>
                    <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-white hover:rounded-xl hover:shadow-sm transition-all w-full text-left font-semibold">
                        <HeadphonesIcon className="w-[18px] h-[18px] mr-4 text-gray-800" strokeWidth={2.5} />
                        Service Center
                    </button>
                    
                    {/* Log Out dengan efek merah */}
                    <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all w-full text-left font-semibold mt-6 border-t border-gray-300 pt-7 group">
                        <LogOut className="w-[18px] h-[18px] mr-4 text-gray-800 group-hover:text-red-600 transition-colors" strokeWidth={2.5} />
                        Sign Out
                    </button>
                </nav>
            </div>
        </div>
    );
};

// ----------------------------------------------------
// KOMPONEN UTAMA: Halaman Profil
// ----------------------------------------------------
const Profile = () => {
  // Mode pengeditan diatur ke false secara default agar tampil seperti referensi gambar (View Mode)
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: 'John Doe',
    dob: '1999-01-01',
    gender: 'Pria',
    status: 'Eksternal',
    email: 'JohnDoe@gmail.com',
    phone: '+628123456789'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Placeholder untuk aksi simpan form (API request here)
    setIsEditing(false);
  };

  // Utility untuk memformat tanggal (1999-01-01 => 1 Januari 1999) 
  // Tanpa risiko bug timezone JavaScript.
  const formatTanggalLahir = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <MainLayout>
      <div className="py-10 bg-white">
        {/* Kontainer Lebar Maksimal dengan jarak Kolom Kiri Kanan */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-10">
          
          {/* Kolom 1: Navigasi Kiri */}
          <UserSidebar />

          {/* Kolom 2: Form Biodata Diri Utama */}
          <div className="flex-1">
            <h1 className="text-[28px] sm:text-3xl font-bold text-black mb-6 tracking-tight">Biodata Diri</h1>
            
            <div className="bg-[#f0f0f0] rounded-xl p-6 sm:p-10 shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
                
                {/* --- A. Bagian Kiri Dalam: Foto Avatar & Atur Gambar --- */}
                <div className="flex flex-col items-center shrink-0 w-full lg:w-[260px]">
                  {/* Kotak Abu Placeholder */}
                  <div className="w-full aspect-square bg-[#d9d9d9] rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                    <User className="w-24 h-24 text-gray-400" />
                  </div>
                  
                  <Button variant="danger" className="w-[180px] mb-3.5 bg-[#bd1e24] hover:bg-[#a01a1f] text-white font-bold py-3">
                     <Camera className="w-4 h-4" />
                     Pilih Foto
                  </Button>
                  
                  <p className="text-[12px] text-gray-500 text-center leading-relaxed max-w-[200px]">
                    Besar file : maksimum 10 MB. 
                    Ekstensi file yang diperbolehkan .JPG .JPEG .PNG
                  </p>
                </div>

                {/* --- B. Bagian Kanan Dalam: Atribut Form Informasi Pribadi --- */}
                <div className="flex-1 flex flex-col justify-between h-full min-h-[320px]">
                  
                  {/* Toggling State Render antara Teks Baca dan Form Edit */}
                  {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-4 mb-10 w-full mt-2 pr-4">
                       <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-0">
                          <span className="w-full xl:w-2/5 text-gray-500 font-medium text-[13.5px]">Nama</span>
                          <span className="w-full xl:w-3/5 font-medium text-gray-800 text-[13.5px]">{formData.name}</span>
                       </div>
                       <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-0">
                          <span className="w-full xl:w-1/2 text-gray-500 font-medium text-[13.5px]">Tanggal Lahir</span>
                          <span className="w-full xl:w-1/2 font-medium text-gray-800 text-[13.5px]">{formatTanggalLahir(formData.dob)}</span>
                       </div>
                       <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-0">
                          <span className="w-full xl:w-2/5 text-gray-500 font-medium text-[13.5px]">Jenis Kelamin</span>
                          <span className="w-full xl:w-3/5 font-medium text-gray-800 text-[13.5px]">{formData.gender}</span>
                       </div>
                       <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-0">
                          <span className="w-full xl:w-1/2 text-gray-500 font-medium text-[13.5px]">Status</span>
                          <span className="w-full xl:w-1/2 font-medium text-gray-800 text-[13.5px]">{formData.status}</span>
                       </div>
                       <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-0">
                          <span className="w-full xl:w-2/5 text-gray-500 font-medium text-[13.5px]">Email</span>
                          <span className="w-full xl:w-3/5 font-medium text-gray-800 text-[13.5px]">{formData.email}</span>
                       </div>
                       <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-0">
                          <span className="w-full xl:w-1/2 text-gray-500 font-medium text-[13.5px]">Nomor Telepon</span>
                          <span className="w-full xl:w-1/2 font-medium text-gray-800 text-[13.5px]">{formData.phone}</span>
                       </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 mb-10 w-full animate-in fade-in zoom-in-95 duration-200">
                       <Input label="Nama Lengkap" name="name" value={formData.name} onChange={handleChange} />
                       <Input label="Tanggal Lahir" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                       <Input label="Jenis Kelamin" name="gender" value={formData.gender} onChange={handleChange} />
                       <Input label="Status" name="status" value={formData.status} onChange={handleChange} />
                       <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                       <Input label="Nomor Telepon" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                  )}

                  {/* Penempatan Tombol Action Eksekusi di Bawah Kanan (Flex-End) */}
                  <div className="flex justify-end mt-auto pt-6 lg:pt-0">
                    {isEditing ? (
                       <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                          <Button variant="secondary" className="w-full sm:w-32 py-3 bg-white" onClick={() => setIsEditing(false)}>
                            Batal
                          </Button>
                          <Button variant="danger" className="w-full sm:w-48 py-3 bg-[#bd1e24] hover:bg-[#a01a1f] text-white" onClick={handleSave}>
                            Simpan Perubahan
                          </Button>
                       </div>
                    ) : (
                       <Button variant="danger" className="w-full lg:w-[220px] py-3 bg-[#bd1e24] hover:bg-[#a01a1f] text-white font-bold" onClick={() => setIsEditing(true)}>
                         Ubah Biodata Diri
                       </Button>
                    )}
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
