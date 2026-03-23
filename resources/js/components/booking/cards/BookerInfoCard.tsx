import { User, Building2, Mail, Phone, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { Booking } from '@/types/booking.types';

interface BookerInfoCardProps {
    booking: Booking;
}

function CopyButton({ text, label }: { text: string; label: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button 
            onClick={handleCopy} 
            title={`Salin ${label}`} 
            className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded border border-slate-border bg-white text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all active:scale-95"
        >
            {copied ? <CheckCheck size={11} className="text-emerald-500" /> : <Copy size={11} />}
        </button>
    );
}

export function BookerInfoCard({ booking }: BookerInfoCardProps) {
    return (
        <div className="rounded-xl border border-slate-border bg-white overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-slate-border px-5 py-3.5 bg-slate-50/50">
                <span className="p-1.5 rounded-lg bg-white border border-slate-border text-navy">
                    <User size={15} />
                </span>
                <h2 className="text-sm font-semibold text-navy uppercase">Informasi Peminjam</h2>
            </div>
            
            <div className="p-6">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="space-y-5">
                        <div className="group/item">
                            <p className="text-xs uppercase text-slate-600 font-bold mb-1.5 leading-none">Nama Lengkap</p>
                            <p className="text-sm text-navy">{booking.booker.name}</p>
                        </div>
                        <div className="group/item">
                            <p className="text-xs uppercase text-slate-600 font-bold mb-1.5 leading-none">Instansi / Unit Kerja</p>
                            <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 p-1 rounded-md bg-slate-100 text-slate-600">
                                    <Building2 size={14} />
                                </div>
                                <p className="text-sm text-navy leading-tight pt-0.5">
                                    {booking.booker.institution}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-5">
                        <div className="group/item">
                            <p className="text-xs uppercase text-slate-600 font-bold mb-1.5 leading-none">Alamat Email</p>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1 rounded-md bg-slate-100 text-slate-600">
                                    <Mail size={14} />
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm text-navy truncate max-w-[180px] sm:max-w-none">{booking.booker.email}</span>
                                    <CopyButton text={booking.booker.email} label="email" />
                                </div>
                            </div>
                        </div>
                        <div className="group/item">
                            <p className="text-xs uppercase text-slate-600 font-bold mb-1.5 leading-none">Kontak Ponsel / WhatsApp</p>
                            <div className="flex items-center gap-2.5">
                                <div className="p-1 rounded-md bg-slate-100 text-slate-600">
                                    <Phone size={14} />
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm text-navy">{booking.booker.phone}</span>
                                    <CopyButton text={booking.booker.phone} label="nomor HP" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
