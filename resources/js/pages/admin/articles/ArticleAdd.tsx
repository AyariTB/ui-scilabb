import React, { useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, ArrowLeft } from 'lucide-react';
import { RichTextEditor } from '../../../components/ui/RichTextEditor';
import { CATEGORIES, MOCK_ARTICLES } from './ArticleList';
import type { Article } from './ArticleList';

export default function ArticleAdd() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<{
        title: string;
        category: string;
        status: 'published' | 'draft';
        content: string;
        thumbnailFile: File | null;
        thumbnailPreviewUrl: string | null;
    }>({
        title: '',
        category: CATEGORIES[0],
        status: 'draft',
        content: '',
        thumbnailFile: null,
        thumbnailPreviewUrl: null,
    });

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                thumbnailFile: file,
                thumbnailPreviewUrl: URL.createObjectURL(file)
            }));
        }
    };

    const handleRemoveThumbnail = () => {
        setFormData(prev => ({
            ...prev,
            thumbnailFile: null,
            thumbnailPreviewUrl: null
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        const timestamp = new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        const newArticle: Article = {
            id: `art-${Date.now()}`,
            title: formData.title,
            category: formData.category,
            status: formData.status,
            content: formData.content,
            thumbnailUrl: formData.thumbnailPreviewUrl,
            author: 'Admin',
            lastUpdated: timestamp,
        };

        MOCK_ARTICLES.unshift(newArticle); 
        console.log("Artikel baru telah ditambahkan.");
        
        navigate('/admin/articles');
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/articles')}
                        className="p-2 -ml-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Kembali"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-navy">Tulis Artikel Baru</h1>
                        <p className="text-sm text-slate-muted mt-1">Buat publikasi baru untuk ditampilkan di portal publik.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-border shadow-sm overflow-hidden">
                    <form onSubmit={handleSave} className="flex flex-col">
                        <div className="p-6 space-y-6">
                            {/* Flex Container Top: Form Info & Thumbnail */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left: Metadata */}
                                <div className="flex-1 space-y-5">
                                    <div className="space-y-1.5 font-sans">
                                        <label className="text-sm font-medium text-navy">Judul Artikel <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none text-sm"
                                            placeholder="Contoh: Terobosan Riset Geologi Bawah Laut..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5 font-sans">
                                            <label className="text-sm font-medium text-navy">Kategori <span className="text-danger">*</span></label>
                                            <select 
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none text-sm bg-white"
                                            >
                                                {CATEGORIES.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5 font-sans">
                                            <label className="text-sm font-medium text-navy">Status Visibilitas</label>
                                            <select 
                                                value={formData.status}
                                                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none text-sm bg-white"
                                            >
                                                <option value="draft">Simpan sbg Draft</option>
                                                <option value="published">Langsung Publikasi</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Thumbnail Upload */}
                                <div className="w-full lg:w-72 shrink-0 space-y-1.5 font-sans">
                                    <label className="text-sm font-medium text-navy">Gambar Utama (Thumbnail)</label>
                                    <div className="relative group overflow-hidden rounded-xl border-2 border-slate-border border-dashed h-44 bg-soft-white flex flex-col items-center justify-center transition-colors hover:border-navy/50">
                                        {formData.thumbnailPreviewUrl ? (
                                            <>
                                                <img src={formData.thumbnailPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <label className="cursor-pointer bg-white text-navy px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100">
                                                        Ganti
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                                                    </label>
                                                    <button 
                                                        type="button" 
                                                        onClick={handleRemoveThumbnail}
                                                        className="bg-danger text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-4 text-center">
                                                <ImagePlus className="w-8 h-8 text-slate-300 mb-2" />
                                                <span className="text-xs font-medium text-navy leading-tight">Klik untuk unggah gambar</span>
                                                <span className="text-[10px] text-slate-400 mt-1">JPG, PNG (Maks 2MB)</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: Rich Text Content */}
                            <div className="space-y-1.5 flex flex-col min-h-[500px]">
                                <label className="text-sm font-medium text-navy block">
                                    Konten Artikel <span className="text-danger">*</span>
                                </label>
                                <div className="flex-1">
                                    <RichTextEditor 
                                        value={formData.content} 
                                        onChange={(val) => setFormData({...formData, content: val})} 
                                        onFileUpload={(f) => {
                                            console.log("File dilampirkan ke artikel:", f.name);
                                        }}
                                    />
                                </div>
                                {formData.content === '' && (
                                    <p className="text-xs text-danger mt-1">Konten artikel tidak boleh kosong.</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-slate-border bg-soft-white flex items-center justify-between">
                            <span className="text-xs text-slate-500">Author: <b>Admin</b></span>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/articles')}
                                    className="px-6 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!formData.title || !formData.content}
                                    className="bg-navy hover:bg-navy-light text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Simpan Artikel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
