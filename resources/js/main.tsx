import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/query-client';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/users/UserList';
import ArticleList from './pages/admin/articles/ArticleList';
import ArticleAdd from './pages/admin/articles/ArticleAdd';
import ArticleEdit from './pages/admin/articles/ArticleEdit';
import OrderList from './pages/admin/orders/OrderList';
import OrderDetail from './pages/admin/orders/OrderDetail';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import VesselInfo from './pages/manager/vessel/VesselInfo';
import VesselEquipment from './pages/manager/vessel/VesselEquipment';
import VesselFacilities from './pages/manager/vessel/VesselFacilities';
import VesselGuides from './pages/manager/vessel/VesselGuides';
import BookingList from './pages/manager/bookings/BookingList';
import BookingDetail from './pages/manager/bookings/BookingDetail';

import './app.css';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                <Routes>
                    {/* Default redirect to Admin Dashboard */}
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserList />} />
                    <Route path="/admin/articles" element={<ArticleList />} />
                    <Route path="/admin/articles/create" element={<ArticleAdd />} />
                    <Route path="/admin/articles/edit/:id" element={<ArticleEdit />} />
                    <Route path="/admin/orders" element={<OrderList />} />
                    <Route path="/admin/orders/:id" element={<OrderDetail />} />
                    
                    {/* Manager Routes */}
                    <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                    <Route path="/manager/orders" element={<BookingList />} />
                    <Route path="/manager/orders/:id" element={<BookingDetail />} />
                    
                    {/* Unified Vessel Routes with Slug */}
                    <Route path="/manager/:slug/general" element={<VesselInfo />} />
                    <Route path="/manager/:slug/tools" element={<VesselEquipment />} />
                    <Route path="/manager/:slug/facilities" element={<VesselFacilities />} />
                    <Route path="/manager/:slug/guides" element={<VesselGuides />} />
                    
                    {/* 404 Fallback */}
                    <Route path="*" element={
                        <div className="flex h-screen items-center justify-center bg-slate-50">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-navy mb-2">404</h1>
                                <p className="text-slate-muted">Halaman tidak ditemukan.</p>
                            </div>
                        </div>
                    } />
                </Routes>
            </BrowserRouter>
            </QueryClientProvider>
        </React.StrictMode>
    );
}
