import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/pipeline/analytics/overview')
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sales KPIs</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white rounded shadow">
          <h3>Total Deals</h3>
          <div className="text-2xl">{stats.total_deals}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3>Total Value</h3>
          <div className="text-2xl">${stats.total_value}</div>
        </div>
      </div>
      <h3 className="font-semibold mb-2">Deals by Stage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats.stages}>
          <XAxis dataKey="stage_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="deal_count" fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}