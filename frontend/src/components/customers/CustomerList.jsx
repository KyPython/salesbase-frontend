import React, { useEffect, useState } from 'react';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        setCustomers(data.contacts || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch customers');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      setCustomers(customers.filter(c => c.id !== id));
    } catch {
      setError('Failed to delete customer');
    }
  };

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Customer List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.first_name} {c.last_name}</td>
              <td>{c.email}</td>
              <td>{c.company_name || '-'}</td>
              <td>
                <button onClick={() => window.location.href = `/customers/${c.id}`}>View</button>
                <button onClick={() => window.location.href = `/customers/edit/${c.id}`}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}