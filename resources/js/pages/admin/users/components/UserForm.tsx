import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { ConfirmModal } from '../../../../components/shared/ConfirmModal';
import type { User } from '../UserList';
import { ROLES } from '../UserList';

interface UserFormProps {
    initialData?: User;
    onSubmit: (data: Partial<User> & { password?: string }) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function UserForm({ initialData, onSubmit, onCancel, loading = false }: UserFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nip: '',
        role: ROLES[0],
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<any>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                nip: String(initialData.nip),
                role: initialData.role,
                password: initialData.password, 
                confirmPassword: initialData.password,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                nip: '',
                role: ROLES[0],
                password: '',
                confirmPassword: '',
            });
        }
    }, [initialData]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Nama wajib diisi';
        if (!formData.email) newErrors.email = 'Email wajib diisi';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email tidak valid';
        
        if (!formData.nip) newErrors.nip = 'NIP wajib diisi';
        else if (isNaN(Number(formData.nip))) newErrors.nip = 'NIP harus berupa angka';

        if (!initialData && !formData.password) {
            newErrors.password = 'Password wajib diisi untuk user baru';
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
        if (pendingData) {
            onSubmit(pendingData);
            setPendingData(null);
        }
        setIsConfirmOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validate()) {
            const dataToSubmit: any = {
                name: formData.name,
                email: formData.email,
                nip: Number(formData.nip),
                role: formData.role,
                password: formData.password
            };
            
            // Konfirmasi modal jika password berubah
            if (initialData && formData.password !== initialData.password) {
                setPendingData(dataToSubmit);
                setIsConfirmOpen(true);
            } else {
                onSubmit(dataToSubmit);
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nama Lengkap"
                            placeholder="Contoh: John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={errors.name}
                        />
                        <Input
                            label="NIP / ID Pegawai"
                            placeholder="Contoh: 123456"
                            value={formData.nip}
                            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                            error={errors.nip}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Contoh: user@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={errors.email}
                        />
                        <Select
                            label="Role / Peran"
                            options={ROLES}
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            error={errors.role}
                        />
                    </div>

                    <hr className="border-slate-border my-2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={initialData ? "Sandi Akun" : "Password"}
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={errors.password}
                        />
                        <Input
                            label="Konfirmasi Password"
                            type="password"
                            placeholder="Konfirmasi"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            error={errors.confirmPassword}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-border">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        <X className="w-4 h-4" />
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="min-w-[120px]"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Menyimpan...' : 'Simpan User'}
                    </Button>
                </div>
            </form>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirm}
                title="Perbarui Kata Sandi?"
                message="Apakah Anda yakin ingin memperbarui kata sandi?"
                confirmLabel="Ya, Perbarui"
                variant="warning"
            />
        </>
    );
}
