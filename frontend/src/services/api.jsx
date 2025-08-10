import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  CONTACTS: `${API_BASE_URL}/api/contacts`,
  CUSTOMERS: `${API_BASE_URL}/api/customers`,
  COMPANIES: `${API_BASE_URL}/api/companies`,
  REPORTS: {
    SALES_PERFORMANCE: `${API_BASE_URL}/api/reports/sales-performance`,
    CUSTOMER_INSIGHTS: `${API_BASE_URL}/api/reports/customer-insights`,
    PIPELINE_ANALYSIS: `${API_BASE_URL}/api/reports/pipeline-analysis`,
    DASHBOARD_SUMMARY: `${API_BASE_URL}/api/reports/dashboard-summary`,
    EXPORT: `${API_BASE_URL}/api/reports/export`
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`
  }
};

const api = axios.create({
  baseURL: 'https://salesbase-backend.onrender.com/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;  // <--- Export axios instance as default
