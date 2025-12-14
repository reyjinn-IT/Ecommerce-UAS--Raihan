import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, Package, ShoppingCart, Users, DollarSign, 
  TrendingUp, TrendingDown, PlusCircle, FileText, Settings,
  Eye, MoreVertical, Calendar, CreditCard, Truck, CheckCircle,
  Clock, ArrowUpRight, ExternalLink, Download, Filter, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Data stats dari state
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
    { 
      id: 'ORD-002', 
      customer: 'Jane Smith', 
      email: 'jane@example.com',
      amount: 149.50, 
      status: 'pending', 
      date: '2024-01-15',
      items: 2,
      payment: 'paypal'
    },
    { 
      id: 'ORD-003', 
      customer: 'Bob Johnson', 
      email: 'bob@example.com',
      amount: 89.99, 
      status: 'completed', 
      date: '2024-01-14',
      items: 1,
      payment: 'credit-card'
    },
    { 
      id: 'ORD-004', 
      customer: 'Alice Brown', 
      email: 'alice@example.com',
      amount: 299.99, 
      status: 'shipped', 
      date: '2024-01-14',
      items: 4,
      payment: 'credit-card'
    },
    { 
      id: 'ORD-005', 
      customer: 'Charlie Wilson', 
      email: 'charlie@example.com',
      amount: 79.99, 
      status: 'pending', 
      date: '2024-01-13',
      items: 1,
      payment: 'cod'
    },
    { 
      id: 'ORD-006', 
      customer: 'David Lee', 
      email: 'david@example.com',
      amount: 189.99, 
      status: 'completed', 
      date: '2024-01-13',
      items: 2,
      payment: 'credit-card'
    },
    { 
      id: 'ORD-007', 
      customer: 'Emma Davis', 
      email: 'emma@example.com',
      amount: 399.99, 
      status: 'completed', 
      date: '2024-01-12',
      items: 5,
      payment: 'paypal'
    },
    { 
      id: 'ORD-008', 
      customer: 'Frank Miller', 
      email: 'frank@example.com',
      amount: 129.99, 
      status: 'shipped', 
      date: '2024-01-12',
      items: 1,
      payment: 'credit-card'
    },
    { 
      id: 'ORD-009', 
      customer: 'Grace Taylor', 
      email: 'grace@example.com',
      amount: 599.99, 
      status: 'completed', 
      date: '2024-01-11',
      items: 6,
      payment: 'credit-card'
    },
    { 
      id: 'ORD-010', 
      customer: 'Henry Clark', 
      email: 'henry@example.com',
      amount: 89.99, 
      status: 'pending', 
      date: '2024-01-11',
      items: 1,
      payment: 'cod'
    },
  ]);

  // Top selling products
  const [topProducts, setTopProducts] = useState([
    { id: 1, name: 'Premium Headphones', category: 'Electronics', sales: 124, revenue: 12400, stock: 45, rating: 4.8 },
    { id: 2, name: 'Smart Watch Pro', category: 'Wearables', sales: 98, revenue: 19600, stock: 32, rating: 4.6 },
    { id: 3, name: 'Wireless Mouse', category: 'Accessories', sales: 156, revenue: 4680, stock: 78, rating: 4.4 },
    { id: 4, name: 'USB-C Cable', category: 'Accessories', sales: 230, revenue: 1150, stock: 120, rating: 4.2 },
    { id: 5, name: 'Laptop Stand', category: 'Office', sales: 87, revenue: 4350, stock: 56, rating: 4.7 },
    { id: 6, name: 'Mechanical Keyboard', category: 'Electronics', sales: 65, revenue: 7800, stock: 23, rating: 4.9 },
    { id: 7, name: 'Bluetooth Speaker', category: 'Audio', sales: 92, revenue: 9200, stock: 34, rating: 4.5 },
    { id: 8, name: 'Power Bank 20000mAh', category: 'Accessories', sales: 180, revenue: 7200, stock: 67, rating: 4.3 },
  ]);

  useEffect(() => {
    // Simulate loading data
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

  // Filter and sort products
  const filteredProducts = topProducts
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const exportOrdersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Order ID,Customer,Email,Amount,Status,Date,Items,Payment\n"
      + recentOrders.map(order => 
          `${order.id},${order.customer},${order.email},${order.amount},${order.status},${order.date},${order.items},${order.payment}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportProductsCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Product,Category,Sales,Revenue,Stock,Rating\n"
      + topProducts.map(product => 
          `${product.name},${product.category},${product.sales},${product.revenue},${product.stock},${product.rating}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="empty-state">
        <div className="empty-icon">🚫</div>
        <h2 className="empty-title">Access Denied</h2>
        <p className="empty-text">You don't have permission to access this page.</p>
        <Link to="/login/admin" className="btn btn-primary">
          Admin Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header" style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="dashboard-title">Welcome back, {user.name}!</h1>
              <p className="dashboard-subtitle">
                Here's what's happening with your store today.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/admin/reports" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} />
                View Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid" style={{ marginBottom: '40px' }}>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <DollarSign size={24} />
            </div>
            <div className="admin-stat-info">
              <div>
                <div className="admin-stat-value">${stats.totalSales.toLocaleString()}</div>
                <div className="admin-stat-label">Total Sales</div>
              </div>
              <div className="admin-stat-change positive">
                <TrendingUp size={16} />
                {stats.monthlyGrowth}%
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
              <ShoppingCart size={24} />
            </div>
            <div className="admin-stat-info">
              <div>
                <div className="admin-stat-value">{stats.totalOrders}</div>
                <div className="admin-stat-label">Total Orders</div>
              </div>
              <div className="admin-stat-change positive">
                <TrendingUp size={16} />
                8.2%
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Package size={24} />
            </div>
            <div className="admin-stat-info">
              <div>
                <div className="admin-stat-value">{stats.totalProducts}</div>
                <div className="admin-stat-label">Products</div>
              </div>
              <div className="admin-stat-change positive">
                <TrendingUp size={16} />
                5.3%
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
              <Users size={24} />
            </div>
            <div className="admin-stat-info">
              <div>
                <div className="admin-stat-value">{stats.totalCustomers}</div>
                <div className="admin-stat-label">Customers</div>
              </div>
              <div className="admin-stat-change positive">
                <TrendingUp size={16} />
                3.1%
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '32px',
          marginBottom: '40px'
        }}>
          {/* Recent Orders Table */}
          <div className="dashboard-section">
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <h2 className="section-title">
                Recent Orders
                <span style={{ 
                  marginLeft: '12px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  ({recentOrders.length} total)
                </span>
              </h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button 
                  onClick={exportOrdersCSV}
                  className="btn btn-secondary btn-small"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={16} />
                  Export
                </button>
                <Link to="/admin/reports" className="btn btn-primary btn-small">
                  View All
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div className="search-box" style={{ flex: 1, minWidth: '200px' }}>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              
              <select 
                className="select-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
              </select>

              <select 
                className="select-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="customer">Sort by Customer</option>
              </select>
            </div>

            {/* Orders Table */}
            <div style={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead style={{ 
                  background: '#f9fafb',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}>
                  <tr>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }} onClick={() => handleSort('id')}>
                      Order ID {sortBy === 'id' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      cursor: 'pointer'
                    }} onClick={() => handleSort('customer')}>
                      Customer {sortBy === 'customer' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      cursor: 'pointer'
                    }} onClick={() => handleSort('amount')}>
                      Amount {sortBy === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      cursor: 'pointer'
                    }} onClick={() => handleSort('date')}>
                      Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} style={{ 
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{order.id}</div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6b7280',
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ 
                            padding: '2px 6px',
                            background: '#f3f4f6',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {order.items} {order.items === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{order.customer}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                          {order.email}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>
                          ${order.amount.toFixed(2)}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: getPaymentColor(order.payment),
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {getPaymentIcon(order.payment)}
                          <span style={{ textTransform: 'uppercase' }}>
                            {order.payment === 'credit-card' ? 'Card' : order.payment}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: getStatusColor(order.status),
                            color: getStatusTextColor(order.status),
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ color: '#1e293b', fontWeight: '500' }}>
                          {new Date(order.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                          {new Date(order.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    No orders found
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    Try adjusting your search or filter criteria
                  </div>
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <div>
                Showing <strong>{filteredOrders.length}</strong> of <strong>{recentOrders.length}</strong> orders
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '500' }}>Pending:</span>
                <span style={{ 
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>
                  {recentOrders.filter(o => o.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="dashboard-section">
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <h2 className="section-title">
                Top Selling Products
                <span style={{ 
                  marginLeft: '12px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  (This Month)
                </span>
              </h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button 
                  onClick={exportProductsCSV}
                  className="btn btn-secondary btn-small"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div style={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead style={{ 
                  background: '#f9fafb',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}>
                  <tr>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Product
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Category
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Sales
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Revenue
                    </th>
                    <th style={{ 
                      padding: '16px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} style={{ 
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            background: '#f3f4f6',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: '#2563eb',
                            fontSize: '14px'
                          }}>
                            {index + 1}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#1e293b' }}>
                              {product.name}
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              marginTop: '4px'
                            }}>
                              <div style={{ 
                                display: 'flex',
                                color: '#f59e0b',
                                fontSize: '12px'
                              }}>
                                {'★'.repeat(Math.floor(product.rating))}
                                {'☆'.repeat(5 - Math.floor(product.rating))}
                              </div>
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                {product.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: '#f3f4f6',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          color: '#6b7280',
                          fontWeight: '500',
                          display: 'inline-block'
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>
                          {product.sales}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: product.sales > 100 ? '#059669' : '#d97706',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '4px'
                        }}>
                          {product.sales > 100 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          <span>{product.sales > 100 ? 'High' : 'Low'} demand</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '700', color: '#059669' }}>
                          ${product.revenue.toLocaleString()}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6b7280',
                          marginTop: '4px'
                        }}>
                          ${(product.revenue / product.sales).toFixed(0)} avg
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              height: '6px',
                              background: '#e5e7eb',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${(product.stock / 150) * 100}%`,
                                height: '100%',
                                background: product.stock > 50 ? '#10b981' : 
                                          product.stock > 20 ? '#f59e0b' : '#ef4444',
                                borderRadius: '3px'
                              }}></div>
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            color: product.stock > 50 ? '#059669' : 
                                  product.stock > 20 ? '#d97706' : '#dc2626',
                            minWidth: '30px',
                            textAlign: 'right'
                          }}>
                            {product.stock}
                          </div>
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#6b7280',
                          marginTop: '4px',
                          textAlign: 'right'
                        }}>
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
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                background: '#f0f9ff',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#2563eb' }}>
                  ${filteredProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Total Revenue
                </div>
              </div>
              <div style={{ 
                background: '#f0fdf4',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
                  {filteredProducts.reduce((sum, p) => sum + p.sales, 0)}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Units Sold
                </div>
              </div>
              <div style={{ 
                background: '#fef7cd',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#d97706' }}>
                  {filteredProducts.filter(p => p.stock < 30).length}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Low Stock
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;