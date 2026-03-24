import ManagerLayout from '../../../components/layout/ManagerLayout';
import AdminLayout from '../../../components/layout/AdminLayout';

import { useParams, useLocation } from 'react-router-dom';

export default function VesselFacilities() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const Layout = location.pathname.startsWith('/admin') ? AdminLayout : ManagerLayout;
    const vesselName = slug === 'explorer-2' ? 'KR Unhas Explorer 2' : 'KR Unhas Explorer 1';

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Fasilitas Kapal</h1>
                    <p className="text-sm text-slate-muted mt-1">
                        Kelola data fasilitas untuk {vesselName}
                    </p>
                </div>
                
                <div className="bg-white p-12 rounded-xl border border-slate-border flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🏗️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-navy">Data Fasilitas Belum Tersedia</h3>
                    <p className="text-slate-500 max-w-sm mt-2">
                        Modul pengelolaan fasilitas untuk {vesselName} sedang dalam tahap pengembangan.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
