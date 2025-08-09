import React, { useEffect, useState } from 'react';

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setReports(data.reports || []));
  }, []);

  const exportCSV = () => {
    const rows = [
      Object.keys(reports[0] || {}).join(','),
      ...reports.map(r => Object.values(r).join(',')),
    ];
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Reports</h2>
      <button onClick={exportCSV} className="mb-4">Export CSV</button>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {reports[0] && Object.keys(reports[0]).map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((r, idx) => (
            <tr key={idx}>
              {Object.values(r).map((val, i) => (
                <td key={i}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}