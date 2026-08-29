import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Layout & Pages
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Auth & Pages
import AdminLogin from './admin/pages/AdminLogin';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/AdminProducts';
import AdminProductForm from './admin/pages/AdminProductForm';
import AdminCategories from './admin/pages/AdminCategories';
import AdminPlaceholder from './admin/pages/AdminPlaceholder';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ADMIN AUTHENTICATION ROUTE */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN PANEL ROUTES */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="settings" element={<AdminPlaceholder />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
