import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, Package, ShoppingCart, Users, DollarSign, 
  TrendingUp, TrendingDown, FileText, Search, Download,
  ChevronDown, Filter, Eye, MoreVertical, Clock,
  CheckCircle, Truck, CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data stats
  const [stats, setStats] = useState({
    totalSales: 320.820,
    totalOrders: 1307,
    totalProducts: 156,
    totalCustomers: 289,
    monthlyGrowth: 12.5,
    conversionRate: 4.2
  });

  // Recent orders data
  const [recentOrders, setRecentOrders] = useState([
    { 
      id: 'ORD-001', 
      customer: 'John Doe', 
      email: 'john@example.com',
      amount: 249.99, 
      status: 'completed', 
      date: '2024-01-15',
      items: 3,
      payment: 'credit-card'
    },
    // ... (data orders lainnya tetap sama)
  ]);

  // Top selling products
  const [topProducts, setTopProducts] = useState([
    { id: 1, name: 'Premium Headphones', category: 'Electronics', sales: 124, revenue: 12400, stock: 45, rating: 4.8 },
    // ... (data products lainnya tetap sama)
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={14} color="#059669" />;
      case 'pending': return <Clock size={14} color="#d97706" />;
      case 'shipped': return <Truck size={14} color="#2563eb" />;
      default: return <MoreVertical size={14} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#d1fae5';
      case 'pending': return '#fef3c7';
      case 'shipped': return '#dbeafe';
      default: return '#f3f4f6';
    }
  };

  const getStatusTextColor = (status) => {
    switch(status) {
      case 'completed': return '#065f46';
      case 'pending': return '#92400e';
      case 'shipped': return '#1e40af';
      default: return '#374151';
    }
  };

  const getPaymentIcon = (payment) => {
    switch(payment) {
      case 'credit-card': return <CreditCard size={12} />;
      case 'paypal': return 'PP';
      case 'cod': return 'COD';
      default: return '$';
    }
  };

  const getPaymentColor = (payment) => {
    switch(payment) {
      case 'credit-card': return '#3b82f6';
      case 'paypal': return '#0070ba';
      case 'cod': return '#6b7280';
      default: return '#374151';
    }
  };

  // Filter and sort orders
  const filteredOrders = recentOrders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'date':
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case 'amount':
          comparison = b.amount - a.amount;
          break;
        case 'customer':
          comparison = a.customer.localeCompare(b.customer);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // const exportOrdersCSV = () => {
  //   const csvContent = "data:text/csv;charset=utf-8," 
  //     + "Order ID,Customer,Email,Amount,Status,Date,Items,Payment\n"
  //     + recentOrders.map(order => 
  //         `${order.id},${order.customer},${order.email},${order.amount},${order.status},${order.date},${order.items},${order.payment}`
  //       ).join("\n");
    
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // const exportProductsCSV = () => {
  //   const csvContent = "data:text/csv;charset=utf-8," 
  //     + "Product,Category,Sales,Revenue,Stock,Rating\n"
  //     + topProducts.map(product => 
  //         `${product.name},${product.category},${product.sales},${product.revenue},${product.stock},${product.rating}`
  //       ).join("\n");
    
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", `products_${new Date().toISOString().split('T')[0]}.csv`);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  if (!user || user.role !== 'admin') {
    return (
      <div className="access-denied">
        <div className="denied-icon">🚫</div>
        <h2 className="denied-title">Access Denied</h2>
        <p className="denied-text">You don't have permission to access this page.</p>
        <Link to="/login/admin" className="primary-btn">
          Admin Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1 className="dashboard-title">Welcome back, {user.name}!</h1>
              <p className="dashboard-subtitle">
                Here's what's happening with your store today.
              </p>
            </div>
            <div className="header-actions">
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Filter size={20} />
              </button>
              <Link to="/admin/reports" className="primary-btn">
                <FileText size={18} />
                <span>View Reports</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">${stats.totalSales.toLocaleString()}</div>
              <div className="stat-label">Total Sales</div>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>{stats.monthlyGrowth}%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>8.2%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>5.3%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalCustomers}</div>
              <div className="stat-label">Customers</div>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>3.1%</span>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {mobileMenuOpen && (
          <div className="mobile-filters">
            <div className="filter-group">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-group">
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>
            <div className="filter-group">
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="customer">Sort by Customer</option>
              </select>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Recent Orders Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">
                  Recent Orders
                  <span className="section-count">({recentOrders.length} total)</span>
                </h2>
              </div>
              <div className="section-actions">
                {/* <button 
                  onClick={exportOrdersCSV}
                  className="secondary-btn"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button> */}
                <Link to="/admin/reports" className="primary-btn">
                  View All
                </Link>
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="filters-row">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
              </select>

              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="customer">Sort by Customer</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>
                      Order ID {sortBy === 'id' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th onClick={() => handleSort('customer')}>
                      Customer {sortBy === 'customer' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th onClick={() => handleSort('amount')}>
                      Amount {sortBy === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th>Status</th>
                    <th onClick={() => handleSort('date')}>
                      Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="order-id">{order.id}</div>
                        <div className="order-items">
                          {order.items} {order.items === 1 ? 'item' : 'items'}
                        </div>
                      </td>
                      <td>
                        <div className="customer-name">{order.customer}</div>
                        <div className="customer-email">{order.email}</div>
                      </td>
                      <td>
                        <div className="order-amount">${order.amount.toFixed(2)}</div>
                        <div className="payment-method" style={{ color: getPaymentColor(order.payment) }}>
                          {getPaymentIcon(order.payment)}
                          <span>{order.payment === 'credit-card' ? 'Card' : order.payment}</span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            background: getStatusColor(order.status),
                            color: getStatusTextColor(order.status)
                          }}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="order-date">
                          {new Date(order.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="order-day">
                          {new Date(order.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="empty-table">
                  <div className="empty-icon">📭</div>
                  <div className="empty-title">No orders found</div>
                  <div className="empty-text">Try adjusting your search or filter criteria</div>
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="table-footer">
              <div className="table-info">
                Showing <strong>{filteredOrders.length}</strong> of <strong>{recentOrders.length}</strong> orders
              </div>
              <div className="table-stats">
                <span>Pending:</span>
                <span className="pending-count">
                  {recentOrders.filter(o => o.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>

          {/* Top Products Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">
                  Top Selling Products
                  <span className="section-count">(This Month)</span>
                </h2>
              </div>
              <div className="section-actions">
                {/* <button 
                  onClick={exportProductsCSV}
                  className="secondary-btn"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button> */}
              </div>
            </div>

            {/* Products Table */}
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 8)
                    .map((product, index) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-info">
                          <div className="product-rank">{index + 1}</div>
                          <div className="product-details">
                            <div className="product-name">{product.name}</div>
                            <div className="product-rating">
                              <div className="stars">
                                {'★'.repeat(Math.floor(product.rating))}
                                {'☆'.repeat(5 - Math.floor(product.rating))}
                              </div>
                              <span>{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>
                        <div className="sales-count">{product.sales}</div>
                        <div className="sales-trend">
                          {product.sales > 100 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          <span>{product.sales > 100 ? 'High' : 'Low'} demand</span>
                        </div>
                      </td>
                      <td>
                        <div className="revenue-amount">${product.revenue.toLocaleString()}</div>
                        <div className="revenue-average">
                          ${(product.revenue / product.sales).toFixed(0)} avg
                        </div>
                      </td>
                      <td>
                        <div className="stock-info">
                          <div className="stock-bar">
                            <div 
                              className="stock-fill"
                              style={{
                                width: `${(product.stock / 150) * 100}%`,
                                background: product.stock > 50 ? '#10b981' : 
                                          product.stock > 20 ? '#f59e0b' : '#ef4444'
                              }}
                            ></div>
                          </div>
                          <div 
                            className="stock-count"
                            style={{
                              color: product.stock > 50 ? '#059669' : 
                                    product.stock > 20 ? '#d97706' : '#dc2626'
                            }}
                          >
                            {product.stock}
                          </div>
                        </div>
                        <div className="stock-status">
                          {product.stock > 50 ? 'In Stock' : 
                           product.stock > 20 ? 'Low Stock' : 'Reorder'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Products Summary */}
            <div className="products-summary">
              <div className="summary-card">
                <div className="summary-value">
                  ${topProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </div>
                <div className="summary-label">Total Revenue</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">
                  {topProducts.reduce((sum, p) => sum + p.sales, 0)}
                </div>
                <div className="summary-label">Units Sold</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">
                  {topProducts.filter(p => p.stock < 30).length}
                </div>
                <div className="summary-label">Low Stock</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;