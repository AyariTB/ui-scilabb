import { StickyNote, Edit2, Trash2, Clock, User, Plus } from 'lucide-react';
import { Booking } from '@/types/booking.types';
import { formatDateTime } from '../utils';

interface InternalNotesCardProps {
    booking: Booking;
    onAddNote: () => void;
    onEditNote: (id: string) => void;
    onDeleteNote: (id: string) => void;
}

export function InternalNotesCard({ booking, onAddNote, onEditNote, onDeleteNote }: InternalNotesCardProps) {
    return (
        <div className="rounded-xl border border-slate-border bg-white overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-border px-5 py-3.5 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-white border border-slate-border text-navy">
                        <StickyNote size={15} />
                    </span>
                    <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">Catatan Internal</h2>
                </div>
                <button
                    onClick={onAddNote}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-navy-light transition-all active:scale-95"
                >
                    <Plus size={12} /> Tambah Catatan
                </button>
            </div>
            
            <div className="p-6">
                {booking.internal_notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl animate-in fade-in zoom-in-95 duration-500">
                        <div className="p-3 rounded-full bg-slate-100 text-slate-400 mb-2">
                           <StickyNote size={24} />
                        </div>
                        <p className="text-sm font-semibold text-slate-500">Belum ada catatan internal.</p>
                        <p className="text-xs text-slate-500/80 font-medium text-center max-w-[200px] mt-1">Gunakan catatan ini untuk komunikasi koordinasi antar petugas.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {booking.internal_notes.map((note) => (
                            <div key={note.id} className="group relative rounded-2xl bg-white border border-slate-border/80 p-5 hover:border-navy/20 transition-all duration-300 animate-in slide-in-from-top-4">
                                <div className="flex items-start justify-between mb-3 border-b border-slate-50 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-navy leading-none mb-0.5 tracking-tight">{note.author}</p>
                                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                                <Clock size={10} className="mt-[-1px]" /> {formatDateTime(note.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                        <button
                                            onClick={() => onEditNote(note.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100"
                                            title="Ubah Catatan"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteNote(note.id)}
                                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                                            title="Hapus Catatan"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">
                                    {note.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
