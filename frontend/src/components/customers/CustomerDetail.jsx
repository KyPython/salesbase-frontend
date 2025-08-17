import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import api from '../../services/api';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/contacts/${id}`);
        setCustomer(res.data.contact);
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${customer?.first_name} ${customer?.last_name}?`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      await api.delete(`/contacts/${id}`);
      navigate('/customers', { 
        state: { message: 'Customer deleted successfully!' }
      });
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!customer) {
    return (
      <Alert severity="warning">
        Customer not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers')}
          sx={{ mr: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant="h4" component="h1">
          Customer Details
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">
                  {customer.first_name} {customer.last_name}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {customer.email || 'No email provided'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {customer.phone || 'No phone provided'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Professional Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Job Title
                </Typography>
                <Typography variant="body1">
                  {customer.job_title || 'No job title provided'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1">
                  {customer.department || 'No department specified'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Primary Contact
                </Typography>
                <Chip 
                  label={customer.is_primary ? 'Yes' : 'No'} 
                  color={customer.is_primary ? 'primary' : 'default'}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/customers/${id}/edit`)}
                >
                  Edit Customer
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Customer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}