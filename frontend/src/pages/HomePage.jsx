import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { 
  ChefHat, 
  Utensils, 
  Tag, 
  Zap, 
  Home as HomeIcon, 
  Sparkles, 
  Smartphone, 
  Gamepad2, 
  ShoppingBag, 
  Flame, 
  ArrowRight,
  Package
} from 'lucide-react';

// Icon Map for Category Visual Headers
const ICON_MAP = {
  ChefHat,
  Utensils,
  Tag,
  Zap,
  Home: HomeIcon,
  Sparkles,
  Smartphone,
  Gamepad2,
  ShoppingBag,
  Flame,
};

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomePageData() {
      setLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts()
        ]);

        const activeCats = Array.isArray(catData) ? catData : (catData?.data || []);
        const allProds = Array.isArray(prodData) ? prodData : (prodData?.products || prodData?.data || []);

        // Filter only Published and Active products
        const publishedProds = allProds.filter(
          (p) => (p.isPublished !== false) && (p.isActive !== false)
        );

        setCategories(activeCats);
        setProducts(publishedProds);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomePageData();
  }, []);

  // Helper: Get Icon component
  const getCategoryIcon = (iconName) => {
    const IconComp = ICON_MAP[iconName] || Tag;
    return <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 shrink-0" />;
  };

  // Group published products by Category
  const categoryGroups = categories.map((cat) => {
    const catIdStr = String(cat._id || cat.id || '').toLowerCase();
    const catNameStr = String(cat.name || '').toLowerCase();
    const catSlugStr = String(cat.slug || '').toLowerCase();

    const categoryProducts = products.filter((p) => {
      if (!p.category) return false;
      if (typeof p.category === 'object') {
        const pCatId = String(p.category._id || p.category.id || '').toLowerCase();
        const pCatName = String(p.category.name || '').toLowerCase();
        const pCatSlug = String(p.category.slug || '').toLowerCase();
        return pCatId === catIdStr || pCatName === catNameStr || pCatSlug === catSlugStr;
      }
      const pCatStr = String(p.category).toLowerCase();
      return pCatStr === catIdStr || pCatStr === catNameStr || pCatStr === catSlugStr;
    });

    return {
      category: cat,
      products: categoryProducts
    };
  }).filter((group) => group.products.length > 0); // Hide empty categories!

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      <PageContainer className="space-y-8 sm:space-y-10 pt-2">
        
        {loading ? (
          // Skeleton Loading State
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="h-6 w-40 bg-slate-200 rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-72 w-full bg-slate-200 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : categoryGroups.length === 0 ? (
          // No Published Products State
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">No products available yet.</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Products published in the Admin CMS will appear here automatically.
            </p>
          </div>
        ) : (
          // Category Sections (Only categories with products)
          categoryGroups.map(({ category, products: catProds }) => {
            const catSlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <section key={category._id || category.id || catSlug} className="space-y-4 sm:space-y-5">
                
                {/* Category Header Row */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.icon)}
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      {category.name}
                    </h2>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {catProds.length}
                    </span>
                  </div>

                  <Link
                    to={`/category/${catSlug}`}
                    className="group inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    <span>See All</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Responsive Grid: 1 product per row on mobile, 2 on tablet, 3-4 cards on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full items-stretch">
                  {catProds.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>

              </section>
            );
          })
        )}

      </PageContainer>
    </div>
  );
};

export default HomePage;
