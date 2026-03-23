import Axios, { type AxiosError } from 'axios';

/**
 * Axios Instance — konfigurasi HTTP client global.
 * 
 * - withCredentials: true agar cookie session Laravel terkirim otomatis
 * - X-Requested-With: header wajib untuk Laravel agar mengenali AJAX request
 *
 * Error Interceptor:
 * - 401 → redirect ke halaman login
 * - 403 → tampilkan pesan akses ditolak
 * - 422 → validation error dari Laravel, lempar sebagai error biasa (tangani di form)
 * - 500 → server error generik
 */

const apiClient = Axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// --- Response Interceptor ---
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
            // Session expired atau belum login - redirect ke halaman login
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (status === 403) {
            console.warn('[API] Akses ditolak (403):', message);
            return Promise.reject(new Error(message ?? 'Anda tidak memiliki izin untuk melakukan tindakan ini.'));
        }

        if (status === 422) {
            // Validation error dari Laravel - format: { errors: { field: ['pesan'] } }
            const errors = error.response?.data?.errors;
            const firstError = errors ? Object.values(errors)[0]?.[0] : message;
            return Promise.reject(new Error(firstError ?? 'Data yang dikirim tidak valid.'));
        }

        if (status === 500) {
            return Promise.reject(new Error('Terjadi kesalahan pada server. Silakan coba lagi.'));
        }

        // Error lainnya (network, timeout, dll)
        return Promise.reject(error);
    }
);

export default apiClient;
