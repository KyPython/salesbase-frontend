import React, { useEffect, useState } from 'react';

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date');

  useEffect(() => {
    fetch(`/api/deals?filter=${filter}&sort=${sort}`)
      .then(res => res.json())
      .then(data => setDeals(data.deals || []));
  }, [filter, sort]);

  return (
    <div>
      <h2>Deals</h2>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Filter by company..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="date">Date</option>
          <option value="value">Value</option>
          <option value="status">Status</option>
        </select>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th>Company</th>
            <th>Value</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => (
            <tr key={deal.id}>
              <td>{deal.company_name}</td>
              <td>${deal.value}</td>
              <td>{deal.status}</td>
              <td>{deal.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}