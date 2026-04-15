import React, { useMemo } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { dummyData } from '../data';
import { 
  Filter, ChevronRight, RefreshCw, ShoppingBag, Tag, Cpu, 
  Layers, Sparkles, ArrowRight, Zap, Star, Heart,
  Laptop, Smartphone, Shirt, Footprints
} from 'lucide-react';

/**
 * Loader Function: Berjalan SEBELUM komponen dirender.
 * Berfungsi untuk mengambil parameter dari URL dan memfilter data dummy
 * sesuai dengan pilihan Category, Sub-Category, dan Brand.
 */
export function loader({ request }) {
  const url = new URL(request.url);
  // Mengambil ID dari URL search parameters (?category=...&subcategory=...)
  const categoryId = url.searchParams.get('category') || '';
  const subCategoryId = url.searchParams.get('subcategory') || '';
  const brandId = url.searchParams.get('brand') || '';

  const categories = dummyData.categories;
  
  // Logika Cascading 1: Ambil Sub-Category berdasarkan Category yang dipilih
  let subCategories = [];
  if (categoryId) {
    subCategories = dummyData.subCategories.filter(s => s.categoryId === categoryId);
  }

  // Logika Cascading 2: Ambil Brand berdasarkan Sub-Category yang dipilih
  let brands = [];
  if (subCategoryId) {
    brands = dummyData.brands.filter(b => b.subCategoryId === subCategoryId);
  }

  // Logika Filtering Produk:
  let products = dummyData.products;
  if (brandId) {
    // Jika Brand dipilih, tampilkan produk dari brand tersebut saja
    products = products.filter(p => p.brandId === brandId);
  } else if (subCategoryId) {
    // Jika baru Sub-Category yang dipilih, tampilkan semua produk dari semua brand di sub-kategori ini
    const brandIds = dummyData.brands.filter(b => b.subCategoryId === subCategoryId).map(b => b.id);
    products = products.filter(p => brandIds.includes(p.brandId));
  } else if (categoryId) {
    // Jika baru Category yang dipilih, tampilkan semua produk dari semua sub-kategori di kategori ini
    const subCatIds = dummyData.subCategories.filter(s => s.categoryId === categoryId).map(s => s.id);
    const brandIds = dummyData.brands.filter(b => subCatIds.includes(b.subCategoryId)).map(b => b.id);
    products = products.filter(p => brandIds.includes(p.brandId));
  }

  // Mengembalikan data hasil filter ke komponen
  return { 
    categories, 
    subCategories, 
    brands, 
    products, 
    selections: { categoryId, subCategoryId, brandId } 
  };
}

// Gradient palettes for product cards — lighter, more vibrant for light theme
const cardGradients = [
  'from-violet-200/60 via-purple-100/40 to-indigo-100/30',
  'from-cyan-200/60 via-teal-100/40 to-emerald-100/30',
  'from-pink-200/60 via-rose-100/40 to-red-100/30',
  'from-amber-200/60 via-orange-100/40 to-yellow-100/30',
  'from-fuchsia-200/60 via-violet-100/40 to-purple-100/30',
  'from-emerald-200/60 via-green-100/40 to-lime-100/30',
  'from-blue-200/60 via-indigo-100/40 to-violet-100/30',
  'from-rose-200/60 via-pink-100/40 to-fuchsia-100/30',
];

const iconColors = [
  'text-violet-500',
  'text-cyan-600',
  'text-pink-500',
  'text-amber-600',
  'text-fuchsia-500',
  'text-emerald-600',
  'text-blue-500',
  'text-rose-500',
];

function getProductIcon(name) {
  const lower = name.toLowerCase();
  if (lower.includes('macbook') || lower.includes('rog') || lower.includes('laptop')) return Laptop;
  if (lower.includes('galaxy') || lower.includes('xiaomi') || lower.includes('phone')) return Smartphone;
  if (lower.includes('shirt') || lower.includes('flannel') || lower.includes('t-shirt')) return Shirt;
  if (lower.includes('air force') || lower.includes('ultraboost') || lower.includes('nike') || lower.includes('adidas')) return Footprints;
  return Tag;
}

function FilterStep({ number, isActive, isCompleted }) {
  return (
    <div className={`
      flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold
      transition-all duration-300
      ${isCompleted 
        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25' 
        : isActive 
          ? 'bg-accent-500/10 text-accent-600 border border-accent-400/40'
          : 'bg-surface-100 text-surface-400 border border-surface-300'}
    `}>
      {isCompleted ? '✓' : number}
    </div>
  );
}

export default function Catalog() {
  // Mengambil data dari loader (hasil filter)
  const { categories, subCategories, brands, products, selections } = useLoaderData();
  // Hook untuk membaca dan menulis parameter URL
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Handler saat Kategori berubah:
   * Menghapus semua filter lain (Sub-Category & Brand) karena tidak lagi relevan.
   */
  const handleCategoryChange = (e) => {
    const newParams = new URLSearchParams();
    if (e.target.value) {
      newParams.set('category', e.target.value);
    }
    setSearchParams(newParams, { replace: true });
  };

  /**
   * Handler saat Sub-Kategori berubah:
   * Menghapus filter Brand karena brand lama mungkin tidak ada di sub-kategori baru.
   */
  const handleSubCategoryChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('brand'); // Reset brand
    if (e.target.value) {
      newParams.set('subcategory', e.target.value);
    } else {
      newParams.delete('subcategory');
    }
    setSearchParams(newParams, { replace: true });
  };

  /**
   * Handler saat Brand berubah:
   * Hanya mengupdate parameter brand di URL.
   */
  const handleBrandChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('brand', e.target.value);
    } else {
      newParams.delete('brand');
    }
    setSearchParams(newParams, { replace: true });
  };

  /**
   * Mengosongkan semua filter (Kembali ke Default)
   */
  const handleReset = () => {
    setSearchParams({}, { replace: true });
  };

  // Mencari Nama dari ID yang terpilih (untuk tampilan breadcrumb/judul)
  const catName = useMemo(() => categories.find(c => c.id === selections.categoryId)?.name, [categories, selections.categoryId]);
  const subCatName = useMemo(() => subCategories.find(s => s.id === selections.subCategoryId)?.name, [subCategories, selections.subCategoryId]);
  const brandName = useMemo(() => brands.find(b => b.id === selections.brandId)?.name, [brands, selections.brandId]);

  // Cek apakah ada filter yang sedang aktif
  const hasFilters = selections.categoryId || selections.subCategoryId || selections.brandId;

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* ===== ANIMATED BACKGROUND ORBS ===== */}
      <div className="orb w-[600px] h-[600px] bg-violet-400/15 -top-48 -left-48 animate-float" />
      <div className="orb w-[500px] h-[500px] bg-amber-300/10 top-1/3 -right-32 animate-float-delayed" />
      <div className="orb w-[400px] h-[400px] bg-purple-300/10 bottom-0 left-1/4 animate-pulse-slow" />

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-surface-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-slide-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-gold-500 rounded-xl blur-lg opacity-40" />
                <div className="relative bg-gradient-to-br from-accent-500 to-accent-600 text-white p-2.5 rounded-xl shadow-lg shadow-accent-500/20">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-gradient">
                  Premium Catalog
                </h1>
                <p className="text-[10px] font-medium text-surface-400 tracking-widest uppercase hidden sm:block">
                  Curated Collection
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="product-breadcrumb hidden md:flex items-center text-sm font-medium text-surface-400" aria-label="breadcrumb">
              <span className="hover:text-surface-800 transition-colors cursor-pointer">Home</span>
              <ChevronRight className="w-3.5 h-3.5 mx-2 text-surface-300" />
              <span className={!catName ? "text-accent-600 font-semibold" : "hover:text-surface-800 transition-colors cursor-pointer"}>
                {catName || 'All Categories'}
              </span>
              {subCatName && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 mx-2 text-surface-300" />
                  <span className={!brandName ? "text-accent-600 font-semibold" : "hover:text-surface-800 transition-colors cursor-pointer"}>
                    {subCatName}
                  </span>
                </>
              )}
              {brandName && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 mx-2 text-surface-300" />
                  <span className="text-accent-600 font-semibold">{brandName}</span>
                </>
              )}
            </nav>

            {/* Right side indicator */}
            <div className="flex items-center gap-2 md:hidden">
              {hasFilters && (
                <div className="filter-chip">
                  <Filter className="w-3 h-3" />
                  Active
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ===== SIDEBAR / FILTER PANEL ===== */}
          <aside className="lg:col-span-3 animate-slide-in">
            <div className="glass-panel rounded-3xl p-6 sticky top-28 space-y-6">
              
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-accent-500/10 p-2 rounded-xl border border-accent-400/20">
                    <Filter className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-surface-800">Filters</h2>
                    <p className="text-[10px] text-surface-400 font-medium">Narrow results</p>
                  </div>
                </div>
                {hasFilters && (
                  <button 
                    onClick={handleReset}
                    className="text-xs text-surface-400 hover:text-accent-500 transition-colors font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent" />

              {/* Filter Steps with visual flow */}
              <div className="space-y-5">
                {/* Category */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FilterStep number={1} isActive={!selections.categoryId} isCompleted={!!selections.categoryId} />
                    <label htmlFor="category" className="combobox-label mb-0">Category</label>
                  </div>
                  <select
                    id="category"
                    name="category"
                    className="combobox"
                    value={selections.categoryId}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Visual connector line */}
                <div className="flex items-center pl-3">
                  <div className={`w-px h-4 transition-colors duration-300 ${selections.categoryId ? 'bg-accent-400/40' : 'bg-surface-200'}`} />
                </div>

                {/* Sub-Category */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FilterStep number={2} isActive={selections.categoryId && !selections.subCategoryId} isCompleted={!!selections.subCategoryId} />
                    <label htmlFor="subcategory" className="combobox-label mb-0">Sub-Category</label>
                  </div>
                  <select
                    id="subcategory"
                    name="subcategory"
                    className="combobox"
                    value={selections.subCategoryId}
                    onChange={handleSubCategoryChange}
                    disabled={!selections.categoryId}
                  >
                    <option value="">Select Sub-Category...</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                {/* Visual connector line */}
                <div className="flex items-center pl-3">
                  <div className={`w-px h-4 transition-colors duration-300 ${selections.subCategoryId ? 'bg-accent-400/40' : 'bg-surface-200'}`} />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FilterStep number={3} isActive={selections.subCategoryId && !selections.brandId} isCompleted={!!selections.brandId} />
                    <label htmlFor="brand" className="combobox-label mb-0">Brand</label>
                  </div>
                  <select
                    id="brand"
                    name="brand"
                    className="combobox"
                    value={selections.brandId}
                    onChange={handleBrandChange}
                    disabled={!selections.subCategoryId}
                  >
                    <option value="">Select Brand...</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent" />

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary group"
              >
                <RefreshCw className="w-4 h-4 mr-2 text-surface-400 group-hover:text-accent-500 group-hover:rotate-180 transition-all duration-500" />
                Reset Filter
              </button>

              {/* Active Filters Summary */}
              {hasFilters && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-[10px] uppercase tracking-widest text-surface-400 font-bold">Active Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {catName && <span className="filter-chip">{catName}</span>}
                    {subCatName && <span className="filter-chip">{subCatName}</span>}
                    {brandName && <span className="filter-chip">{brandName}</span>}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ===== PRODUCT GRID ===== */}
          <section className="lg:col-span-9">

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 animate-slide-up">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-accent-500">
                    {hasFilters ? 'Filtered Results' : 'Explore'}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-subtle tracking-tight">
                  {brandName || subCatName || catName || 'All Products'}
                </h2>
              </div>
              <div className="glass-panel rounded-2xl px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-surface-700">
                  {products.length}
                </span>
                <span className="text-sm text-surface-400">
                  {products.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
          
            {products.length === 0 ? (
              /* ===== EMPTY STATE ===== */
              <div className="glass-panel rounded-3xl p-16 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent-500/10 rounded-full blur-2xl" />
                  <div className="relative bg-surface-100 p-6 rounded-full border border-surface-200">
                    <ShoppingBag className="w-12 h-12 text-surface-400" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-surface-800 mb-3">No products found</h3>
                <p className="text-surface-400 max-w-sm text-sm leading-relaxed">
                  We couldn't find anything matching your current filters. Try resetting or selecting a different category.
                </p>
                <button 
                  onClick={handleReset} 
                  className="mt-8 btn-primary max-w-xs group"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Clear all filters
                </button>
              </div>
            ) : (
              /* ===== PRODUCT CARDS GRID ===== */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product, index) => {
                  const gradientClass = cardGradients[index % cardGradients.length];
                  const iconColorClass = iconColors[index % iconColors.length];
                  const ProductIcon = getProductIcon(product.name);
                  const brandLabel = brands.find(b => b.id === product.brandId)?.name 
                    || dummyData.brands.find(b => b.id === product.brandId)?.name 
                    || 'Brand';

                  return (
                    <div 
                      key={product.id}
                      className="product-card group animate-slide-up"
                      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-accent-500/0 via-gold-400/0 to-accent-400/0 group-hover:from-accent-500/15 group-hover:via-gold-400/10 group-hover:to-accent-400/15 transition-all duration-700 -z-10 blur-sm" />

                      {/* Card Image Area */}
                      <div className="card-image">
                        <div className={`gradient-bg bg-gradient-to-br ${gradientClass}`} />
                        {/* Mesh pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.04]" 
                          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <div className={`absolute inset-0 ${iconColorClass} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}>
                              <ProductIcon className="w-20 h-20" strokeWidth={1} />
                            </div>
                            <ProductIcon className={`relative w-16 h-16 ${iconColorClass} group-hover:scale-110 transition-all duration-500`} strokeWidth={1.2} />
                          </div>
                        </div>

                        {/* Floating action button */}
                        <button className="absolute top-3 right-3 bg-white/70 backdrop-blur-xl border border-surface-200/60 p-2 rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white shadow-lg">
                          <Heart className="w-4 h-4 text-surface-400 hover:text-rose-500 transition-colors" />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="card-body">
                        <div className="flex items-center justify-between mb-3">
                          <span className="badge-brand">
                            {brandLabel}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>

                        <h3 className="font-display text-base font-bold text-surface-800 leading-snug mb-1 group-hover:text-gradient transition-all duration-300">
                          {product.name}
                        </h3>
                        <p className="text-xs text-surface-400 mb-4">Premium Quality Product</p>

                        <div className="mt-auto flex items-end justify-between pt-4 border-t border-surface-200/60">
                          <div>
                            <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-0.5">Price</p>
                            <p className="text-lg font-display font-bold text-surface-900">
                              <span className="text-xs text-surface-400 font-normal mr-0.5">Rp</span>
                              {product.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <button className="flex items-center gap-1.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-accent-500/15 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:shadow-xl hover:shadow-accent-500/30 hover:brightness-110">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ===== BOTTOM CTA ===== */}
            {products.length > 0 && (
              <div className="mt-12 glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-accent-500/10 to-gold-400/10 p-3 rounded-2xl border border-accent-400/20">
                    <Zap className="w-6 h-6 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-surface-800 text-lg">Looking for more?</h3>
                    <p className="text-sm text-surface-400">Explore our full collection of premium products.</p>
                  </div>
                </div>
                <button className="btn-primary max-w-xs group whitespace-nowrap">
                  Browse All
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative mt-16 border-t border-surface-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-display font-bold text-gradient">Premium Catalog</span>
            </div>
            <p className="text-xs text-surface-400">
              © 2026 Premium Catalog. Crafted with precision.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
