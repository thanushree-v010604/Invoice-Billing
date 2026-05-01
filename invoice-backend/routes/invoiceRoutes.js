const verifyToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

const Invoice = require('../models/Invoice');

// CREATE
router.post('/', verifyToken, async (req, res) => {
  try {
    if (!req.body.invoiceNumber) {
      return res.status(400).json({ error: "invoiceNumber is required" });
    }

    const invoice = new Invoice({
      ...req.body,
      userId: req.user.uid
    });

    const saved = await invoice.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL
router.get('/', verifyToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.uid });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ONE
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.uid
    });

    if (!invoice) return res.status(404).json({ error: "Not found" });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;