const invoiceRoutes = require('./routes/invoiceRoutes');
const profileRoutes = require('./routes/profileRoutes');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/invoices', invoiceRoutes);
app.use('/api/profile', profileRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/invoiceDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});