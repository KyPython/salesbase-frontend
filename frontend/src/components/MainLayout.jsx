import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white flex-shrink-0 p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">SalesBase CRM</h2>
        <nav>
          <ul className="space-y-4">
            <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/customers" className="hover:underline">Customers</Link></li>
            <li><Link to="/deals" className="hover:underline">Deals</Link></li>
            <li><Link to="/reports" className="hover:underline">Reports</Link></li>
            <li><Link to="/settings" className="hover:underline">Settings</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Enterprise CRM System</h1>
          <nav className="md:hidden">
            <ul className="flex space-x-4">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/customers">Customers</Link></li>
              <li><Link to="/deals">Deals</Link></li>
              <li><Link to="/reports">Reports</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
          </nav>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}