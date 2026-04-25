import { Link } from 'react-router-dom';

export interface CatalogCardProps {
  /** URL untuk gambar thumbnail layanan/katalog */
  thumbnailUrl: string;
  /** Nama layanan/lab */
  title: string;
  /** Teks status/ketersediaan (Contoh: "Tersedia", "Premium") */
  badgeText: string;
  /** Jenis variasi warna badge */
  badgeVariant?: 'success' | 'danger' | 'warning' | 'default';
  /** Harga dalam bentuk string (Contoh: "Rp 150.000 / Sampel") */
  price: string;
  /** Tautan/URL yang dituju ketika tombol "Lihat Detail" diklik */
  detailUrl: string;
}

const CatalogCard = ({
  thumbnailUrl,
  title,
  badgeText,
  badgeVariant = 'success',
  price,
  detailUrl,
}: CatalogCardProps) => {
  
  // Fungsi penyeleksi warna badge yang dinamis
  const getBadgeColors = () => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'danger':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'warning':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Bagian Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50 flex shrink-0">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => { 
            // Fallback apabila link gambar gagal dimuat
            e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image'; 
          }}
        />
        
        {/* Badge Label (posisi melayang di atas gambar) */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 flex items-center text-[10px] font-extrabold uppercase tracking-widest rounded-md border shadow-sm backdrop-blur-sm bg-opacity-95 ${getBadgeColors()}`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Bagian Informasi & Teks */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-gray-800 font-bold text-base md:text-[17px] leading-snug mb-2 line-clamp-2 group-hover:text-[#bd1e24] transition-colors">
          {title}
        </h3>
        
        {/* Spacer fleksibel mendorong harga & tombol selalu di bawah meskipun teks pendek */}
        <div className="flex-1"></div>

        {/* Harga */}
        <div className="mt-3 mb-5 flex flex-col">
          <span className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase mb-1">
            Biaya Layanan
          </span>
          <span className="text-xl font-extrabold text-[#bd1e24] tracking-tight">
            {price}
          </span>
        </div>

        {/* Tombol Aksi */}
        <Link 
          to={detailUrl}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-transparent border-[1.5px] border-[#bd1e24] text-[#bd1e24] font-bold text-[14.5px] tracking-wide rounded-xl hover:bg-[#bd1e24] hover:text-white transition-all duration-300 focus:ring-4 focus:ring-red-100 focus:outline-none"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default CatalogCard;
