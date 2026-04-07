import React, { useMemo } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { dummyData } from '../data';
import { Filter, ChevronRight, RefreshCw, ShoppingBag, Tag, Cpu, Layers } from 'lucide-react';

export function loader({ request }) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get('category') || '';
  const subCategoryId = url.searchParams.get('subcategory') || '';
  const brandId = url.searchParams.get('brand') || '';

  const categories = dummyData.categories;
  
  let subCategories = [];
  if (categoryId) {
    subCategories = dummyData.subCategories.filter(s => s.categoryId === categoryId);
  }

  let brands = [];
  if (subCategoryId) {
    brands = dummyData.brands.filter(b => b.subCategoryId === subCategoryId);
  }

  // Filter products based on selections
  let products = dummyData.products;
  if (brandId) {
    products = products.filter(p => p.brandId === brandId);
  } else if (subCategoryId) {
    const brandIds = dummyData.brands.filter(b => b.subCategoryId === subCategoryId).map(b => b.id);
    products = products.filter(p => brandIds.includes(p.brandId));
  } else if (categoryId) {
    const subCatIds = dummyData.subCategories.filter(s => s.categoryId === categoryId).map(s => s.id);
    const brandIds = dummyData.brands.filter(b => subCatIds.includes(b.subCategoryId)).map(b => b.id);
    products = products.filter(p => brandIds.includes(p.brandId));
  }

  return { 
    categories, 
    subCategories, 
    brands, 
    products, 
    selections: { categoryId, subCategoryId, brandId } 
  };
}

export default function Catalog() {
  const { categories, subCategories, brands, products, selections } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategoryChange = (e) => {
    const newParams = new URLSearchParams();
    if (e.target.value) {
      newParams.set('category', e.target.value);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSubCategoryChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('brand');
    if (e.target.value) {
      newParams.set('subcategory', e.target.value);
    } else {
      newParams.delete('subcategory');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleBrandChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('brand', e.target.value);
    } else {
      newParams.delete('brand');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleReset = () => {
    setSearchParams({}, { replace: true });
  };

  // Resolving names for Breadcrumb automatically based on selections
  const catName = useMemo(() => categories.find(c => c.id === selections.categoryId)?.name, [categories, selections.categoryId]);
  const subCatName = useMemo(() => subCategories.find(s => s.id === selections.subCategoryId)?.name, [subCategories, selections.subCategoryId]);
  const brandName = useMemo(() => brands.find(b => b.id === selections.brandId)?.name, [brands, selections.brandId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 overflow-auto">
      
      {/* Header element */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-600/20">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
              Premium Catalog
            </h1>
          </div>
          
          {/* Strict DOM Requirement: product-breadcrumb and aria-label */}
          <nav className="product-breadcrumb hidden md:flex items-center text-sm font-medium text-gray-500" aria-label="breadcrumb">
            <span className="hover:text-indigo-600 transition-colors">Home</span>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className={catName ? "hover:text-indigo-600 transition-colors" : "text-indigo-600 font-semibold"}>
              {catName || 'All Categories'}
            </span>
            {subCatName && (
              <>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                <span className={brandName ? "hover:text-indigo-600 transition-colors" : "text-indigo-600 font-semibold"}>{subCatName}</span>
              </>
            )}
            {brandName && (
              <>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                <span className="text-indigo-600 font-semibold">{brandName}</span>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Filter Controls */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-28">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Filter className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="category" className="combobox-label">Main Category</label>
                  {/* Strict DOM element attribute: name="category" */}
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

                <div>
                  <label htmlFor="subcategory" className="combobox-label">Sub-Category</label>
                  {/* Strict DOM element attribute: name="subcategory" */}
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

                <div>
                  <label htmlFor="brand" className="combobox-label">Brand</label>
                  {/* Strict DOM element attribute: name="brand" */}
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

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary w-full group"
                >
                  <RefreshCw className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-900 transition-colors" />
                  Reset Filter
                </button>
              </div>
            </div>
          </aside>

          {/* Strict DOM Element: semantic <section> for main content area */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {brandName || subCatName || catName || 'All Products'}
                <span className="ml-3 text-sm font-medium px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                  {products.length} {products.length === 1 ? 'item' : 'items'}
                </span>
              </h2>
            </div>
          
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-sm">We couldn't find anything matching your current filters. Try resetting or selecting a different category.</p>
                <button onClick={handleReset} className="mt-6 text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  
                  // Enhancing UI with dynamic icons based on a few keywords just for aesthetic feeling
                  const isTech = product.name.includes('Pro') || product.name.includes('Galaxy') || product.name.includes('ROG');
                  const Icon = isTech ? Cpu : Tag;

                  return (
                    <div 
                      key={product.id} 
                      className="group bg-white rounded-3xl p-6 shadow-sm shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-50 mb-6 flex items-center justify-center border border-gray-100/50 group-hover:scale-[1.02] transition-transform duration-300">
                          {/* Placeholder image representation since we don't have images */}
                          <Icon className="w-16 h-16 text-gray-300 group-hover:text-indigo-300 transition-colors duration-300" strokeWidth={1} />
                        </div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 mb-3 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {brands.find(b => b.id === product.brandId)?.name || 'Brand'}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-0.5">Price</p>
                          <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <button className="bg-white border border-gray-200 shadow-sm text-gray-900 p-2.5 rounded-xl group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-300">
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
