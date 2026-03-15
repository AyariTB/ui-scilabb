import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminDashboard from './pages/admin/Dashboard';
import './app.css';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <AdminDashboard />
        </React.StrictMode>
    );
}
