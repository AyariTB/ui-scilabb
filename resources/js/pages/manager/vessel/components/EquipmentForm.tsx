import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Camera } from 'lucide-react';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { VesselEquipment } from '../../../../types/vessel.types';

interface EquipmentFormProps {
    initialData?: VesselEquipment | null;
    onSubmit: (data: Partial<VesselEquipment>) => void;
    onCancel: () => void;
    loading?: boolean;
}

const CONDITION_OPTIONS = ['Baik', 'Rusak Ringan', 'Perbaikan', 'Rusak Berat'];

export default function EquipmentForm({ initialData, onSubmit, onCancel, loading = false }: EquipmentFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        condition: 'Baik' as VesselEquipment['condition'],
        thumbnailUrl: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Tambahkan useRef untuk input file
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                condition: initialData.condition,
                thumbnailUrl: initialData.thumbnailUrl || '',
            });
        }
    }, [initialData]);

    // Fungsi Handle Upload & Validasi 5MB
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran 55mb
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 5) {
            setErrors(prev => ({ ...prev, image: 'Ukuran gambar maksimal 5MB' }));
            return;
        }

        // Hapus error jika validasi lolos
        setErrors(prev => {
            const newErrs = { ...prev };
            delete newErrs.image;
            return newErrs;
        });

        // Preview gambar menggunakan FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, thumbnailUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Nama alat wajib diisi';
        if (!formData.description.trim()) newErrors.description = 'Deskripsi alat wajib diisi';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {/* Input File Tersembunyi */}
                <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                {/* Foto Preview & Input */}
                <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                    flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer group
                    min-h-[240px] /* Mengunci tinggi minimal area dropzone */
                    ${errors.image ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}
                `}
                >
                {formData.thumbnailUrl ? (
                    <div className="relative w-full h-52 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                    {/* h-48: Mengunci tinggi gambar (192px). 
                        object-cover: Memastikan gambar memenuhi area tanpa distorsi (terpotong rapi). 
                    */}
                    <img 
                        src={formData.thumbnailUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    
                    {/* Overlay saat hover */}
                    <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera className="text-white w-8 h-8 mb-1" />
                        <span className="text-white text-[10px] font-medium">Ubah Foto</span>
                    </div>
                    </div>
                ) : (
                    <div className="text-center space-y-3 py-4">
                    <div className="mx-auto w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                        <Camera className="text-slate-400 w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-600 font-semibold mb-1">Klik untuk unggah foto alat</div>
                        <p className="text-[10px] text-slate-400">Format: JPG, PNG • Maksimal 5MB</p>
                    </div>
                    </div>
                )}
                </div>

                {errors.image && (
                <p className="mt-2 text-xs text-red-500 text-center font-medium animate-pulse">
                    {errors.image}
                </p>
                )}

                <Input
                    label="Nama Alat / Inventaris"
                    placeholder="Contoh: CTD SBE911+"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                />

                <Select
                    label="Kondisi Saat Ini"
                    options={CONDITION_OPTIONS}
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                    error={errors.condition}
                />

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Deskripsi Alat</label>
                    <textarea
                        className={`w-full px-4 py-2 bg-white border rounded-lg text-sm outline-none transition-all min-h-[100px] resize-none
                            ${errors.description ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-border focus:border-navy focus:ring-1 focus:ring-navy'}
                        `}
                        placeholder="Jelaskan spesifikasi atau fungsi alat ini..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description}</p>}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-border">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                    <X className="w-4 h-4" /> Batal
                </Button>
                <Button type="submit" variant="primary" disabled={loading} className="min-w-[120px]">
                    <Save className="w-4 h-4" />
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
            </div>
        </form>
    );
}