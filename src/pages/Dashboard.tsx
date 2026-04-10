import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight,
  FileText,
  BarChart3
} from 'lucide-react';
import { db } from '../db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const invoices = useLiveQuery(() => db.invoices.toArray()) || [];
  
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalGst = invoices.reduce((sum, inv) => sum + inv.totalGst, 0);
  const pendingAmount = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;
  const pendingCount = invoices.length - paidCount;

  const chartData = invoices
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(inv => ({
      name: format(new Date(inv.date), 'dd MMM'),
      total: inv.grandTotal
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time insights into your billing performance.</p>
        </div>
        <Button 
          onClick={() => navigate('/create')} 
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 gap-2 h-11 px-6 rounded-xl"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Invoices" 
          value={invoices.length.toString()} 
          icon={<FileText className="text-indigo-500" />} 
          description="Total generated"
          trend="+12% from last month"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          icon={<TrendingUp className="text-emerald-500" />} 
          description="Lifetime earnings"
          trend="+8% from last month"
        />
        <StatCard 
          title="GST Collected" 
          value={`₹${totalGst.toLocaleString()}`} 
          icon={<CheckCircle2 className="text-purple-500" />} 
          description="Tax overview"
          trend="+5% from last month"
        />
        <StatCard 
          title="Pending Payments" 
          value={`₹${pendingAmount.toLocaleString()}`} 
          icon={<Clock className="text-amber-500" />} 
          description={`${pendingCount} unpaid invoices`}
          trend="-2% from last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Monthly Revenue
            </CardTitle>
            <CardDescription>Visual trend of your earnings over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
              <CardDescription>Latest transactions</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-indigo-600 hover:text-indigo-700 gap-1"
              onClick={() => navigate('/invoices')}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.slice(-5).reverse().map((inv) => (
                <div 
                  key={inv.id} 
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                  onClick={() => navigate(`/preview/${inv.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      inv.status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' 
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{inv.customerName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{inv.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">₹{inv.grandTotal.toLocaleString()}</p>
                    <Badge variant="outline" className={`text-[10px] h-5 mt-1 border-none ${
                      inv.status === 'paid' 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                    }`}>
                      {inv.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No invoices yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description, trend }: { title: string, value: string, icon: React.ReactNode, description: string, trend: string }) {
  return (
    <Card className="glass-card border-none hover:translate-y-[-4px] transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</CardTitle>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'
          }`}>
            {trend.split(' ')[0]}
          </span>
          <p className="text-[10px] text-slate-400">{trend.split(' ').slice(1).join(' ')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
