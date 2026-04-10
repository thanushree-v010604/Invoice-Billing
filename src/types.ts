export interface BusinessProfile {
  id?: number;
  name: string;
  gstin: string;
  address: string;
  email: string;
  phone: string;
  logo?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsnCode: string;
  quantity: number;
  rate: number;
  gstRate: number; // e.g., 18 for 18%
  amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface Invoice {
  id?: number;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  customerName: string;
  customerGstin: string;
  customerAddress: string;
  items: InvoiceItem[];
  subTotal: number;
  totalGst: number;
  grandTotal: number;
  status: 'paid' | 'unpaid' | 'overdue';
  notes?: string;
}
