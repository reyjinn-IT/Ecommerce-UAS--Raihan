import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, Download, Filter, Calendar, FileText, 
  DollarSign, TrendingUp, TrendingDown, RefreshCw,
  Users, Package, Target, Percent
} from 'lucide-react';
import './Report.css';

const Report = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('allMonths');
  const [selectedMonth, setSelectedMonth] = useState('allMonths');

  // Sample data for reports
  const [reportData, setReportData] = useState({
    monthlySales: [],
    topProducts: [],
    salesByCategory: [],
    customerStats: {},
    revenueStats: {}
  });

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
  }, []);

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

  // Filter monthly data based on selected month
  const filteredMonthlyData = selectedMonth === 'allMonths' 
    ? reportData.monthlySales 
    : reportData.monthlySales.filter(month => 
        month.month.toLowerCase().startsWith(selectedMonth.substring(0, 3)));

  // Calculate totals
  const totalSales = filteredMonthlyData.reduce((sum, month) => sum + month.sales, 0);
  const totalOrders = filteredMonthlyData.reduce((sum, month) => sum + month.orders, 0);
  const totalProfit = filteredMonthlyData.reduce((sum, month) => sum + month.profit, 0);
  const maxSales = Math.max(...filteredMonthlyData.map(m => m.sales));

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
        <p>Loading report data...</p>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="container">
        {/* Report Header */}
        <div className="report-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="report-title">Sales Reports</h1>
              <p className="report-subtitle">
                Comprehensive sales analytics and insights
              </p>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleGenerateReport}
                className="primary-btn"
              >
                <RefreshCw size={18} />
                <span>Generate Report</span>
              </button>
              <button 
                onClick={handleExportCSV}
                className="secondary-btn"
              >
                <Download size={18} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">${totalSales.toLocaleString()}</div>
              <div className="stat-label">Total Sales</div>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>12.5%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>8.2%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">${totalProfit.toLocaleString()}</div>
              <div className="stat-label">Total Profit</div>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>15.3%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Percent size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">68%</div>
              <div className="stat-label">Profit Margin</div>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>3.1%</span>
            </div>
          </div>
        </div>

        {/* Monthly Sales Chart */}
        <div className="report-section">
          <div className="section-header">
            <h2 className="section-title">
              Monthly Sales - Jan to Dec {new Date().getFullYear()}
            </h2>
            <div className="section-actions">
              <select 
                className="filter-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="allMonths">All Months</option>
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
              </select>
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-wrapper">
              {/* Bar Chart */}
              <div className="bar-chart">
                {filteredMonthlyData.map((month) => {
                  const barHeight = maxSales > 0 ? (month.sales / maxSales) * 220 : 0;
                  return (
                    <div key={month.month} className="bar-column">
                      <div className="bar-value">
                        ${(month.sales / 1000).toFixed(1)}k
                      </div>
                      <div 
                        className="bar" 
                        style={{ height: `${barHeight}px` }}
                        data-tooltip={`Sales: $${month.sales.toLocaleString()}\nOrders: ${month.orders}\nProfit: $${month.profit.toLocaleString()}`}
                      ></div>
                      <div className="month-label">{month.month}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Chart Summary */}
              <div className="chart-summary">
                <div className="summary-item">
                  <div className="summary-label">Total Sales</div>
                  <div className="summary-value">${totalSales.toLocaleString()}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Average Monthly</div>
                  <div className="summary-value primary">
                    ${Math.round(totalSales / Math.max(filteredMonthlyData.length, 1)).toLocaleString()}
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Best Month</div>
                  <div className="summary-value green">
                    {filteredMonthlyData.reduce((max, month) => 
                      month.sales > max.sales ? month : max, filteredMonthlyData[0])?.month || 'N/A'}
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Growth YoY</div>
                  <div className="summary-value" style={{ 
                    color: totalSales > 400000 ? '#059669' : '#dc2626'
                  }}>
                    {filteredMonthlyData.length === 12 
                      ? `${((totalSales - 400000) / 400000 * 100).toFixed(1)}%`
                      : 'N/A'}
                  </div>
                </div>
              </div>
              
              {/* Selection Info */}
              <div className="selection-info">
                <div className="info-title">
                  {selectedMonth === 'allMonths' 
                    ? 'Viewing All Months' 
                    : `Viewing: ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}`}
                </div>
                <div className="info-detail">
                  {selectedMonth === 'allMonths' 
                    ? `Showing sales data for all ${filteredMonthlyData.length} months` 
                    : `Sales in ${selectedMonth}: $${filteredMonthlyData[0]?.sales.toLocaleString() || '0'}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="report-section">
          <div className="section-header">
            <h2 className="section-title">Sales by Category</h2>
          </div>
          <div className="category-content">
            <div className="category-table-container">
              <table className="data-table">
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
                        <strong className="sales-amount">
                          ${cat.sales.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <div className="percentage-bar">
                          <div 
                            className="percentage-fill"
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                          <span className="percentage-text">{cat.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pie-chart-container">
              <div className="pie-chart">
                <div className="pie-center">
                  <div className="pie-value">
                    ${totalSales.toLocaleString().slice(0, -3)}k
                  </div>
                  <div className="pie-label">Total Sales</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="report-section">
          <div className="section-header">
            <h2 className="section-title">Top Performing Products</h2>
          </div>
          <div className="table-container">
            <table className="data-table">
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
                        <span className="category-tag">
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <strong>{product.sales}</strong>
                      </td>
                      <td>
                        <strong className="revenue-amount">
                          ${product.revenue.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <strong className="profit-amount">
                          ${product.profit.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <span className={`margin-badge ${profitMargin > 60 ? 'high' : 'medium'}`}>
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

        {/* Customer Insights */}
        <div className="report-section">
          <div className="section-header">
            <h2 className="section-title">Customer Insights</h2>
          </div>
          <div className="customer-grid">
            <div className="customer-card total">
              <div className="customer-value">{reportData.customerStats.total}</div>
              <div className="customer-label">Total Customers</div>
            </div>
            
            <div className="customer-card new">
              <div className="customer-value">{reportData.customerStats.newThisMonth}</div>
              <div className="customer-label">New This Month</div>
            </div>
            
            <div className="customer-card returning">
              <div className="customer-value">{reportData.customerStats.returning}</div>
              <div className="customer-label">Returning Customers</div>
            </div>
            
            <div className="customer-card churn">
              <div className="customer-value">{reportData.customerStats.churnRate}%</div>
              <div className="customer-label">Churn Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;