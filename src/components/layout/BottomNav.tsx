import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  Files, 
  User, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: Files, label: 'Invoices', path: '/invoices' },
    { icon: FilePlus, label: 'Create', path: '/create' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50 safe-area-bottom">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all duration-200",
            isActive 
              ? "text-indigo-600 dark:text-indigo-400" 
              : "text-slate-400 dark:text-slate-500"
          )}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
