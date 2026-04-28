require('dotenv').config();

const invoiceRoutes = require('./routes/invoiceRoutes');
const profileRoutes = require('./routes/profileRoutes');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/invoices', invoiceRoutes);
app.use('/api/profile', profileRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Connect MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/invoiceDB';
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});