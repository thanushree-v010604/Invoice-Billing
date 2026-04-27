import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { 
  Sun, 
  Moon, 
  LogOut, 
  User,
  Bell,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [invoices, setInvoices] = useState([]);

  const currentUserName = user?.name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await apiFetch('/api/invoices');
        if (!res.ok) return;
        const invoices = await res.json();
        setInvoices(invoices);
        const overdue = invoices.filter((invoice: any) => invoice.status === 'overdue').length;
        const unpaid = invoices.filter((invoice: any) => invoice.status === 'unpaid').length;
        setNotificationCount(overdue + unpaid);
      } catch (error) {
        console.warn('Failed loading notification count', error);
      }
    };

    loadNotifications();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      
      <div className="flex items-center gap-4">
        <div className="flex md:hidden items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <FileText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">BillingPro</span>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 hidden md:block">
          Welcome back, <span className="gradient-text">{currentUserName}</span>
        </h2>
      </div>

      <div className="flex items-center gap-3">

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-5 rounded-full bg-rose-500 text-[10px] text-white font-bold flex items-center justify-center border-2 border-white dark:border-slate-950 px-1">
                  {notificationCount}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {invoices.filter((invoice: any) => invoice.status === 'unpaid' || invoice.status === 'overdue').length === 0 ? (
              <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
            ) : (
              invoices
                .filter((invoice: any) => invoice.status === 'unpaid' || invoice.status === 'overdue')
                .slice(0, 5) // Show up to 5 notifications
                .map((invoice: any) => (
                  <DropdownMenuItem
                    key={invoice._id}
                    onClick={() => navigate('/invoices')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        Invoice #{invoice.invoiceNumber}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {invoice.status === 'overdue' ? 'Overdue - Payment Required' : 'Payment Pending'}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
            )}
            {invoices.filter((invoice: any) => invoice.status === 'unpaid' || invoice.status === 'overdue').length > 5 && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuItem onClick={() => navigate('/invoices')} className="cursor-pointer">
              View All Invoices
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button type="button" className="inline-flex">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUserName}`} />
                  <AvatarFallback>{currentUserName.charAt(0)}</AvatarFallback>
                </Avatar>
              </button>
            }
          />

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUserName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'No email available'}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="text-rose-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}