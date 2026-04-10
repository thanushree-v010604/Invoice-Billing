import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Calculator,
  Download,
  Calendar as CalendarIcon,
  ChevronLeft,
  Eye
} from 'lucide-react';
import { db } from '../db';
import { type Invoice, type InvoiceItem, type BusinessProfile } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function CreateInvoice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    customerName: '',
    customerGstin: '',
    customerAddress: '',
    items: [],
    subTotal: 0,
    totalGst: 0,
    grandTotal: 0,
    status: 'unpaid',
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const p = await db.profile.toCollection().first();
      if (p) setProfile(p);

      if (id) {
        const inv = await db.invoices.get(parseInt(id));
        if (inv) setInvoice(inv);
      }
    };
    loadData();
  }, [id]);

  const calculateTotals = (items: InvoiceItem[]) => {
    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalGst = items.reduce((sum, item) => sum + (item.cgst + item.sgst + item.igst), 0);
    const grandTotal = subTotal + totalGst;
    return { subTotal, totalGst, grandTotal };
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      hsnCode: '',
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    const newItems = invoice.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        const amount = updatedItem.quantity * updatedItem.rate;
        const gstAmount = (amount * updatedItem.gstRate) / 100;
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;
        const total = amount + gstAmount;
        return { ...updatedItem, amount, cgst, sgst, total };
      }
      return item;
    });

    const totals = calculateTotals(newItems);
    setInvoice(prev => ({ ...prev, items: newItems, ...totals }));
  };

  const removeItem = (itemId: string) => {
    const newItems = invoice.items.filter(item => item.id !== itemId);
    const totals = calculateTotals(newItems);
    setInvoice(prev => ({ ...prev, items: newItems, ...totals }));
  };

  const handleSave = async () => {
    if (!invoice.customerName) {
      toast.error("Customer name is required");
      return;
    }
    if (invoice.items.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    try {
      let savedId;
      if (id) {
        await db.invoices.update(parseInt(id), invoice);
        savedId = parseInt(id);
        toast.success("Invoice updated successfully");
      } else {
        savedId = await db.invoices.add(invoice);
        toast.success("Invoice created successfully");
      }
      navigate(`/preview/${savedId}`);
    } catch (err) {
      toast.error("Failed to save invoice");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {id ? 'Edit Invoice' : 'Create New Invoice'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Fill in the details to generate a professional GST invoice.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex-1 md:flex-none gap-2 rounded-xl h-11">
            <X className="w-4 h-4" /> Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 gap-2 rounded-xl h-11 shadow-lg shadow-indigo-600/20">
            <Save className="w-4 h-4" /> Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Customer Information</CardTitle>
              <CardDescription>Enter the recipient's billing details.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input 
                  id="customerName" 
                  value={invoice.customerName} 
                  onChange={e => setInvoice({...invoice, customerName: e.target.value})}
                  placeholder="e.g. Acme Corporation"
                  className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerGstin">Customer GSTIN</Label>
                <Input 
                  id="customerGstin" 
                  value={invoice.customerGstin} 
                  onChange={e => setInvoice({...invoice, customerGstin: e.target.value})}
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="customerAddress">Billing Address</Label>
                <Input 
                  id="customerAddress" 
                  value={invoice.customerAddress} 
                  onChange={e => setInvoice({...invoice, customerAddress: e.target.value})}
                  placeholder="e.g. 123 Business Park, Mumbai, Maharashtra"
                  className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Invoice Items</CardTitle>
                <CardDescription>Add products or services to the invoice.</CardDescription>
              </div>
              <Button onClick={addItem} variant="outline" size="sm" className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-950 rounded-xl">
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead>HSN/SAC</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">GST %</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id} className="border-slate-50 dark:border-slate-900">
                        <TableCell>
                          <Input 
                            value={item.description} 
                            onChange={e => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Item description"
                            className="border-none focus-visible:ring-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            value={item.hsnCode} 
                            onChange={e => updateItem(item.id, 'hsnCode', e.target.value)}
                            placeholder="9983"
                            className="border-none focus-visible:ring-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            value={item.quantity} 
                            onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 ml-auto border-none focus-visible:ring-1 bg-slate-50/50 dark:bg-slate-800/50 text-right rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input 
                            type="number" 
                            value={item.rate} 
                            onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-24 ml-auto border-none focus-visible:ring-1 bg-slate-50/50 dark:bg-slate-800/50 text-right rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Select 
                            value={item.gstRate.toString()} 
                            onValueChange={v => updateItem(item.id, 'gstRate', parseInt(v))}
                          >
                            <SelectTrigger className="w-20 ml-auto border-none focus-visible:ring-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="12">12%</SelectItem>
                              <SelectItem value="18">18%</SelectItem>
                              <SelectItem value="28">28%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          ₹{item.total.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Item Cards */}
              <div className="md:hidden space-y-4">
                {invoice.items.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <Label className="text-[10px] uppercase text-slate-400">Description</Label>
                        <Input 
                          value={item.description} 
                          onChange={e => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                          className="bg-white dark:bg-slate-800 h-10 rounded-xl"
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-rose-500 mt-6">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-slate-400">HSN/SAC</Label>
                        <Input 
                          value={item.hsnCode} 
                          onChange={e => updateItem(item.id, 'hsnCode', e.target.value)}
                          className="bg-white dark:bg-slate-800 h-10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-slate-400">GST %</Label>
                        <Select 
                          value={item.gstRate.toString()} 
                          onValueChange={v => updateItem(item.id, 'gstRate', parseInt(v))}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-800 h-10 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="12">12%</SelectItem>
                            <SelectItem value="18">18%</SelectItem>
                            <SelectItem value="28">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-slate-400">Qty</Label>
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="bg-white dark:bg-slate-800 h-10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-slate-400">Price</Label>
                        <Input 
                          type="number" 
                          value={item.rate} 
                          onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="bg-white dark:bg-slate-800 h-10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-slate-400">Total</Label>
                        <div className="h-10 flex items-center font-bold text-slate-900 dark:text-white">
                          ₹{item.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {invoice.items.length === 0 && (
                <div className="text-center py-16 bg-slate-50/30 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 mt-4">
                  <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Calculator className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No items added yet</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Click "Add Item" to start building your invoice.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass-card border-none sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input 
                  id="invoiceNumber" 
                  value={invoice.invoiceNumber} 
                  onChange={e => setInvoice({...invoice, invoiceNumber: e.target.value})}
                  className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input 
                    type="date" 
                    value={format(invoice.date, 'yyyy-MM-dd')} 
                    onChange={e => setInvoice({...invoice, date: new Date(e.target.value)})}
                    className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input 
                    type="date" 
                    value={format(invoice.dueDate, 'yyyy-MM-dd')} 
                    onChange={e => setInvoice({...invoice, dueDate: new Date(e.target.value)})}
                    className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={invoice.status} onValueChange={v => setInvoice({...invoice, status: v as any})}>
                  <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">PAID</SelectItem>
                    <SelectItem value="unpaid">UNPAID</SelectItem>
                    <SelectItem value="overdue">OVERDUE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">₹{invoice.subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Total GST</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">₹{invoice.totalGst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span>Grand Total</span>
                  <span className="gradient-text">₹{invoice.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Notes / Terms</Label>
                <textarea 
                  className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                  placeholder="Bank details, terms and conditions..."
                  value={invoice.notes}
                  onChange={e => setInvoice({...invoice, notes: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
