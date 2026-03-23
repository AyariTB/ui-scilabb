import React, { useState } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import { Plus, Edit2, Trash2, FileText, Search, Download, X, Paperclip } from 'lucide-react';
import { RichTextEditor } from '../../../components/ui/RichTextEditor';
import { DataTable, type TableColumn } from '../../../components/ui/Table';

// --- MOCK DATA ---
interface Guide {
    id: string;
    title: string;
    category: string;
    content: string;
    attachmentUrl?: string;
    attachmentName?: string;
    lastUpdated: string;
}

const MOCK_GUIDES: Guide[] = [
    {
        id: 'g-1',
        title: 'SOP Keselamatan Berlayar',
        category: 'Keselamatan',
        content: '<h2>Standar Operasional Keselamatan</h2><p>Semua kru harus memakai jaket pelampung saat berada di dek luar.</p>',
        attachmentUrl: '#',
        attachmentName: 'SOP_Keselamatan_v2.pdf',
        lastUpdated: '16 Mar 2026',
    },
    {
        id: 'g-2',
        title: 'Panduan Maintenance Mesin',
        category: 'Teknis',
        content: '<h2>Jadwal Perawatan</h2><ul><li>Pengecekan oli setiap 100 jam nyala.</li><li>Pembersihan filter setiap minggu.</li></ul>',
        lastUpdated: '14 Mar 2026',
    },
];

const CATEGORIES = ['Keselamatan', 'Teknis', 'Operasional', 'Administrasi'];

import { useParams } from 'react-router-dom';

export default function VesselGuides() {
    const { slug } = useParams<{ slug: string }>();
    const vesselName = slug === 'explorer-2' ? 'KR Unhas Explorer 2' : 'KR Unhas Explorer 1';

    const [guides, setGuides] = useState<Guide[]>(MOCK_GUIDES);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        category: string;
        content: string;
        file: File | null;
    }>({
        title: '',
        category: CATEGORIES[0],
        content: '',
        file: null,
    });

    const filteredGuides = guides.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (guide?: Guide) => {
        if (guide) {
            setEditingId(guide.id);
            setFormData({
                title: guide.title,
                category: guide.category,
                content: guide.content,
                file: null, 
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                category: CATEGORIES[0],
                content: '',
                file: null,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        const timestamp = new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        if (editingId) {
            setGuides(prev => prev.map(g => g.id === editingId ? {
                ...g,
                title: formData.title,
                category: formData.category,
                content: formData.content,
                lastUpdated: timestamp,
                attachmentName: formData.file ? formData.file.name : g.attachmentName,
            } : g));
        } else {
            const newGuide: Guide = {
                id: `g-${Date.now()}`,
                title: formData.title,
                category: formData.category,
                content: formData.content,
                lastUpdated: timestamp,
                attachmentName: formData.file?.name,
            };
            setGuides(prev => [newGuide, ...prev]);
        }
        
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus panduan ini?')) {
            setGuides(prev => prev.filter(g => g.id !== id));
        }
    };

    const guideColumns: TableColumn<Guide>[] = [
        {
            header: 'No',
            className: 'w-12',
            render: (_row, index) => index + 1,
        },
        {
            header: 'Judul Panduan',
            render: (guide) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-active-bg text-navy flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-navy">{guide.title}</span>
                </div>
            ),
        },
        {
            header: 'Kategori',
            render: (guide) => (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {guide.category}
                </span>
            ),
        },
        {
            header: 'Lampiran',
            render: (guide) =>
                guide.attachmentName ? (
                    <button className="flex items-center gap-1.5 text-info hover:underline text-xs" title="Unduh Lampiran">
                        <Download className="w-3.5 h-3.5" />
                        {guide.attachmentName}
                    </button>
                ) : (
                    <span className="text-slate-muted text-xs">-</span>
                ),
        },
        {
            header: 'Terakhir Diperbarui',
            render: (guide) => <span className="text-slate-600">{guide.lastUpdated}</span>,
        },
        {
            header: 'Aksi',
            render: (guide) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleOpenModal(guide)}
                        className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(guide.id)}
                        className="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <ManagerLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-navy">Panduan Kapal</h1>
                        <p className="text-sm text-slate-muted mt-1">
                            Kelola dokumen SOP, panduan teknis, dan operasional pelayaran untuk {vesselName}.
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-navy"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Panduan
                    </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-border flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" />
                        <input
                            type="text"
                            placeholder="Cari panduan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                <DataTable
                    columns={guideColumns}
                    data={filteredGuides}
                    emptyMessage="Tidak ada panduan ditemukan."
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-border">
                            <h2 className="text-lg font-bold text-navy">
                                {editingId ? 'Edit Panduan' : 'Tambah Panduan Baru'}
                            </h2>
                            <button 
                                onClick={handleCloseModal}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 font-sans">
                                        <label className="text-sm font-medium text-navy">Judul Panduan <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none text-sm"
                                            placeholder="Contoh: SOP Berlabuh"
                                        />
                                    </div>
                                    <div className="space-y-1.5 font-sans">
                                        <label className="text-sm font-medium text-navy">Kategori <span className="text-danger">*</span></label>
                                        <select 
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none text-sm bg-white"
                                        >
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5 flex flex-col h-[400px]">
                                    <label className="text-sm font-medium text-navy block">
                                        Konten Panduan <span className="text-danger">*</span>
                                    </label>
                                    <div className="flex-1 overflow-hidden flex flex-col">
                                        <RichTextEditor 
                                            value={formData.content} 
                                            onChange={(val) => setFormData({...formData, content: val})} 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 font-sans pb-4">
                                    <label className="text-sm font-medium text-navy">Lampiran Dokumen (Opsional)</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-border border-dashed rounded-xl hover:border-navy/50 transition-colors bg-soft-white/50">
                                        <div className="space-y-2 text-center">
                                            {formData.file ? (
                                                <div className="flex flex-col items-center">
                                                    <FileText className="mx-auto h-10 w-10 text-info opacity-80" />
                                                    <p className="text-sm text-navy font-medium mt-2">{formData.file.name}</p>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setFormData({...formData, file: null})}
                                                        className="text-xs text-danger mt-1 hover:underline"
                                                    >
                                                        Hapus File
                                                    </button>
                                                </div>
                                            ) : (
                                            <>
                                            <label 
                                                htmlFor="file-upload" 
                                                className="flex flex-col items-center cursor-pointer group"
                                            >
                                                <Paperclip className="mx-auto h-10 w-10 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                                <div className="flex text-sm text-slate-600 justify-center mt-2">
                                                    <span className="relative bg-white rounded-md font-medium text-navy hover:text-blue-600 px-2">
                                                        Upload file
                                                    </span>
                                                    <input 
                                                        id="file-upload" 
                                                        name="file-upload" 
                                                        type="file" 
                                                        className="sr-only" 
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={(e) => {
                                                            if(e.target.files?.[0]) {
                                                                setFormData({...formData, file: e.target.files[0]});
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                                            </label>
                                            </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-6 py-4 border-t border-slate-border bg-soft-white rounded-b-xl flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!formData.title || !formData.content}
                                    className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Simpan Panduan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ManagerLayout>
    );
}
