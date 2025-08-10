import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import Deals from './components/Deals';
import CustomerList from './components/customers/CustomerList';
import CustomerDetail from './components/customers/CustomerDetail';
import CustomerForm from './components/customers/CustomerForm';
import Reports from './components/Reports.jsx';
import ReportDashboard from './pages/Reports/ReportDashboard.jsx';
import Register from './components/Register'; // Import Register component
import Settings from './components/Settings'; // Import Settings component

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <SnackbarProvider 
            maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* Add register route */}
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="deals" element={<Deals />} />
                  <Route path="customers" element={<CustomerList />} />
                  <Route path="customers/:id" element={<CustomerDetail />} />
                  <Route path="customers/new" element={<CustomerForm />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="reports/dashboard" element={<ReportDashboard />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;