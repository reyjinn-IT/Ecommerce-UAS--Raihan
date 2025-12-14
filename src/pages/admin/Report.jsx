import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, Download, Filter, Calendar, FileText, 
  DollarSign, TrendingUp, TrendingDown, RefreshCw 
} from 'lucide-react';

const Report = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    monthlySales: [],
    topProducts: [],
    salesByCategory: [],
    customerStats: {},
    revenueStats: {}
  });
  const [timeRange, setTimeRange] = useState('last12months');
  const [reportType, setReportType] = useState('sales');

  // Sample data for reports
  const monthlyData = [
    { month: 'Jan', sales: 12000, orders: 45, profit: 8000 },
    { month: 'Feb', sales: 18000, orders: 62, profit: 12000 },
    { month: 'Mar', sales: 15000, orders: 54, profit: 10000 },
    { month: 'Apr', sales: 22000, orders: 78, profit: 15000 },
    { month: 'May', sales: 19000, orders: 65, profit: 13000 },
    { month: 'Jun', sales: 25000, orders: 89, profit: 18000 },
    { month: 'Jul', sales: 28000, orders: 95, profit: 20000 },
    { month: 'Aug', sales: 32000, orders: 112, profit: 23000 },
    { month: 'Sep', sales: 29000, orders: 98, profit: 21000 },
    { month: 'Oct', sales: 35000, orders: 125, profit: 25000 },
    { month: 'Nov', sales: 40000, orders: 142, profit: 30000 },
    { month: 'Dec', sales: 45820, orders: 342, profit: 35000 },
  ];

  const topProducts = [
    { id: 1, name: 'Premium Headphones', category: 'Electronics', sales: 124, revenue: 12400, profit: 8000 },
    { id: 2, name: 'Smart Watch Pro', category: 'Wearables', sales: 98, revenue: 19600, profit: 13000 },
    { id: 3, name: 'Wireless Mouse', category: 'Accessories', sales: 156, revenue: 4680, profit: 3000 },
    { id: 4, name: 'USB-C Cable', category: 'Accessories', sales: 230, revenue: 1150, profit: 700 },
    { id: 5, name: 'Laptop Stand', category: 'Office', sales: 87, revenue: 4350, profit: 2800 },
  ];

  const salesByCategory = [
    { category: 'Electronics', sales: 42000, percentage: 35 },
    { category: 'Wearables', sales: 28000, percentage: 23 },
    { category: 'Accessories', sales: 25000, percentage: 21 },
    { category: 'Office', sales: 15000, percentage: 12 },
    { category: 'Others', sales: 10000, percentage: 9 },
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setReportData({
        monthlySales: monthlyData,
        topProducts: topProducts,
        salesByCategory: salesByCategory,
        customerStats: {
          total: 289,
          newThisMonth: 45,
          returning: 120,
          churnRate: 2.3
        },
        revenueStats: {
          total: 45820,
          averageOrder: 134,
          growth: 12.5,
          profitMargin: 68
        }
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Report generated successfully!');
    }, 1500);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Month,Sales,Orders,Profit\n"
      + reportData.monthlySales.map(row => 
          `${row.month},${row.sales},${row.orders},${row.profit}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
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
        <p>Loading report data...</p>
      </div>
    );
  }

  // Calculate totals
  const totalSales = reportData.monthlySales.reduce((sum, month) => sum + month.sales, 0);
  const totalOrders = reportData.monthlySales.reduce((sum, month) => sum + month.orders, 0);
  const totalProfit = reportData.monthlySales.reduce((sum, month) => sum + month.profit, 0);

  // Find max sales for chart scaling
  const maxSales = Math.max(...reportData.monthlySales.map(m => m.sales));

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Report Header */}
        <div className="dashboard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="dashboard-title">Sales Reports</h1>
              <p className="dashboard-subtitle">
                Comprehensive sales analytics and insights
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleGenerateReport}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={18} />
                Generate Report
              </button>
              <button 
                onClick={handleExportCSV}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="admin-stats-grid" style={{ marginBottom: '32px' }}>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <DollarSign size={24} />
            </div>
            <div className="admin-stat-info">
              <div>
                <div className="admin-stat-value">${totalSales.toLocaleString()}</div>
                <div className="admin-stat-label">Total Sales</div>
              </div>
              <div className="admin-stat-change positive">
                <TrendingUp size={16} />
                12.5%
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: '#dcfce7', color: '#059669' }}>
              <BarChart3 size={24} />
            </div>
            <div className="admin-stat-info">
              <div>
                <div className="admin-stat-value">{totalOrders}</div>
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
              <DollarSign size={24} />
            </div>
            <div className="admin-stat-info">
              <div>
                <div className="admin-stat-value">${totalProfit.toLocaleString()}</div>
                <div className="admin-stat-label">Total Profit</div>
              </div>
              <div className="admin-stat-change positive">
                <TrendingUp size={16} />
                15.3%
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
              <TrendingUp size={24} />
            </div>
            <div className="admin-stat-info">
              <div>
                <div className="admin-stat-value">68%</div>
                <div className="admin-stat-label">Profit Margin</div>
              </div>
              <div className="admin-stat-change positive">
                <TrendingUp size={16} />
                3.1%
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart - Sales Overview */}
        {/* Sales Overview - Januari sampai Desember */}
<div className="dashboard-section">
  <div className="section-header">
    <h2 className="section-title">Monthly Sales - Jan to Dec {new Date().getFullYear()}</h2>
    <div className="section-actions">
      <select 
        className="month-filter"
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
      >
        <option value="january">January</option>
        <option value="february">February</option>
        <option value="march">March</option>
        <option value="april">April</option>
        <option value="may">May</option>
        <option value="june">June</option>
        <option value="july">July</option>
        <option value="august">August</option>
        <option value="september">September</option>
        <option value="october">October</option>
        <option value="november">November</option>
        <option value="december">December</option>
        <option value="allMonths">All Months</option>
      </select>
    </div>
  </div>
  
  <div className="chart-container">
    <div style={{ 
      padding: '20px',
      background: '#f9fafb', 
      borderRadius: '12px', 
      height: '100%'
    }}>
      {/* Monthly Bar Chart */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'space-around',
        height: '300px',
        padding: '20px 0',
        position: 'relative'
      }}>
        {/* Grid Lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 0
        }}>
          {[0, 1, 2, 3, 4].map((line) => (
            <div key={line} style={{
              borderTop: '1px solid #e5e7eb',
              width: '100%'
            }}></div>
          ))}
        </div>
        
        {/* Bars for each month */}
        {reportData.monthlySales.map((month, index) => {
          const barHeight = (month.sales / maxSales) * 220;
          return (
            <div key={month.month} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              zIndex: 1
            }}>
              {/* Sales value on top */}
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#2563eb',
                marginBottom: '8px',
                textAlign: 'center',
                minHeight: '30px'
              }}>
                ${(month.sales / 1000).toFixed(1)}k
              </div>
              
              {/* Bar */}
              <div style={{
                width: '40px',
                height: `${barHeight}px`,
                background: 'linear-gradient(to top, #2563eb, #60a5fa)',
                borderRadius: '6px 6px 0 0',
                position: 'relative',
                transition: 'height 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(to top, #1d4ed8, #3b82f6)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(to top, #2563eb, #60a5fa)';
                e.target.style.transform = 'scale(1)';
              }}>
                {/* Tooltip on hover */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1e293b',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  pointerEvents: 'none'
                }}>
                  <div>Sales: ${month.sales.toLocaleString()}</div>
                  <div>Orders: {month.orders}</div>
                  <div>Profit: ${month.profit.toLocaleString()}</div>
                </div>
              </div>
              
              {/* Month label */}
              <div style={{ 
                fontSize: '13px', 
                color: '#6b7280',
                fontWeight: '600',
                marginTop: '12px',
                textAlign: 'center'
              }}>
                {month.month}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Statistics */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginTop: '40px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Total Annual Sales
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            ${totalSales.toLocaleString()}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Average Monthly
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#2563eb' }}>
            ${Math.round(totalSales / 12).toLocaleString()}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Best Month
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
            {reportData.monthlySales.reduce((max, month) => 
              month.sales > max.sales ? month : max, reportData.monthlySales[0])?.month || 'N/A'}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Growth YoY
          </div>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: totalSales > 400000 ? '#059669' : '#dc2626'
          }}>
            {((totalSales - 400000) / 400000 * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      
      {/* Month Selection Info */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px',
        color: '#6b7280',
        fontSize: '14px',
        padding: '15px',
        background: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #dbeafe'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '5px' }}>
          {timeRange === 'allMonths' ? 'Viewing All Months' : `Viewing: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`}
        </div>
        <div style={{ fontSize: '13px' }}>
          {timeRange === 'allMonths' 
            ? 'Showing sales data for all 12 months' 
            : `Sales in ${timeRange}: $${reportData.monthlySales
                .find(m => m.month.toLowerCase().startsWith(timeRange.substring(0, 3)))?.sales.toLocaleString() || '0'}`}
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Sales by Category */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Sales by Category</h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '32px',
            alignItems: 'center'
          }}>
            <div>
              <table className="recent-orders-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Sales</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.salesByCategory.map((cat, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{cat.category}</strong>
                      </td>
                      <td>
                        <strong style={{ color: '#059669' }}>
                          ${cat.sales.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px'
                        }}>
                          <div style={{ 
                            width: '100px', 
                            height: '8px', 
                            background: '#e5e7eb',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${cat.percentage}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
                              borderRadius: '4px'
                            }}></div>
                          </div>
                          <span style={{ fontWeight: '600' }}>{cat.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ 
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {/* Simple Pie Chart Representation */}
              <div style={{ 
                width: '200px', 
                height: '200px', 
                margin: '0 auto',
                borderRadius: '50%',
                background: 'conic-gradient(#2563eb 0% 35%, #60a5fa 35% 58%, #93c5fd 58% 79%, #bfdbfe 79% 91%, #dbeafe 91% 100%)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100px',
                  height: '100px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
                    ${totalSales.toLocaleString().slice(0, -3)}k
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Total Sales
                  </div>
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                marginTop: '20px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Category Distribution
              </div>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Top Performing Products</h2>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="recent-orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Profit</th>
                  <th>Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topProducts.map((product) => {
                  const profitMargin = ((product.profit / product.revenue) * 100).toFixed(1);
                  return (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                      </td>
                      <td>
                        <span style={{
                          background: '#f3f4f6',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <strong>{product.sales}</strong>
                      </td>
                      <td>
                        <strong style={{ color: '#059669' }}>
                          ${product.revenue.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ color: '#2563eb' }}>
                          ${product.profit.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <span style={{
                          background: profitMargin > 60 ? '#d1fae5' : '#fef3c7',
                          color: profitMargin > 60 ? '#065f46' : '#92400e',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {profitMargin}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Customer Insights</h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ 
              background: '#f0f9ff',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #dbeafe'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0369a1', marginBottom: '8px' }}>
                {reportData.customerStats.total}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                Total Customers
              </div>
            </div>
            
            <div style={{ 
              background: '#f0fdf4',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #d1fae5'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#059669', marginBottom: '8px' }}>
                {reportData.customerStats.newThisMonth}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                New This Month
              </div>
            </div>
            
            <div style={{ 
              background: '#fef7cd',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #fde68a'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#d97706', marginBottom: '8px' }}>
                {reportData.customerStats.returning}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                Returning Customers
              </div>
            </div>
            
            <div style={{ 
              background: '#fef2f2',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #fecaca'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#dc2626', marginBottom: '8px' }}>
                {reportData.customerStats.churnRate}%
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                Churn Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;