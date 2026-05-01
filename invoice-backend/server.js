const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const invoiceRoutes = require('./routes/invoiceRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// ✅ CORS (ONLY ONCE)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://invoice-billing-v6xt.onrender.com"
  ],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/profile', profileRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// ✅ MongoDB (USE ENV VARIABLE)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});