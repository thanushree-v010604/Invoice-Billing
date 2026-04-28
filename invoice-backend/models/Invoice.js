const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: String,
  hsnCode: String,
  quantity: Number,
  rate: Number,
  gstRate: Number,
  total: Number
});

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  customerName: String,
  customerAddress: String,
  customerGstin: String,
  date: String,
  dueDate: String,
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'overdue'],
    default: 'unpaid'
  },

  items: [itemSchema],

  subTotal: Number,
  totalGst: Number,
  grandTotal: Number,

  notes: String

}, { timestamps: true });


module.exports = mongoose.model('Invoice', invoiceSchema);