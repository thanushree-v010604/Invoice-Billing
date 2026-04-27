import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function DashboardLayout() {

  // ✅ Check auth using token
  const isAuthenticated = !!localStorage.getItem("token");

  // 🔐 If not logged in → go to login
  

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <Navbar />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}