/**
 * MOCK DATA PENYEDIA LAYANAN
 * Saat integrasi backend: ganti dengan data dari GET /api/providers
 */

export type ProviderCategory = 'LAB' | 'KAPAL' | 'SAS';

export interface ServiceItem {
    id: string;
    name: string;
    /** Harga satuan per unit layanan (bukan per hari) */
    price_per_unit: number;
    /** Satuan ukuran, cth: "Sampel", "Hari", "Unit" */
    unit: string;
}

export interface Provider {
    id: string;
    name: string;
    category: ProviderCategory;
    description?: string;
    services: ServiceItem[];
}

export const MOCK_PROVIDERS: Provider[] = [
    // ==== KAPAL RISET ====
    {
        id: 'prov-kapal-01',
        name: 'KR Unhas Explorer-1',
        category: 'KAPAL',
        description: 'Kapal riset utama untuk ekspedisi laut dalam dan survei oseanografi.',
        services: [
            { id: 'svc-kapal-01', name: 'Sewa Kapal (per hari)', price_per_unit: 5_000_000, unit: 'Hari' },
        ],
    },

    // === LABORATORIUM ===
    {
        id: 'prov-lab-01',
        name: 'Lab Kimia Terpadu',
        category: 'LAB',
        description: 'Laboratorium kimia analitik dan sintesis untuk kebutuhan riset dan pengujian.',
        services: [
            { id: 'svc-kimia-01', name: 'Analisis Spektrometri (AAS)', price_per_unit: 150_000, unit: 'Sampel' },
            { id: 'svc-kimia-02', name: 'Uji Kadar Air & Kelembaban', price_per_unit: 75_000, unit: 'Sampel' },
            { id: 'svc-kimia-03', name: 'Analisis HPLC', price_per_unit: 300_000, unit: 'Sampel' },
            { id: 'svc-kimia-04', name: 'Uji Kualitas Air (parameter lengkap)', price_per_unit: 400_000, unit: 'Sampel' },
        ],
    },
    {
        id: 'prov-lab-02',
        name: 'Lab Material & Metalurgi',
        category: 'LAB',
        description: 'Pengujian sifat mekanik dan struktur material logam dan komposit.',
        services: [
            { id: 'svc-mat-01', name: 'Uji Tarik (Tensile Test)', price_per_unit: 300_000, unit: 'Sampel' },
            { id: 'svc-mat-02', name: 'Uji Kekerasan (Hardness Test)', price_per_unit: 200_000, unit: 'Sampel' },
            { id: 'svc-mat-03', name: 'Uji Impak (Impact Test)', price_per_unit: 250_000, unit: 'Sampel' },
            { id: 'svc-mat-04', name: 'Analisis Mikrostruktur (Metallography)', price_per_unit: 500_000, unit: 'Sampel' },
            { id: 'svc-mat-05', name: 'Analisis SEM-EDX', price_per_unit: 1_500_000, unit: 'Sampel' },
        ],
    },
    {
        id: 'prov-lab-03',
        name: 'Lab Biologi Kelautan',
        category: 'LAB',
        description: 'Analisis ekologi laut, plankton, benthos, dan identifikasi spesies.',
        services: [
            { id: 'svc-bio-01', name: 'Identifikasi & Pencacahan Plankton', price_per_unit: 350_000, unit: 'Sampel' },
            { id: 'svc-bio-02', name: 'Analisis Klorofil-a', price_per_unit: 200_000, unit: 'Sampel' },
            { id: 'svc-bio-03', name: 'Uji Bioassay Toksisitas', price_per_unit: 600_000, unit: 'Sampel' },
        ],
    },

    // === LAYANAN MANDIRI (SAS) ====
    {
        id: 'prov-sas-01',
        name: 'Unit Layanan Mandiri - Bengkel Riset',
        category: 'SAS',
        description: 'Ruang dan peralatan untuk pembuatan prototipe dan penelitian mandiri berbasis proyek.',
        services: [
            { id: 'svc-sas-01', name: 'Sewa Ruang Bengkel (per hari)', price_per_unit: 500_000, unit: 'Hari' },
            { id: 'svc-sas-02', name: 'Sewa Mesin CNC (per jam)', price_per_unit: 200_000, unit: 'Jam' },
            { id: 'svc-sas-03', name: 'Sewa 3D Printer (per jam)', price_per_unit: 100_000, unit: 'Jam' },
        ],
    },
    {
        id: 'prov-sas-02',
        name: 'Unit SAS - Pengolahan Data & GIS',
        category: 'SAS',
        description: 'Layanan pengolahan dan analisis data spasial, remote sensing, dan pemodelan.',
        services: [
            { id: 'svc-gis-01', name: 'Pengolahan Citra Satelit (per scene)', price_per_unit: 1_500_000, unit: 'Scene' },
            { id: 'svc-gis-02', name: 'Pemodelan Hidrodinamika (per skenario)', price_per_unit: 2_000_000, unit: 'Skenario' },
            { id: 'svc-gis-03', name: 'Konsultasi GIS (per sesi)', price_per_unit: 500_000, unit: 'Sesi' },
        ],
    },
];
