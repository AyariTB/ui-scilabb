export interface VesselEquipment {
    id: string;
    name: string;
    description: string;
    condition: 'Baik' | 'Rusak Ringan' | 'Perbaikan' | 'Rusak Berat';
    thumbnailUrl?: string | null;
    lastUpdated: string;
}

export interface VesselImage {
    id: number;
    url: string;
    alt: string;
}

export interface VesselData {
    name: string;
    description: string;
    price_per_hour: number;
    price_description: string;
    content_html: string;
    images: VesselImage[];
}
