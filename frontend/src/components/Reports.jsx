import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { API_ENDPOINTS } from '../services/api';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState({});
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('12');

  const fetchReportData = async (reportType, months = 12) => {
    setLoading(true);
    setError('');

    try {
      let endpoint;
      switch (reportType) {
        case 'sales':
          endpoint = `${API_ENDPOINTS.REPORTS.SALES_PERFORMANCE}?months=${months}`;
          break;
        case 'customers':
          endpoint = API_ENDPOINTS.REPORTS.CUSTOMER_INSIGHTS;
          break;
        case 'pipeline':
          endpoint = API_ENDPOINTS.REPORTS.PIPELINE_ANALYSIS;
          break;
        case 'dashboard':
          endpoint = API_ENDPOINTS.REPORTS.DASHBOARD_SUMMARY;
          break;
        default:
          throw new Error('Invalid report type');
      }

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();
      if (result.success) {
        setReportData(prev => ({ ...prev, [reportType]: result.data }));
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(activeTab, Number(dateRange));
  }, [activeTab, dateRange]);

  const exportReport = async (format = 'csv') => {
    try {
      const response = await fetch(`${API_ENDPOINTS.REPORTS.EXPORT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: activeTab,
          format,
          filters: { months: Number(dateRange) }
        }),
      });

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError('Failed to export report');
      console.error('Export error:', err);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading && Object.keys(reportData).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => fetchReportData(activeTab, Number(dateRange))}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3">Last 3 months</option>
            <option value="6">Last 6 months</option>
            <option value="12">Last 12 months</option>
          </select>
          <button 
            onClick={() => exportReport('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {['sales', 'customers', 'pipeline'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium transition-colors capitalize ${
              activeTab === tab 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'sales' ? 'Sales Performance' : 
             tab === 'customers' ? 'Customer Insights' : 'Pipeline Analysis'}
          </button>
        ))}
      </div>

      {/* Sales Performance Tab */}
      {activeTab === 'sales' && reportData.sales && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">
                ${(reportData.sales.summary.totalRevenue / 1000).toFixed(0)}K
              </p>
              <p className={`text-sm ${reportData.sales.summary.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {reportData.sales.summary.revenueGrowth >= 0 ? '+' : ''}{reportData.sales.summary.revenueGrowth}% from last period
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Deals</h3>
              <p className="text-3xl font-bold text-blue-600">{reportData.sales.summary.totalDeals}</p>
              <p className={`text-sm ${reportData.sales.summary.dealGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {reportData.sales.summary.dealGrowth >= 0 ? '+' : ''}{reportData.sales.summary.dealGrowth}% from last period
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Deal Size</h3>
              <p className="text-3xl font-bold text-purple-600">
                ${(reportData.sales.summary.avgDealSize / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Growth Rate</h3>
              <p className="text-3xl font-bold text-orange-600">{reportData.sales.summary.revenueGrowth}%</p>
              <p className="text-sm text-gray-500">Revenue growth</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reportData.sales.monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${(value / 1000).toFixed(0)}K`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Deals by Month</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reportData.sales.monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="deals" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Revenue vs Deals</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reportData.sales.monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? `$${(value / 1000).toFixed(0)}K` : value,
                    name === 'revenue' ? 'Revenue' : 'Deals'
                  ]} />
                  <Line yAxisId="left" type="monotone" dataKey="deals" stroke="#3B82F6" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Customer Insights Tab */}
      {activeTab === 'customers' && reportData.customers && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Customers</h3>
              <p className="text-3xl font-bold text-blue-600">{reportData.customers.metrics.totalCustomers.toLocaleString()}</p>
              <p className="text-sm text-green-500">+{reportData.customers.metrics.newThisMonth} this month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Churn Rate</h3>
              <p className="text-3xl font-bold text-red-600">{reportData.customers.metrics.churnRate}%</p>
              <p className="text-sm text-gray-500">Monthly churn</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg LTV</h3>
              <p className="text-3xl font-bold text-green-600">${(reportData.customers.metrics.avgLifetimeValue / 1000).toFixed(1)}K</p>
              <p className="text-sm text-gray-500">Lifetime value</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Sources</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.customers.sources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ source, percentage }) => `${source}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {reportData.customers.sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600">{reportData.customers.metrics.customerSatisfaction}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Repeat Customers</span>
                  <span className="font-semibold text-blue-600">{reportData.customers.metrics.repeatCustomers}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">New This Month</span>
                  <span className="font-semibold text-green-600">+{reportData.customers.metrics.newThisMonth}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Customers</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Company</th>
                    <th className="text-right py-2">Total Value</th>
                    <th className="text-right py-2">Deals</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.customers.topCustomers.map((customer, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{customer.name}</td>
                      <td className="text-right py-2">${(customer.value / 1000).toFixed(0)}K</td>
                      <td className="text-right py-2">{customer.deals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Analysis Tab */}
      {activeTab === 'pipeline' && reportData.pipeline && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {reportData.pipeline.stages.map((stage, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
                <h4 className="text-sm font-medium text-gray-500">{stage.name}</h4>
                <p className="text-2xl font-bold" style={{ color: stage.color }}>{stage.count}</p>
                <p className="text-xs text-gray-500">${(stage.value / 1000).toFixed(0)}K value</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Pipeline Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pipeline Value</span>
                  <span className="font-semibold">${(reportData.pipeline.metrics.totalPipelineValue / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-blue-600">{reportData.pipeline.metrics.conversionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Win Rate</span>
                  <span className="font-semibold text-green-600">{reportData.pipeline.metrics.winRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Deal Size</span>
                  <span className="font-semibold">${(reportData.pipeline.metrics.avgDealSize / 1000).toFixed(1)}K</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Pipeline Velocity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prospecting</span>
                  <span className="font-semibold text-blue-600">{reportData.pipeline.velocity.prospecting} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Qualification</span>
                  <span className="font-semibold text-yellow-600">{reportData.pipeline.velocity.qualification} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Proposal</span>
                  <span className="font-semibold text-purple-600">{reportData.pipeline.velocity.proposal} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Negotiation</span>
                  <span className="font-semibold text-red-600">{reportData.pipeline.velocity.negotiation} days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Pipeline Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.pipeline.monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pipelineValue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
