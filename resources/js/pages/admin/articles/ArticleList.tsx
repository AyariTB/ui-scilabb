import { useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type TableColumn } from '../../../components/ui/Table';

// --- MOCK DATA ---
export interface Article {
    id: string;
    title: string;
    category: string;
    status: 'published' | 'draft';
    content: string;
    thumbnailUrl?: string | null;
    author: string;
    lastUpdated: string;
}

export const MOCK_ARTICLES: Article[] = [
    {
        id: 'art-1',
        title: 'Inovasi Teknologi Maritim Terbaru 2026',
        category: 'Berita',
        status: 'published',
        content: '<h2>Inovasi Kapal Otonom</h2><p>Perkembangan teknologi maritim semakin pesat dengan hadirnya kapal otonom...</p>',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=300&h=200',
        author: 'Dr. Budi Santoso',
        lastUpdated: '16 Mar 2026',
    },
    {
        id: 'art-2',
        title: 'Standar Keselamatan Penelitian Laut Dalam',
        category: 'Panduan',
        status: 'draft',
        content: '<h2>Prosedur Penyelaman</h2><p>Draft panduan untuk prosedur penyelaman laut dalam menggunakan ROV...</p>',
        author: 'Siti Rahayu, M.Sc.',
        lastUpdated: '15 Mar 2026',
    },
];

export const CATEGORIES = ['Berita', 'Panduan', 'Riset', 'Pengumuman'];

export default function ArticleList() {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
    
    // Computed states
    const filteredArticles = articles.filter(article => {
        const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = filterStatus === 'all' || article.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel/berita ini?')) {
            setArticles(prev => prev.filter(a => a.id !== id));
            // Simulate API delete by mutating the mock source array
            const index = MOCK_ARTICLES.findIndex(a => a.id === id);
            if (index !== -1) {
                MOCK_ARTICLES.splice(index, 1);
            }
        }
    };

    /**
     * Definisi kolom untuk tabel artikel.
     * Diletakkan di dalam komponen agar dapat mengakses `navigate` dan `handleDelete`
     * tanpa prop-drilling ke DataTable.
     */
    const articleColumns: TableColumn<Article>[] = [
        {
            header: 'No',
            className: 'w-12 text-center',
            render: (_row, index) => (
                <span className="text-slate-500 font-medium">{index + 1}</span>
            ),
        },
        {
            header: 'Foto',
            className: 'w-20 min-w-[80px]', 
            render: (article) => (
                <div className="w-12 h-10 flex-shrink-0"> 
                    {article.thumbnailUrl ? (
                        <img
                            src={article.thumbnailUrl}
                            alt={article.title}
                            className="w-full h-full object-cover rounded-md border border-slate-200"
                        />
                    ) : (
                        <div className="w-full h-full rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: 'Judul Artikel',
            render: (article) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-navy max-w-sm truncate" title={article.title}>
                        {article.title}
                    </span>
                    <span className="text-xs text-slate-muted mt-0.5">Diperbarui: {article.lastUpdated}</span>
                </div>
            ),
        },
        {
            header: 'Kategori',
            render: (article) => (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {article.category}
                </span>
            ),
        },
        {
            header: 'Penulis',
            render: (article) => <span className="text-slate-600">{article.author}</span>,
        },
        {
            header: 'Status',
            render: (article) =>
                article.status === 'published' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Dipublikasikan
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Draft
                    </span>
                ),
        },
        {
            header: 'Aksi',
            render: (article) => (
                <div className="flex items-center gap-2">
                    <button
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Preview"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                        className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(article.id)}
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
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-navy">Manajemen Artikel</h1>
                        <p className="text-sm text-slate-muted mt-1">
                            Kelola publikasi, berita riset, dan pengumuman untuk portal publik.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/articles/create')}
                        className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-navy"
                    >
                        <Plus className="w-4 h-4" />
                        Tulis Artikel Baru
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-xl border border-slate-border flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all text-sm"
                        />
                    </div>
                    <div className="flex gap-4 sm:w-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                            className="w-48 px-4 py-2 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all text-sm bg-white"
                        >
                            <option value="all">Semua Status</option>
                            <option value="published">Dipublikasikan</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Tabel artikel menggunakan komponen DataTable reusable */}
                <DataTable
                    columns={articleColumns}
                    data={filteredArticles}
                    emptyMessage="Tidak ada artikel yang sesuai."
                />
            </div>
        </AdminLayout>
    );
}
