import React, { useState } from 'react';

export default function Deals() {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date');

  // Mock data instead of API call
  const mockDeals = [
    {
      id: 1,
      company_name: 'Acme Corp',
      value: 250000,
      status: 'Proposal',
      date: '2025-08-09',
      probability: 75
    },
    {
      id: 2,
      company_name: 'Tech Solutions',
      value: 180000,
      status: 'Negotiation',
      date: '2025-08-08',
      probability: 90
    },
    {
      id: 3,
      company_name: 'Global Industries',
      value: 320000,
      status: 'Qualification',
      date: '2025-08-07',
      probability: 60
    },
    {
      id: 4,
      company_name: 'Innovation Labs',
      value: 150000,
      status: 'Closed Won',
      date: '2025-08-06',
      probability: 100
    }
  ];

  // Filter and sort deals
  const filteredDeals = mockDeals
    .filter(deal => 
      deal.company_name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sort) {
        case 'value':
          return b.value - a.value;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Deals Pipeline</h2>
      
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Filter by company..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          value={sort} 
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Date</option>
          <option value="value">Value</option>
          <option value="status">Status</option>
        </select>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDeals.map(deal => (
              <tr key={deal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{deal.company_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">${deal.value.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    deal.status === 'Closed Won' ? 'bg-green-100 text-green-800' :
                    deal.status === 'Proposal' ? 'bg-blue-100 text-blue-800' :
                    deal.status === 'Negotiation' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {deal.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{deal.probability}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{deal.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}