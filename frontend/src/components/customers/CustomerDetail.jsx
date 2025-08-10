import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchCustomer = async () => {
    try {
      const response = await api.get(`/contacts/${id}`);
      setCustomer(response.data.contact);
      setForm(response.data.contact);
      setLoading(false);
    } catch (error) {
      console.error('Fetch customer error:', error);
      setError('Failed to fetch customer');
      setLoading(false);
    }
  };
  
  fetchCustomer();
}, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setCustomer(updated.contact);
        setEditMode(false);
        setError('');
      } else {
        setError('Failed to update customer');
      }
    } catch {
      setError('Failed to update customer');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await fetch(`http://localhost:3001/api/contacts/${id}`, { method: 'DELETE' });
      navigate('/customers');
    } catch {
      setError('Failed to delete customer');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!customer) return <div>Customer not found.</div>;

  return (
    <div>
      <h2>Customer Details</h2>
      {!editMode ? (
        <div>
          <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Company:</strong> {customer.company_name || '-'}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={handleDelete} style={{ color: 'red', marginLeft: 8 }}>Delete</button>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div>
            <label>First Name: <input name="first_name" value={form.first_name || ''} onChange={handleChange} /></label>
          </div>
          <div>
            <label>Last Name: <input name="last_name" value={form.last_name || ''} onChange={handleChange} /></label>
          </div>
          <div>
            <label>Email: <input name="email" value={form.email || ''} onChange={handleChange} /></label>
          </div>
          <div>
            <label>Company: <input name="company_name" value={form.company_name || ''} onChange={handleChange} /></label>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)} style={{ marginLeft: 8 }}>Cancel</button>
        </form>
      )}
    </div>
  );
}