import { VesselEquipment, VesselData } from '../types/vessel.types';

export const MOCK_EQUIPMENT: VesselEquipment[] = [
    {
        id: 'eq-1',
        name: 'CTD SBE911+',
        condition: 'Baik',
        description: 'Instrumen pengukur conductivity, temperature, depth hingga 6800m.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1582921017967-79d1cb6702ee?w=100',
        lastUpdated: '18 Mar 2026',
    },
    {
        id: 'eq-2',
        name: 'ADCP 150kHz',
        condition: 'Rusak Ringan',
        description: 'Acoustic Doppler Current Profiler untuk arus laut.',
        lastUpdated: '15 Mar 2026',
    },
];

export const MOCK_VESSEL_EXPLORER_1: VesselData = {
    name: 'KR Unhas Explorer 1',
    description: 'Kapal Riset Oseanografi utama untuk wilayah perairan Makassar.',
    price_per_hour: 5000000,
    price_description: 'Harga sudah termasuk kru kapal (ABK), asuransi dasar, dan penggunaan laboratorium onboard. Belum termasuk biaya BBM dan logistik konsumsi.',
    content_html: '<h2>Spesifikasi Teknis</h2><ul><li>Panjang: 25m</li><li>Mesin: Dual Marine Diesel</li></ul>',
    images: [
        { id: 1, url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800', alt: 'Main View' },
        { id: 2, url: 'https://images.unsplash.com/photo-1582921017967-79d1cb6702ee?w=800', alt: 'Deck View' }
    ]
};

export const MOCK_VESSEL_EXPLORER_2: VesselData = {
    name: 'KR Unhas Explorer 2',
    description: 'Kapal Riset Oseanografi kedua untuk wilayah perairan bagian timur.',
    price_per_hour: 4500000,
    price_description: 'Harga sudah termasuk kru kapal (ABK), asuransi dasar, dan penggunaan laboratorium onboard. Belum termasuk biaya BBM dan logistik konsumsi.',
    content_html: '<h2>Spesifikasi Teknis</h2><ul><li>Panjang: 30m</li><li>Mesin: Triple Marine Diesel</li></ul>',
    images: [
        { id: 1, url: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800', alt: 'Main View' },
        { id: 2, url: 'https://images.unsplash.com/photo-1582921017967-79d1cb6702ee?w=800', alt: 'Deck View' }
    ]
};
