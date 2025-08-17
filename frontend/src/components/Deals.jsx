import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Toolbar,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../services/api';

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/deals');
      setDeals(response.data.deals || []);
      enqueueSnackbar('Deals loaded successfully', { variant: 'success' });
    } catch (err) {
      console.error('Failed to fetch deals:', err);
      const errorMessage = err.response?.data?.error || 'Failed to fetch deals';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDelete = async (id, companyName) => {
    if (!window.confirm(`Are you sure you want to delete the deal with ${companyName}?`)) return;
    
    try {
      setDeleteLoading(id);
      await api.delete(`/deals/${id}`);
      setDeals(deals.filter(d => d.id !== id));
      enqueueSnackbar('Deal deleted successfully', { variant: 'success' });
    } catch (err) {
      console.error('Failed to delete deal:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete deal';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter and sort deals
  const filteredDeals = deals
    .filter(deal => 
      deal.company_name.toLowerCase().includes(filter.toLowerCase()) ||
      deal.title.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sort) {
        case 'value':
          return b.value - a.value;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'probability':
          return b.probability - a.probability;
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Deals Pipeline
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchDeals}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
            <TextField
              placeholder="Search deals..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchDeals} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>

          {/* Results Summary */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredDeals.length} of {deals.length} deals
            </Typography>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Probability</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No deals found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {deal.company_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {deal.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(deal.value, deal.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={deal.status} 
                          size="small"
                          color={deal.status === 'Closed Won' ? 'success' : 
                                 deal.status === 'Closed Lost' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {deal.probability}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(deal.date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Deal">
                            <IconButton 
                              size="small" 
                              onClick={() => navigate(`/deals/${deal.id}`)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Deal">
                            <IconButton 
                              size="small" 
                              onClick={() => navigate(`/deals/${deal.id}/edit`)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Deal">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete(deal.id, deal.company_name)}
                              disabled={deleteLoading === deal.id}
                            >
                              {deleteLoading === deal.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}