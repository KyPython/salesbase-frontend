// components/Register.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  MenuItem,
  Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'sales_rep'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role
      );
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'sales_rep', label: 'Sales Representative' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Administrator' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ maxWidth: 500, mx: 'auto' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              textAlign="center"
              color="primary"
            >
              SalesBase CRM
            </Typography>
            
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Create your account
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
                
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </Box>
              
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="email"
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="new-password"
                helperText="Minimum 8 characters"
              />
              
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="new-password"
              />
              
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                margin="normal"
                helperText="Select your role in the organization"
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" color="primary">
                  Sign in here
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}