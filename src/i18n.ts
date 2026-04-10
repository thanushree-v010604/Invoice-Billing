import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      invoices: 'Invoices',
      newInvoice: 'New Invoice',
      settings: 'Settings',
      reports: 'Reports',
      businessName: 'Business Name',
      gstin: 'GSTIN',
      address: 'Address',
      email: 'Email',
      phone: 'Phone',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      invoiceNumber: 'Invoice Number',
      date: 'Date',
      dueDate: 'Due Date',
      customerName: 'Customer Name',
      customerGstin: 'Customer GSTIN',
      customerAddress: 'Customer Address',
      description: 'Description',
      hsnCode: 'HSN/SAC',
      quantity: 'Qty',
      rate: 'Rate',
      gst: 'GST %',
      amount: 'Amount',
      subTotal: 'Sub Total',
      totalGst: 'Total GST',
      grandTotal: 'Grand Total',
      notes: 'Notes',
      paid: 'Paid',
      unpaid: 'Unpaid',
      overdue: 'Overdue',
      generatePdf: 'Generate PDF',
      recentInvoices: 'Recent Invoices',
      totalRevenue: 'Total Revenue',
      pendingPayments: 'Pending Payments',
      language: 'Language',
      businessProfile: 'Business Profile'
    }
  },
  hi: {
    translation: {
      dashboard: 'डैशबोर्ड',
      invoices: 'चालान (Invoices)',
      newInvoice: 'नया चालान',
      settings: 'सेटिंग्स',
      reports: 'रिपोर्ट्स',
      businessName: 'व्यापार का नाम',
      gstin: 'GSTIN',
      address: 'पता',
      email: 'ईमेल',
      phone: 'फोन',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      invoiceNumber: 'चालान संख्या',
      date: 'तारीख',
      dueDate: 'नियत तारीख',
      customerName: 'ग्राहक का नाम',
      customerGstin: 'ग्राहक का GSTIN',
      customerAddress: 'ग्राहक का पता',
      description: 'विवरण',
      hsnCode: 'HSN/SAC',
      quantity: 'मात्रा',
      rate: 'दर',
      gst: 'GST %',
      amount: 'राशि',
      subTotal: 'कुल राशि',
      totalGst: 'कुल GST',
      grandTotal: 'कुल योग',
      notes: 'नोट्स',
      paid: 'भुगतान किया गया',
      unpaid: 'अवैतनिक',
      overdue: 'विलंबित',
      generatePdf: 'PDF बनाएं',
      recentInvoices: 'हाल के चालान',
      totalRevenue: 'कुल राजस्व',
      pendingPayments: 'लंबित भुगतान',
      language: 'भाषा',
      businessProfile: 'व्यापार प्रोफ़ाइल'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
