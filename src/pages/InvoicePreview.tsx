import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Download, 
  Edit, 
  ChevronLeft, 
  Printer, 
  Share2,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { db } from '../db';
import { type Invoice, type BusinessProfile } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { generateInvoicePDF } from '../lib/pdf';

export default function InvoicePreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const inv = await db.invoices.get(parseInt(id));
        if (inv) setInvoice(inv);
      }
      const p = await db.profile.toCollection().first();
      if (p) setProfile(p);
    };
    loadData();
  }, [id]);

  const handleDownload = async () => {
    if (invoice && profile) {
      try {
        await generateInvoicePDF(invoice, profile);
        toast.success("PDF generated successfully");
      } catch (err) {
        toast.error("Failed to generate PDF");
      }
    }
  };

  if (!invoice || !profile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/invoices')}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {invoice.invoiceNumber}
              </h1>
              <Badge className={`
                border-none px-3 py-1 rounded-full text-[10px] font-bold
                ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 
                  invoice.status === 'unpaid' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 
                  'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'}
              `}>
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Issued on {format(new Date(invoice.date), 'dd MMM yyyy')}</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={() => navigate(`/edit/${id}`)} className="flex-1 md:flex-none gap-2 rounded-xl h-11">
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button onClick={handleDownload} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 gap-2 rounded-xl h-11 shadow-lg shadow-indigo-600/20">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="glass-card border-none overflow-hidden p-8 md:p-12 min-h-[800px]">
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                    <FileText className="text-white w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-2xl tracking-tight">BillingPro</span>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">{profile.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{profile.address}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">GSTIN: {profile.gstin}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email} | {profile.phone}</p>
                </div>
              </div>
              <div className="text-left md:text-right space-y-2">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter opacity-10">Invoice</h2>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Invoice Number</p>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold">{invoice.invoiceNumber}</p>
                </div>
                <div className="grid grid-cols-2 md:block gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Date Issued</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{format(new Date(invoice.date), 'dd MMM yyyy')}</p>
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Due Date</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 mb-12 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bill To</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{invoice.customerName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{invoice.customerAddress}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">GSTIN: {invoice.customerGstin || 'N/A'}</p>
              </div>
              <div className="flex flex-col justify-end text-left md:text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Amount Due</p>
                <p className="text-4xl font-black gradient-text">₹{invoice.grandTotal.toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-12">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                    <TableHead className="text-slate-900 dark:text-white font-bold">Description</TableHead>
                    <TableHead className="text-slate-900 dark:text-white font-bold">HSN/SAC</TableHead>
                    <TableHead className="text-right text-slate-900 dark:text-white font-bold">Qty</TableHead>
                    <TableHead className="text-right text-slate-900 dark:text-white font-bold">Price</TableHead>
                    <TableHead className="text-right text-slate-900 dark:text-white font-bold">GST</TableHead>
                    <TableHead className="text-right text-slate-900 dark:text-white font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={index} className="border-slate-100 dark:border-slate-900">
                      <TableCell className="py-4">
                        <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400">{item.hsnCode}</TableCell>
                      <TableCell className="text-right text-slate-700 dark:text-slate-300">{item.quantity}</TableCell>
                      <TableCell className="text-right text-slate-700 dark:text-slate-300">₹{item.rate.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-slate-700 dark:text-slate-300">{item.gstRate}%</TableCell>
                      <TableCell className="text-right font-bold text-slate-900 dark:text-white">₹{item.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notes & Terms</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                    {invoice.notes || 'Thank you for your business! Please make payment within the due date.'}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-72 space-y-3">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900 dark:text-white">₹{invoice.subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Total GST</span>
                  <span className="font-medium text-slate-900 dark:text-white">₹{invoice.totalGst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">₹{invoice.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                {invoice.status === 'paid' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : invoice.status === 'unpaid' ? (
                  <Clock className="w-6 h-6 text-amber-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-500" />
                )}
                <div>
                  <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{invoice.status}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Updated today</p>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2 rounded-xl">
                <Share2 className="w-4 h-4" /> Share Invoice
              </Button>
              <Button variant="outline" className="w-full gap-2 rounded-xl">
                <Printer className="w-4 h-4" /> Print
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-950 shadow-sm"></div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Invoice Created</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(invoice.date), 'dd MMM yyyy, hh:mm a')}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-950 shadow-sm"></div>
                  <p className="text-sm font-bold text-slate-400">Sent to Customer</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
