import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  Files, 
  BarChart3, 
  Settings, 
  User,
  ChevronLeft, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FilePlus, label: 'Create Invoice', path: '/create' },
    { icon: Files, label: 'Invoices', path: '/invoices' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className={cn(
      "sidebar-gradient text-slate-300 transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0 z-40",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <FileText className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">BillingPro</span>
          </div>
        )}
        {collapsed && (
          <div className="bg-indigo-500 p-2 rounded-xl mx-auto">
            <FileText className="text-white w-6 h-6" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", collapsed ? "mx-auto" : "")} />
            {!collapsed && <span className="font-medium animate-in slide-in-from-left-2">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
