import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ArticleList from './pages/admin/articles/ArticleList';
import ArticleAdd from './pages/admin/articles/ArticleAdd';
import ArticleEdit from './pages/admin/articles/ArticleEdit';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import GuideManagement from './pages/manager/vessel/Guide';

import './app.css';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    {/* Default redirect to Admin Dashboard */}
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/articles" element={<ArticleList />} />
                    <Route path="/admin/articles/create" element={<ArticleAdd />} />
                    <Route path="/admin/articles/edit/:id" element={<ArticleEdit />} />
                    
                    {/* Manager Routes */}
                    <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                    <Route path="/manager/explorer-1/guides" element={<GuideManagement />} />
                    
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
        </React.StrictMode>
    );
}
