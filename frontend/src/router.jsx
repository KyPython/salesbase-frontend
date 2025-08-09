import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import CustomerList from './components/customers/CustomerList';
import CustomerDetail from './components/customers/CustomerDetail';
import CustomerForm from './components/customers/CustomerForm';
import Dashboard from './components/Dashboard';
import Deals from './components/Deals';
import Reports from './components/Reports';

// Placeholder components for other routes
const Dashboard = () => <div>Dashboard</div>;
const Deals = () => <div>Deals</div>;
const Reports = () => <div>Reports</div>;
const Settings = () => <div>Settings</div>;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="customers/edit/:id" element={<CustomerForm />} />
          <Route path="dashboard" element={<Dashboard />} />
<Route path="deals" element={<Deals />} />
<Route path="reports" element={<Reports />} />
<Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}