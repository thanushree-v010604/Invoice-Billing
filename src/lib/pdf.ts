import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { type Invoice, type BusinessProfile } from '../types';

export const generateInvoicePDF = async (invoice: Invoice, profile: BusinessProfile) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // SAFE HELPERS
  const safeText = (val: any) => String(val || "");
  const safeNumber = (val: any) => Number(val || 0).toLocaleString();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229);
  doc.text("TAX INVOICE", margin, y);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`#${safeText(invoice.invoiceNumber)}`, 160, y);
  y += 10;

  // Business Info
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(safeText(profile?.name), margin, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(safeText(profile?.address), margin, y);
  y += 5;

  doc.text(`GSTIN: ${safeText(profile?.gstin)}`, margin, y);
  y += 5;

  doc.text(
    `Email: ${safeText(profile?.email)} | Phone: ${safeText(profile?.phone)}`,
    margin,
    y
  );
  y += 15;

  // Line
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, 190, y);
  y += 10;

  // Customer Info
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Bill To:", margin, y);
  y += 6;

  doc.setFontSize(10);
  doc.text(safeText(invoice.customerName), margin, y);
  y += 5;

  doc.setTextColor(71, 85, 105);
  doc.text(safeText(invoice.customerAddress), margin, y);
  y += 5;

  doc.text(`GSTIN: ${safeText(invoice.customerGstin)}`, margin, y);

  // Dates (SAFE)
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Date: ${format(new Date(invoice.date || Date.now()), 'dd/MM/yyyy')}`,
    140,
    y - 10
  );
  doc.text(
    `Due Date: ${format(new Date(invoice.dueDate || Date.now()), 'dd/MM/yyyy')}`,
    140,
    y - 5
  );

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

  // Items (SAFE)
  doc.setTextColor(15, 23, 42);

  (invoice.items || []).forEach((item: any) => {
    doc.text(safeText(item?.description), margin + 2, y);
    doc.text(safeText(item?.hsnCode), margin + 60, y);
    doc.text(safeText(item?.quantity), margin + 80, y);
    doc.text(safeNumber(item?.rate), margin + 100, y);
    doc.text(`${safeText(item?.gstRate)}%`, margin + 125, y);
    doc.text(safeNumber(item?.total), margin + 150, y);

    y += 8;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  y += 10;
  doc.line(margin, y, 190, y);
  y += 10;

  // Totals (SAFE)
  const totalX = 120;
  const valueX = 190; // right aligned edge

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.line(110, y - 5, 190, y - 5);

  // Subtotal
  doc.text("Sub Total:", totalX, y);
  doc.text(`INR ${safeNumber(invoice.subTotal)}`, valueX, y, { align: 'right' });

  y += 8;

  // GST
  doc.text("Total GST:", totalX, y);
  doc.text(`INR ${safeNumber(invoice.totalGst)}`, valueX, y, { align: 'right' });

  y += 10;

  // Grand Total (highlight)
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);

  doc.text("Grand Total:", totalX, y);
  doc.text(`INR ${safeNumber(invoice.grandTotal)}`, valueX, y, { align: 'right' });
  // Notes (SAFE)
  y += 30;

  if (invoice.notes) {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);

    doc.text("Notes:", margin, y);
    y += 5;

    const splitNotes = doc.splitTextToSize(safeText(invoice.notes), 170);
    doc.text(splitNotes, margin, y);
  }

  // Save
  doc.save(`${safeText(invoice.invoiceNumber) || "invoice"}.pdf`);
};