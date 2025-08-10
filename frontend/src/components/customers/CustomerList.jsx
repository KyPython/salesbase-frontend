
// components/customers/CustomerList.jsx (UPDATED - Full MUI version)
import React, { useEffect, useState } from 'react';
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
import api from '../../services/api';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/contacts');
      setCustomers(response.data.contacts || []);
      enqueueSnackbar('Customers loaded successfully', { variant: 'success' });
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      const errorMessage = err.response?.data?.error || 'Failed to fetch customers';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id, customerName) => {
    if (!window.confirm(`Are you sure you want to delete ${customerName}?`)) return;
    
    try {
      setDeleteLoading(id);
      await api.delete(`/contacts/${id}`);
      setCustomers(customers.filter(c => c.id !== id));
      enqueueSnackbar('Customer deleted successfully', { variant: 'success' });
    } catch (err) {
      console.error('Failed to delete customer:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete customer';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleView = (id) => {
    navigate(`/customers/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/customers/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate('/customers/new');
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading customers...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add Customer
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchCustomers}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {/* Search and Actions Toolbar */}
          <Toolbar sx={{ pl: 0, pr: 0 }}>
            <TextField
              placeholder="Search customers..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <IconButton onClick={fetchCustomers} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>

          {/* Results Summary */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredCustomers.length} of {customers.length} customers
            </Typography>
          </Box>

          {/* Customers Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                      </Typography>
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddNew}
                          sx={{ mt: 2 }}
                        >
                          Add First Customer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {customer.first_name} {customer.last_name}
                          </Typography>
                          {customer.job_title && (
                            <Typography variant="caption" color="text.secondary">
                              {customer.job_title}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {customer.email || (
                          <Chip label="No email" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        {customer.company_name || (
                          <Chip label="No company" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        {customer.phone || (
                          <Chip label="No phone" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleView(customer.id)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Customer">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(customer.id)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Customer">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(customer.id, `${customer.first_name} ${customer.last_name}`)}
                              color="error"
                              disabled={deleteLoading === customer.id}
                            >
                              {deleteLoading === customer.id ? (
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

