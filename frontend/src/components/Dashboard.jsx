import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { API_ENDPOINTS } from '../services/api';


// Dashboard.jsx (UPDATED - MUI version)
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/pipeline/analytics/overview');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="info">No data available</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sales Dashboard
      </Typography>
      
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Deals
              </Typography>
              <Typography variant="h4" component="div">
                {stats.pipeline_summary?.total_deals || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h4" component="div">
                ${(stats.pipeline_summary?.total_value || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg Win Rate
              </Typography>
              <Typography variant="h4" component="div">
                {stats.pipeline_summary?.avg_win_rate || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Stages
              </Typography>
              <Typography variant="h4" component="div">
                {stats.pipeline_stages?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Deals by Stage
          </Typography>
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.pipeline_stages || []}>
                <XAxis dataKey="stage_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deal_count" fill="#1e3a8a" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
