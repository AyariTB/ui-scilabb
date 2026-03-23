import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Key } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';
import { DataTable, type TableColumn } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import UserForm from './components/UserForm';

// --- MOCK DATA ---
export interface User {
    id: string;
    name: string;
    email: string;
    nip: number;
    role: string;
    password: string; // Password field ditambahkan
    created_by: string;
    updated_by: string;
}

export const MOCK_USERS: User[] = [
    {
        id: 'user-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        nip: 123456789,
        role: 'Admin',
        password: 'password123',
        created_by: 'System',
        updated_by: 'System',
    },
    {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        nip: 199001012020121001,
        role: 'Kepala Lab',
        password: 'passwordlab123',
        created_by: 'System',
        updated_by: 'System',
    },
];

export const ROLES = ['Admin', 'Kepala Lab', 'Kepala Non-Lab', 'Manager Kapal'];

export default function UserList() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Computed states
    const filteredUsers = users.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchRole = filterRole === 'all' || user.role === filterRole;
        return matchSearch && matchRole;
    });

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            const updatedUsers = users.filter(u => u.id !== id);
            setUsers(updatedUsers);
            
            // Sync with mock source
            const index = MOCK_USERS.findIndex(u => u.id === id);
            if (index !== -1) {
                MOCK_USERS.splice(index, 1);
            }
        }
    };

    const handleAddUser = async (data: any) => {
        setLoading(true);
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newUser: User = {
            id: `user-${Date.now()}`,
            ...data,
            created_by: 'Admin',
            updated_by: 'Admin',
        };

        MOCK_USERS.push(newUser);
        setUsers([...MOCK_USERS]);
        setLoading(false);
        setIsAddModalOpen(false);
    };

    const handleEditUser = async (data: any) => {
        if (!editingUser) return;
        setLoading(true);
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const index = MOCK_USERS.findIndex(u => u.id === editingUser.id);
        if (index !== -1) {
            MOCK_USERS[index] = {
                ...MOCK_USERS[index],
                ...data,
                updated_by: 'Admin',
            };
        }

        setUsers([...MOCK_USERS]);
        setLoading(false);
        setEditingUser(null);
    };

    /**
     * Definisi kolom untuk tabel user.
     */
    const userColumns: TableColumn<User>[] = [
        {
          header: 'No',
          className: 'w-12 text-center',
          render: (_row, index) => (
              <span className="text-slate-500 font-medium">{index + 1}</span>
          ),
        },
        {
          header: 'Nama Pengguna',
          render: (user) => (
              <div className="flex flex-col">
                  <span className="font-semibold text-navy max-w-sm truncate" title={user.name}>
                      {user.name}
                  </span>
              </div>
          ),
        },
        {
          header: 'NIP',
          render: (user) => (
            <span className="text-slate-600">{user.nip}</span>
          )
        },
        {
          header: 'Email',
          render: (user) => <span className="text-slate-600 font-medium">{user.email}</span>,
        },
        {
          header: 'Role',
          render: (user) => (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  {user.role}
              </span>
          ),
        },
        {
          header: 'Riwayat',
          render: (user) => (
              <div className="flex flex-col text-[11px] text-slate-muted leading-tight">
                  <span>Oleh: {user.created_by}</span>
                  <span>Update: {user.updated_by}</span>
              </div>
          ),
        },
        {
          header: 'Aksi',
          render: (user) => (
              <div className="flex items-center gap-2">
                  <button
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Reset Password"
                  >
                      <Key className="w-4 h-4" />
                  </button>
                  <button
                      onClick={() => setEditingUser(user)}
                      className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit"
                  >
                      <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                        <h1 className="text-2xl font-bold text-navy">Manajemen Pengguna</h1>
                        <p className="text-sm text-slate-muted mt-1">
                            Kelola akun pengguna dan hak akses dalam satu tempat.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-navy"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah User
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-xl border border-slate-border flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" />
                        <input
                            type="text"
                            placeholder="Cari user (nama/email)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all text-sm"
                        />
                    </div>
                    <div className="flex gap-4 sm:w-auto">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-48 px-4 py-2 rounded-lg border border-slate-border focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all text-sm bg-white"
                        >
                            <option value="all">Semua Role</option>
                            {ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tabel user */}
                <DataTable
                    columns={userColumns}
                    data={filteredUsers}
                    emptyMessage="Tidak ada user yang sesuai."
                />
            </div>

            {/* Modal Tambah User */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah User Baru"
                size="2xl"
            >
                <UserForm 
                    onSubmit={handleAddUser}
                    onCancel={() => setIsAddModalOpen(false)}
                    loading={loading}
                />
            </Modal>

            {/* Modal Edit User */}
            <Modal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                title="Edit Informasi User"
                size="2xl"
            >
                <UserForm 
                    initialData={editingUser || undefined}
                    onSubmit={handleEditUser}
                    onCancel={() => setEditingUser(null)}
                    loading={loading}
                />
            </Modal>
        </AdminLayout>
    );
}