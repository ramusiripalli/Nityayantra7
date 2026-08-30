import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Layout & Pages
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import CollectionPage from './pages/CollectionPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SmartCategoryOrCollectionRouter from './pages/SmartCategoryOrCollectionRouter';
import NotFoundPage from './pages/NotFoundPage';
import InfoPage from './pages/info/InfoPage';

// Admin Auth & Pages
import AdminLogin from './admin/pages/AdminLogin';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/AdminProducts';
import AdminProductForm from './admin/pages/AdminProductForm';
import AdminCategories from './admin/pages/AdminCategories';
import AdminCollections from './admin/pages/AdminCollections';
import AdminCollectionForm from './admin/pages/AdminCollectionForm';
import AdminPlaceholder from './admin/pages/AdminPlaceholder';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="collection/:slug" element={<CollectionPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          
          {/* Informational & Legal Pages */}
          <Route path="about" element={<InfoPage pageKey="about" />} />
          <Route path="affiliate-disclosure" element={<InfoPage pageKey="affiliate-disclosure" />} />
          <Route path="privacy-policy" element={<InfoPage pageKey="privacy-policy" />} />
          <Route path="terms" element={<InfoPage pageKey="terms" />} />
          <Route path="contact" element={<InfoPage pageKey="contact" />} />

          {/* Redirect any legacy product detail links directly to products catalog */}
          <Route path="product/:id" element={<Navigate to="/products" replace />} />
          <Route path="products/:id" element={<Navigate to="/products" replace />} />

          {/* Clean Subcategory / Collection Route: /kitchen/air-fryers */}
          <Route path=":categorySlug/:collectionSlug" element={<CollectionPage />} />

          {/* Top-level direct category or collection landing page (e.g. /kitchen or /air-fryers) */}
          <Route path=":slug" element={<SmartCategoryOrCollectionRouter />} />

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
            <Route path="collections" element={<AdminCollections />} />
            <Route path="collections/new" element={<AdminCollectionForm />} />
            <Route path="collections/:id/edit" element={<AdminCollectionForm />} />
            <Route path="settings" element={<AdminPlaceholder />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
