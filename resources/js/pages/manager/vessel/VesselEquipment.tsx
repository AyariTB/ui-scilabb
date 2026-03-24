import { useState } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import AdminLayout from '../../../components/layout/AdminLayout';
import { Plus, Edit2, Trash2, Search, Camera } from 'lucide-react';
import { DataTable, type TableColumn } from '../../../components/ui/Table';
import { VesselEquipment } from '../../../types/vessel.types';
import { MOCK_EQUIPMENT } from '../../../mocks/vessel.mock';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmModal } from '../../../components/shared/ConfirmModal';
import EquipmentForm from './components/EquipmentForm';
import { useParams, useLocation } from 'react-router-dom';

export default function VesselEquipmentList() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const Layout = location.pathname.startsWith('/admin') ? AdminLayout : ManagerLayout;
    
    // Mapping slug ke Nama Tampilan
    const vesselName = slug === 'explorer-2' ? 'KR Unhas Explorer 2' : 'KR Unhas Explorer 1';

    const [equipment, setEquipment] = useState<VesselEquipment[]>(MOCK_EQUIPMENT);
    const [searchQuery, setSearchQuery] = useState('');
    const [condition, setCondition] = useState<any>('all');
    
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<VesselEquipment | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Filter berdasarkan Pencarian Nama dan Kondisi
    const filteredData = equipment.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCondition = condition === 'all' || item.condition === condition;
        return matchSearch && matchCondition;
    });

    const handleAdd = async (data: any) => {
        setLoading(true);
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newEq: VesselEquipment = {
            id: `eq-${Date.now()}`,
            name: data.name,
            description: data.description,
            condition: data.condition,
            thumbnailUrl: data.thumbnailUrl || null,
            lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        MOCK_EQUIPMENT.push(newEq);
        setEquipment([...MOCK_EQUIPMENT]);
        setLoading(false);
        setIsAddModalOpen(false);
    };

    const handleEdit = async (data: any) => {
        if (!editingEquipment) return;
        setLoading(true);
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const index = MOCK_EQUIPMENT.findIndex(e => e.id === editingEquipment.id);
        if (index !== -1) {
            MOCK_EQUIPMENT[index] = {
                ...MOCK_EQUIPMENT[index],
                ...data,
                lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };
        }

        setEquipment([...MOCK_EQUIPMENT]);
        setLoading(false);
        setEditingEquipment(null);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        setLoading(true);
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const index = MOCK_EQUIPMENT.findIndex(e => e.id === deletingId);
        if (index !== -1) {
            MOCK_EQUIPMENT.splice(index, 1);
        }

        setEquipment([...MOCK_EQUIPMENT]);
        setLoading(false);
        setDeletingId(null);
    };

    const columns: TableColumn<VesselEquipment>[] = [
        {
            header: 'No',
            className: 'w-16 text-center', 
            render: (_item, index) => (
                <span className="text-slate-500 font-medium">{index + 1}</span>
            ),
        },
        {
            header: 'Foto',
            className: 'w-24', 
            render: (item) => (
                <div className="w-14 h-12 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <Camera className="w-5 h-5 text-slate-400" />
                    )}
                </div>
            ),
        },
        {
            header: 'Nama Alat',
            className: 'min-w-[180px]', 
            render: (item) => (
                <div className="flex flex-col pr-4">
                    <span className="font-semibold text-navy truncate" title={item.name}>
                        {item.name}
                    </span>
                </div>
            ),
        },
        {
            header: 'Deskripsi',
            className: 'min-w-[250px] max-w-[400px]', 
            render: (item) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-600 line-clamp-2 leading-relaxed" title={item.description}>
                        {item.description}
                    </span>
                </div>
            ),
        },
        {
            header: 'Kondisi',
            className: 'w-36', 
            render: (item) => {
                const styles = {
                    'Baik': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'Rusak Ringan': 'bg-amber-50 text-amber-700 border-amber-200',
                    'Perbaikan': 'bg-blue-50 text-blue-700 border-blue-200',
                    'Rusak Berat': 'bg-red-50 text-red-700 border-red-200',
                };
                return (
                    <div className="pr-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border text-center w-full ${styles[item.condition]}`}>
                            {item.condition}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'Aksi',
            className: 'w-28 text-right', 
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setEditingEquipment(item)}
                        className="p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-md transition-all"
                        title="Edit Alat"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDeletingId(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                        title="Hapus"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-navy">Inventaris Alat Kapal</h1>
                        <p className="text-sm text-slate-muted mt-1">
                            Kelola alat riset dan fasilitas teknis untuk {vesselName}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Alat
                    </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-border flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" />
                        <input
                            type="text"
                            placeholder="Cari nama alat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-border focus:ring-1 focus:ring-navy outline-none text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value as any)}
                            className="px-4 py-2 rounded-lg border border-slate-border text-sm bg-white outline-none cursor-pointer"
                        >
                            <option value="all">Semua Kondisi</option>
                            <option value="Baik">Baik</option>
                            <option value="Perbaikan">Perbaikan</option>
                            <option value="Rusak Ringan">Rusak Ringan</option>
                            <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="Tidak ada alat kapal yang ditemukan."
                />
            </div>

            {/* Modal Tambah Alat */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Alat Inventaris"
                size="2xl"
            >
                <EquipmentForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddModalOpen(false)}
                    loading={loading}
                />
            </Modal>

            {/* Modal Edit Alat */}
            <Modal
                isOpen={!!editingEquipment}
                onClose={() => setEditingEquipment(null)}
                title="Edit Informasi Alat"
                size="2xl"
            >
                <EquipmentForm 
                    initialData={editingEquipment}
                    onSubmit={handleEdit}
                    onCancel={() => setEditingEquipment(null)}
                    loading={loading}
                />
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDelete}
                title="Hapus Alat?"
                message="Tindakan ini akan menghapus alat dari inventaris kapal secara permanen. Apakah Anda yakin?"
                confirmLabel="Ya, Hapus Alat"
                variant="danger"
                loading={loading}
            />
        </Layout>
    );
}
