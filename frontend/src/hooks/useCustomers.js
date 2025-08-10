// hooks/useCustomers.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/contacts');
        setCustomers(response.data.contacts || []);
      } catch (err) {
        setError('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const deleteCustomer = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete customer');
    }
  };

  return { customers, loading, error, deleteCustomer };
};