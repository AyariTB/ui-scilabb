/**
 * MANAGER BOOKING LIST - Halaman utama bagi manager untuk melihat daftar pesanan kapal.
 * 
 * Menggunakan komponen reusable BookingListView untuk konsistensi.
 */

import ManagerLayout from '@/components/layout/ManagerLayout';
import { BookingListView } from '@/components/booking';
import { useBookings } from '@/hooks/useBooking';

export default function BookingList() {
    // --- Data Fetching (React Query) ---
    const { data: bookings = [], isLoading } = useBookings();

    return (
        <ManagerLayout>
            <BookingListView
                title="Manajemen Pesanan Kapal"
                subtitle="Pantau dan kelola jadwal peminjaman KR Unhas Explorer-1 untuk kelancaran operasional riset."
                exportTitle="Daftar Pesanan Kapal KR Unhas Explorer-1"
                exportFileName="pesanan_kapal_explorer1"
                detailBaseUrl="/manager/orders"
                bookings={bookings}
                isLoading={isLoading}
            />
        </ManagerLayout>
    );
}
