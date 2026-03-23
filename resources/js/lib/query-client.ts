import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient — konfigurasi global untuk React Query.
 *
 * Konfigurasi ini mengatur:
 * - staleTime: data dianggap "segar" selama 30 detik, tidak akan refetch otomatis
 * - retry: coba ulang request yang gagal sebanyak 1x (default 3x terlalu agresif untuk UI)
 * - refetchOnWindowFocus: nonaktifkan refetch saat window kembali fokus (UX lebih tenang)
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 30,     // 30 detik
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0, // Jangan ulangi mutasi (POST/PUT/DELETE) yang gagal secara otomatis
        },
    },
});

export default queryClient;
