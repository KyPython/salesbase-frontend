
// components/Login.jsx (UPDATED - MUI version)
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
  Link as MuiLink
} from '@mui/material';
// import { useAuth } from '../contexts/AuthContext'; // Removed unused import
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // const { login } = useAuth(); // Removed unused destructure
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Use setLoading to indicate loading state
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

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
        <Card sx={{ maxWidth: 400, mx: 'auto' }}>
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
              Sign in to your account
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                autoComplete="email"
                autoFocus
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                autoComplete="current-password"
              />
              
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Don't have an account?{' '}
                <MuiLink component={Link} to="/register" color="primary">
                  Create one here
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

