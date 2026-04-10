import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { type Invoice, type BusinessProfile } from '../types';

export const generateInvoicePDF = async (invoice: Invoice, profile: BusinessProfile) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text("TAX INVOICE", margin, y);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(`#${invoice.invoiceNumber}`, 160, y);
  y += 10;

  // Business Info
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(profile.name, margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.text(profile.address, margin, y);
  y += 5;
  doc.text(`GSTIN: ${profile.gstin}`, margin, y);
  y += 5;
  doc.text(`Email: ${profile.email} | Phone: ${profile.phone}`, margin, y);
  y += 15;

  // Horizontal Line
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, 190, y);
  y += 10;

  // Customer Info
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Bill To:", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(invoice.customerName, margin, y);
  y += 5;
  doc.setTextColor(71, 85, 105);
  doc.text(invoice.customerAddress, margin, y);
  y += 5;
  doc.text(`GSTIN: ${invoice.customerGstin}`, margin, y);

  // Invoice Dates
  doc.setTextColor(15, 23, 42);
  doc.text(`Date: ${format(new Date(invoice.date), 'dd/MM/yyyy')}`, 140, y - 10);
  doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'dd/MM/yyyy')}`, 140, y - 5);
  y += 15;

  // Table Header
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, 170, 10, 'F');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Description", margin + 2, y + 7);
  doc.text("HSN", margin + 60, y + 7);
  doc.text("Qty", margin + 80, y + 7);
  doc.text("Rate", margin + 100, y + 7);
  doc.text("GST%", margin + 125, y + 7);
  doc.text("Total", margin + 150, y + 7);
  y += 15;

  // Table Items
  doc.setTextColor(15, 23, 42);
  invoice.items.forEach((item) => {
    doc.text(item.description, margin + 2, y);
    doc.text(item.hsnCode, margin + 60, y);
    doc.text(item.quantity.toString(), margin + 80, y);
    doc.text(item.rate.toLocaleString(), margin + 100, y);
    doc.text(`${item.gstRate}%`, margin + 125, y);
    doc.text(item.total.toLocaleString(), margin + 150, y);
    y += 8;
    
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  y += 10;
  doc.line(margin, y, 190, y);
  y += 10;

  // Totals
  const totalX = 140;
  doc.setFontSize(10);
  doc.text("Sub Total:", totalX, y);
  doc.text(`INR ${invoice.subTotal.toLocaleString()}`, 170, y, { align: 'right' });
  y += 6;
  doc.text("Total GST:", totalX, y);
  doc.text(`INR ${invoice.totalGst.toLocaleString()}`, 170, y, { align: 'right' });
  y += 8;
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text("Grand Total:", totalX, y);
  doc.text(`INR ${invoice.grandTotal.toLocaleString()}`, 170, y, { align: 'right' });

  // Footer
  y += 30;
  if (invoice.notes) {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Notes:", margin, y);
    y += 5;
    const splitNotes = doc.splitTextToSize(invoice.notes, 170);
    doc.text(splitNotes, margin, y);
  }

  doc.save(`${invoice.invoiceNumber}.pdf`);
};
