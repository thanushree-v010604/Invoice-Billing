import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTranslation } from 'react-i18next';
import { 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { db } from '../db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export default function Reports() {
  const { t } = useTranslation();
  const invoices = useLiveQuery(() => db.invoices.toArray()) || [];

  const statusData = [
    { name: 'Paid', value: invoices.filter(i => i.status === 'paid').length, color: '#10b981' },
    { name: 'Unpaid', value: invoices.filter(i => i.status === 'unpaid').length, color: '#f59e0b' },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length, color: '#f43f5e' },
  ].filter(d => d.value > 0);

  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const monthlyData = months.map(month => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const monthInvoices = invoices.filter(inv => {
      const date = new Date(inv.date);
      return date >= start && date <= end;
    });
    return {
      name: format(month, 'MMM'),
      revenue: monthInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
      gst: monthInvoices.reduce((sum, inv) => sum + inv.totalGst, 0)
    };
  });

  const topCustomers = Object.entries(
    invoices.reduce((acc, inv) => {
      acc[inv.customerName] = (acc[inv.customerName] || 0) + inv.grandTotal;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, total]) => ({ name, total }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your business financial health.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2 rounded-xl h-11">
            <CalendarIcon className="w-4 h-4" /> Last 6 Months
          </Button>
          <Button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 gap-2 rounded-xl h-11 shadow-lg shadow-indigo-600/20">
            <Download className="w-4 h-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportStatCard 
          title="Avg. Monthly Revenue" 
          value={`₹${(monthlyData.reduce((s, m) => s + m.revenue, 0) / 6).toLocaleString()}`} 
          icon={<IndianRupee className="text-indigo-500" />}
          trend="+15.2%"
          isUp={true}
        />
        <ReportStatCard 
          title="Customer Growth" 
          value="+24" 
          icon={<Users className="text-emerald-500" />}
          trend="+5.4%"
          isUp={true}
        />
        <ReportStatCard 
          title="Tax Liability" 
          value={`₹${monthlyData.reduce((s, m) => s + m.gst, 0).toLocaleString()}`} 
          icon={<TrendingUp className="text-purple-500" />}
          trend="-2.1%"
          isUp={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                <BarChartIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Revenue vs GST</CardTitle>
                <CardDescription>Monthly comparison of earnings and tax.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGst" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="gst" stroke="#a855f7" fillOpacity={1} fill="url(#colorGst)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                <PieChartIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Payment Distribution</CardTitle>
                <CardDescription>Status breakdown of all invoices.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Customers</CardTitle>
            <CardDescription>Clients with highest billing volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topCustomers.map((customer, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-900 dark:text-white">{customer.name}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">₹{customer.total.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(customer.total / topCustomers[0].total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {topCustomers.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p>No customer data available yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportStatCard({ title, value, icon, trend, isUp }: { title: string, value: string, icon: React.ReactNode, trend: string, isUp: boolean }) {
  return (
    <Card className="glass-card border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">{icon}</div>
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            isUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'
          }`}>
            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
