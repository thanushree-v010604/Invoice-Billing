import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Download,
  Plus,
  Filter,
  FileText,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { db } from '../db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateInvoicePDF } from '../lib/pdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function InvoiceActions({ inv, onEdit, onPreview, onDownload, onDelete }: { inv: any, onEdit: () => void, onPreview: () => void, onDownload: () => void, onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full">
          <MoreVertical className="w-4 h-4" />
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
        <DropdownMenuItem onClick={onPreview} className="gap-2 rounded-lg cursor-pointer">
          <Eye className="w-4 h-4" /> View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit} className="gap-2 rounded-lg cursor-pointer">
          <Edit className="w-4 h-4" /> Edit Invoice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDownload} className="gap-2 rounded-lg cursor-pointer">
          <Download className="w-4 h-4" /> Download PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="gap-2 rounded-lg cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/20">
          <Trash2 className="w-4 h-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function InvoiceList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const invoices = useLiveQuery(() => 
    db.invoices
      .filter(inv => {
        const matchesSearch = inv.customerName.toLowerCase().includes(search.toLowerCase()) || 
                             inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .toArray()
  , [search, statusFilter]) || [];

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await db.invoices.delete(id);
      toast.success("Invoice deleted successfully");
    }
  };

  const handleDownload = async (id: number) => {
    const inv = await db.invoices.get(id);
    const profile = await db.profile.toCollection().first();
    if (inv && profile) {
      await generateInvoicePDF(inv, profile);
      toast.success("PDF generated successfully");
    } else {
      toast.error("Profile or Invoice not found");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Invoices</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all your customer billings.</p>
        </div>
        <Button 
          onClick={() => navigate('/create')} 
          className="bg-indigo-600 hover:bg-indigo-700 gap-2 h-11 px-6 rounded-xl shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </Button>
      </div>

      <Card className="glass-card border-none overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by customer or invoice number..." 
                className="pl-10 bg-slate-50/50 dark:bg-slate-900/50 border-none h-11 rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === 'all' ? 'secondary' : 'ghost'} 
                onClick={() => setStatusFilter('all')}
                className="rounded-xl"
              >
                All
              </Button>
              <Button 
                variant={statusFilter === 'paid' ? 'secondary' : 'ghost'} 
                onClick={() => setStatusFilter('paid')}
                className="rounded-xl"
              >
                Paid
              </Button>
              <Button 
                variant={statusFilter === 'unpaid' ? 'secondary' : 'ghost'} 
                onClick={() => setStatusFilter('unpaid')}
                className="rounded-xl"
              >
                Unpaid
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-900 dark:text-white px-6 py-4">
                    <div className="flex items-center gap-2">
                      Invoice ID <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-white px-6 py-4">Customer</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-white px-6 py-4">Date</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-white px-6 py-4 text-right">Amount</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-white px-6 py-4">Status</TableHead>
                  <TableHead className="w-[80px] px-6 py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors border-slate-50 dark:border-slate-900">
                    <TableCell className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{inv.customerName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{inv.customerGstin || 'No GSTIN'}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {format(new Date(inv.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                      ₹{inv.grandTotal.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={`
                        border-none px-3 py-1 rounded-full text-[10px] font-bold
                        ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 
                          inv.status === 'unpaid' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 
                          'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'}
                      `}>
                        {inv.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <InvoiceActions inv={inv} onEdit={() => navigate(`/edit/${inv.id}`)} onPreview={() => navigate(`/preview/${inv.id}`)} onDownload={() => handleDownload(inv.id!)} onDelete={() => handleDelete(inv.id!)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 space-y-3 active:bg-slate-50 dark:active:bg-slate-900 transition-colors">
                <div className="flex justify-between items-start">
                  <div onClick={() => navigate(`/preview/${inv.id}`)} className="cursor-pointer">
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{inv.invoiceNumber}</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">{inv.customerName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(inv.date), 'dd MMM yyyy')}</p>
                  </div>
                  <InvoiceActions inv={inv} onEdit={() => navigate(`/edit/${inv.id}`)} onPreview={() => navigate(`/preview/${inv.id}`)} onDownload={() => handleDownload(inv.id!)} onDelete={() => handleDelete(inv.id!)} />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Badge className={`
                    border-none px-3 py-1 rounded-full text-[10px] font-bold
                    ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 
                      inv.status === 'unpaid' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 
                      'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'}
                  `}>
                    {inv.status.toUpperCase()}
                  </Badge>
                  <p className="font-black text-slate-900 dark:text-white">₹{inv.grandTotal.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {invoices.length === 0 && (
            <div className="text-center py-24 text-slate-400">
              <div className="bg-slate-50 dark:bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-400">No invoices found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
