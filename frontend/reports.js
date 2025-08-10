const express = require('express');
const router = express.Router();

// Mock data that simulates real database queries
const generateSalesData = (months = 12) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const revenue = Math.floor(Math.random() * 50000) + 30000; // $30K - $80K
    const deals = Math.floor(Math.random() * 15) + 5; // 5-20 deals
    
    data.push({ month, revenue, deals, date: date.toISOString() });
  }
  
  return data;
};

const generateCustomerData = () => {
  return [
    { source: 'Website', count: Math.floor(Math.random() * 30) + 30, percentage: 0 },
    { source: 'Referral', count: Math.floor(Math.random() * 20) + 20, percentage: 0 },
    { source: 'Social Media', count: Math.floor(Math.random() * 15) + 10, percentage: 0 },
    { source: 'Cold Call', count: Math.floor(Math.random() * 10) + 5, percentage: 0 },
    { source: 'Trade Show', count: Math.floor(Math.random() * 8) + 3, percentage: 0 }
  ].map(item => ({
    ...item,
    percentage: Math.round((item.count / 100) * 100)
  }));
};

const generatePipelineData = () => {
  return {
    stages: [
      { name: 'Prospecting', count: Math.floor(Math.random() * 20) + 15, value: Math.floor(Math.random() * 200000) + 100000, color: '#3B82F6' },
      { name: 'Qualification', count: Math.floor(Math.random() * 15) + 10, value: Math.floor(Math.random() * 300000) + 150000, color: '#F59E0B' },
      { name: 'Proposal', count: Math.floor(Math.random() * 12) + 8, value: Math.floor(Math.random() * 400000) + 200000, color: '#EF4444' },
      { name: 'Negotiation', count: Math.floor(Math.random() * 10) + 5, value: Math.floor(Math.random() * 250000) + 100000, color: '#8B5CF6' },
      { name: 'Closed Won', count: Math.floor(Math.random() * 8) + 3, value: Math.floor(Math.random() * 500000) + 200000, color: '#10B981' }
    ],
    velocity: {
      prospecting: Math.floor(Math.random() * 10) + 8,
      qualification: Math.floor(Math.random() * 8) + 5,
      proposal: Math.floor(Math.random() * 12) + 8,
      negotiation: Math.floor(Math.random() * 15) + 10
    }
  };
};

// Get sales performance data
router.get('/sales-performance', async (req, res) => {
  try {
    const { months = 12, startDate, endDate } = req.query;
    
    let salesData = generateSalesData(parseInt(months));
    
    // Apply date filtering if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      salesData = salesData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }
    
    // Calculate totals
    const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalDeals = salesData.reduce((sum, item) => sum + item.deals, 0);
    const avgDealSize = totalDeals > 0 ? Math.round(totalRevenue / totalDeals) : 0;
    
    // Calculate growth percentages (mock calculation)
    const previousPeriodRevenue = totalRevenue * 0.88; // Mock 12% growth
    const revenueGrowth = Math.round(((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100);
    
    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalDeals,
          avgDealSize,
          revenueGrowth,
          dealGrowth: Math.floor(Math.random() * 15) + 5
        },
        monthlyData: salesData,
        trends: {
          revenueTrend: salesData.map(item => ({ month: item.month, value: item.revenue })),
          dealTrend: salesData.map(item => ({ month: item.month, value: item.deals }))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching sales performance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sales performance data' });
  }
});

// Get customer insights data
router.get('/customer-insights', async (req, res) => {
  try {
    const customerData = generateCustomerData();
    const totalCustomers = customerData.reduce((sum, item) => sum + item.count, 0);
    
    // Mock customer metrics
    const metrics = {
      totalCustomers,
      newThisMonth: Math.floor(Math.random() * 50) + 30,
      churnRate: (Math.random() * 3 + 1).toFixed(1), // 1-4%
      avgLifetimeValue: Math.floor(Math.random() * 5000) + 5000,
      customerSatisfaction: Math.floor(Math.random() * 20) + 80, // 80-100%
      repeatCustomers: Math.floor(Math.random() * 30) + 60 // 60-90%
    };
    
    res.json({
      success: true,
      data: {
        sources: customerData,
        metrics,
        topCustomers: [
          { name: 'Acme Corp', value: 45000, deals: 8 },
          { name: 'Tech Solutions', value: 38000, deals: 6 },
          { name: 'Global Industries', value: 32000, deals: 5 }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching customer insights:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer insights data' });
  }
});

// Get pipeline analysis data
router.get('/pipeline-analysis', async (req, res) => {
  try {
    const pipelineData = generatePipelineData();
    
    // Calculate pipeline metrics
    const totalPipelineValue = pipelineData.stages.reduce((sum, stage) => sum + stage.value, 0);
    const totalPipelineCount = pipelineData.stages.reduce((sum, stage) => sum + stage.count, 0);
    
    res.json({
      success: true,
      data: {
        stages: pipelineData.stages,
        velocity: pipelineData.velocity,
        metrics: {
          totalPipelineValue,
          totalPipelineCount,
          conversionRate: Math.floor(Math.random() * 20) + 15, // 15-35%
          avgDealSize: Math.round(totalPipelineValue / totalPipelineCount),
          winRate: Math.floor(Math.random() * 20) + 60 // 60-80%
        }
      }
    });
  } catch (error) {
    console.error('Error fetching pipeline analysis:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pipeline analysis data' });
  }
});

// Get comprehensive dashboard data
router.get('/dashboard-summary', async (req, res) => {
  try {
    const salesData = generateSalesData(6);
    const customerData = generateCustomerData();
    const pipelineData = generatePipelineData();
    
    const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalDeals = salesData.reduce((sum, item) => sum + item.deals, 0);
    const totalPipelineValue = pipelineData.stages.reduce((sum, stage) => sum + stage.value, 0);
    
    res.json({
      success: true,
      data: {
        kpis: {
          totalRevenue,
          totalDeals,
          totalPipelineValue,
          winRate: Math.floor(Math.random() * 20) + 60,
          avgDealSize: Math.round(totalRevenue / totalDeals)
        },
        recentActivity: [
          { type: 'deal_won', message: 'Acme Corp deal closed for $45,000', timestamp: new Date().toISOString() },
          { type: 'new_lead', message: 'New lead from Tech Solutions website', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { type: 'deal_progress', message: 'Global Industries moved to proposal stage', timestamp: new Date(Date.now() - 7200000).toISOString() }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard summary data' });
  }
});

// Export reports to CSV
router.post('/export', async (req, res) => {
  try {
    const { reportType, format = 'csv', filters = {} } = req.body;
    
    let data;
    switch (reportType) {
      case 'sales':
        data = generateSalesData(12);
        break;
      case 'customers':
        data = generateCustomerData();
        break;
      case 'pipeline':
        data = generatePipelineData();
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid report type' });
    }
    
    if (format === 'csv') {
      const csvData = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvData);
    } else {
      res.json({ success: true, data });
    }
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ success: false, error: 'Failed to export report' });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

module.exports = router;