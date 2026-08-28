import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { CATEGORIES } from '../data/categories';
import { ChevronRight, FolderX, ArrowRight } from 'lucide-react';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if category exists in central categories metadata
  const categoryMeta = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === slug?.toLowerCase()
  );

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!categoryMeta) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await productService.getProducts({ category: slug });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
  }, [slug, categoryMeta]);

  // 10. CATEGORY NOT FOUND STATE
  if (!categoryMeta) {
    return (
      <PageContainer>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 capitalize">{slug}</span>
        </nav>

        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 my-6">
          <div className="p-4 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            <FolderX className="w-12 h-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Category Not Found</h1>
          <p className="text-sm text-slate-500 max-w-md">
            Sorry, the category <strong className="text-slate-800">"{slug}"</strong> does not exist or has been removed. Explore our full catalog of smart products below.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 overflow-x-auto">
        <Link to="/" className="hover:text-sky-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-sky-600">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold capitalize">{categoryMeta.name}</span>
      </nav>

      {/* Category Section Header */}
      <SectionHeader
        badge="Category Discovery"
        title={`${categoryMeta.name} Products`}
        subtitle={`Discover useful ${categoryMeta.name.toLowerCase()} gadgets, compare marketplace prices & video reviews.`}
      />

      {/* Product Grid */}
      <ProductGrid 
        products={products} 
        isLoading={loading} 
        emptyMessage={`No products currently listed under "${categoryMeta.name}".`}
      />
    </PageContainer>
  );
};

export default CategoryPage;
