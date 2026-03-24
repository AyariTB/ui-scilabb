import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit3, Save, ImagePlus, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import ManagerLayout from '@/components/layout/ManagerLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import { RichTextEditor } from '../../../components/ui/RichTextEditor';
import { VesselData } from '../../../types/vessel.types';

import { MOCK_VESSEL_EXPLORER_1, MOCK_VESSEL_EXPLORER_2 } from '../../../mocks/vessel.mock';

export default function VesselInfo() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    const Layout = location.pathname.startsWith('/admin') ? AdminLayout : ManagerLayout;
    
    // Pilih data berdasarkan slug
    const initialData = slug === 'explorer-2' ? MOCK_VESSEL_EXPLORER_2 : MOCK_VESSEL_EXPLORER_1;
    const showPrice = slug !== 'explorer-2'; 

    const [isEditing, setIsEditing] = useState(false);
    
    const [vesselData, setVesselData] = useState<VesselData>(initialData);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const handleSave = () => {
        setIsEditing(false);
        console.log("Data kapal diperbarui ke database");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map((file, index) => ({
                id: Date.now() + index,
                url: URL.createObjectURL(file),
                alt: file.name
            }));
            setVesselData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-6 pb-20">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </button>
                        <h1 className="text-2xl font-bold text-navy">{vesselData.name}</h1>
                    </div>
                    
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium bg-navy hover:bg-navy-light flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Simpan
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light flex items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" /> Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-6 rounded-xl border border-slate-border">
                            <h2 className="text-lg font-bold text-navy mb-5">Informasi Umum</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Kapal</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={vesselData.name}
                                            onChange={(e) => setVesselData({...vesselData, name: e.target.value})}
                                            className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-navy outline-none"
                                        />
                                    ) : (
                                        <p className="text-navy font-medium text-lg mt-1">{vesselData.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deskripsi Singkat</label>
                                    {isEditing ? (
                                        <textarea 
                                            value={vesselData.description}
                                            onChange={(e) => setVesselData({...vesselData, description: e.target.value})}
                                            rows={3}
                                            className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-navy outline-none"
                                        />
                                    ) : (
                                        <p className="text-slate-600 mt-1 leading-relaxed">{vesselData.description}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {showPrice && (
                            <section className="bg-white p-6 rounded-xl border border-slate-border">
                                <h2 className="text-lg font-bold text-navy mb-5">Harga</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Harga Sewa (Rp)</label>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="relative flex-1">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rp</span>
                                                    <input 
                                                        type="number" 
                                                        value={vesselData.price_per_hour}
                                                        onChange={(e) => setVesselData({...vesselData, price_per_hour: Number(e.target.value)})}
                                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-navy outline-none"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <span className="text-slate-500 text-sm font-medium">/ Jam</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <p className="text-2xl font-bold text-navy">
                                                    Rp {vesselData.price_per_hour.toLocaleString('id-ID')}
                                                </p>
                                                <span className="text-slate-500 text-sm font-medium">/ Jam</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Keterangan Harga</label>
                                        {isEditing ? (
                                            <textarea 
                                                value={vesselData.price_description}
                                                onChange={(e) => setVesselData({...vesselData, price_description: e.target.value})}
                                                rows={2}
                                                placeholder="Contoh: Harga termasuk ABK, belum termasuk BBM..."
                                                className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-navy outline-none text-sm"
                                            />
                                        ) : (
                                            <p className="text-slate-500 text-sm mt-1 italic">
                                                {vesselData.price_description || 'Tidak ada catatan harga tambahan.'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="bg-white p-6 rounded-xl border border-slate-border min-h-[400px]">
                            <h2 className="text-lg font-bold text-navy mb-5">Informasi Detail</h2>
                            <div className={!isEditing ? "prose prose-slate max-w-none" : ""}>
                                {isEditing ? (
                                    <RichTextEditor 
                                        value={vesselData.content_html} 
                                        onChange={(val) => setVesselData({...vesselData, content_html: val})} 
                                    />
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: vesselData.content_html }} />
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section className="bg-white p-6 rounded-xl border border-slate-border">
                            <h2 className="text-lg font-bold text-navy mb-5">Foto Kapal</h2>
                            
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-100 group">
                                {vesselData.images.length > 0 ? (
                                    <>
                                        <img 
                                            src={vesselData.images[activeImageIndex].url} 
                                            className="w-full h-full object-cover transition-all"
                                            alt="Preview"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setActiveImageIndex(prev => prev === 0 ? vesselData.images.length - 1 : prev - 1)}
                                                className="p-1 bg-white/80 rounded-full hover:bg-white"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => setActiveImageIndex(prev => prev === vesselData.images.length - 1 ? 0 : prev + 1)}
                                                className="p-1 bg-white/80 rounded-full hover:bg-white"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <ImagePlus className="w-10 h-10 mb-2 opacity-20" />
                                        <span className="text-xs">Belum ada unggahan</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {vesselData.images.map((img, idx) => (
                                    <div 
                                        key={img.id} 
                                        className={`relative aspect-square rounded-md border-2 overflow-hidden cursor-pointer transition-all ${activeImageIndex === idx ? 'border-navy scale-95' : 'border-transparent'}`}
                                        onClick={() => setActiveImageIndex(idx)}
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
                                        {isEditing && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setVesselData(prev => ({...prev, images: prev.images.filter(i => i.id !== img.id)}));
                                                }}
                                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                
                                {isEditing && (
                                    <label className="aspect-square border-2 border-dashed border-slate-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-50">
                                        <Plus className="w-5 h-5 text-slate-300" />
                                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </label>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
