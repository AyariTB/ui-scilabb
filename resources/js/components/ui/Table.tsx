import type { ReactNode } from 'react';

/**
 * Definisi satu kolom dalam tabel.
 * Generic <T> memastikan type-safety antara `key` dan `data` yang masuk.
 */
export interface TableColumn<T> {
    /** Judul yang ditampilkan di header tabel */
    header: string;
    /** Kelas CSS tambahan untuk kolom ini (opsional) */
    className?: string;
    /**
     * Render custom untuk cell.
     * Jika tidak disediakan, kolom harus diisi lewat `key`.
     * Menggunakan render function agar bisa menampilkan JSX apapun.
     */
    render: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
    /** Definisi kolom-kolom tabel */
    columns: TableColumn<T>[];
    /** Array data yang akan ditampilkan */
    data: T[];
    /** Pesan yang ditampilkan saat data kosong */
    emptyMessage?: string;
    /** Kelas CSS tambahan untuk wrapper container (opsional) */
    className?: string;
}

/**
 * Komponen tabel
 * @example
 * <DataTable
 *   columns={[
 *     { header: 'Nama', render: (row) => row.name },
 *     { header: 'Aksi', render: (row) => <button>Edit</button> },
 *   ]}
 *   data={myData}
 *   emptyMessage="Tidak ada data."
 * />
 */
export function DataTable<T>({
    columns,
    data,
    emptyMessage = 'Tidak ada data yang ditemukan.',
    className = '',
}: DataTableProps<T>) {
    return (
        <div className={`bg-white rounded-xl border border-slate-border overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-soft-white border-b border-slate-border text-slate-muted">
                        <tr>
                            {columns.map((col, colIndex) => (
                                <th
                                    key={colIndex}
                                    className={`px-6 py-4 font-medium ${col.className ?? ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-border">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-10 text-center text-slate-muted"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="hover:bg-hover-bg transition-colors"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`px-6 py-4 ${col.className ?? ''}`}
                                        >
                                            {col.render(row, rowIndex)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
