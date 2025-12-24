import { useState } from 'react';
// import useProducts from '../hooks/useProducts';
import useProducts from '../hooks/UseProducts';
import ProductCard from '../components/ProductCard'; 
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, X } from 'lucide-react';

const Products = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating.rate - a.rating.rate;
        default: return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="error">
        <div className="error-icon">⚠️</div>
        <h2 className="text-xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-600 mt-2">
          Browse our collection of premium products
        </p>
      </div> */}

      {/* Filter Section - RAPIH */}
      <div className="filter-section">
        <h2 className="filter-title">
          <Filter size={20} />
          Filter Products
        </h2>
        
        <div className="filter-grid">
          {/* Search Input */}
          <div className="filter-group">
            <label className="filter-label">Search Products</label>
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or description..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              className="select-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              className="select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <span className="results-count">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` for "${searchTerm}"`}
          </span>
          
          {(searchTerm || selectedCategory !== 'all' || sortBy !== 'default') && (
            <button 
              className="clear-btn"
              onClick={clearFilters}
            >
              <X size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button 
            className="btn btn-primary"
            onClick={clearFilters}
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;