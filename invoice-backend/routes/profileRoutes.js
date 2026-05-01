const verifyToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

const Profile = require('../models/Profile');
const Invoice = require('../models/Invoice');
const admin = require('../firebaseAdmin');

// GET user profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.uid });
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE or UPDATE profile
router.post('/', verifyToken, async (req, res) => {
  try {
    const existingProfile = await Profile.findOne({ userId: req.user.uid });

    if (existingProfile) {
      // Update existing profile
      const updated = await Profile.findOneAndUpdate(
        { userId: req.user.uid },
        {
          ...req.body,
          userId: req.user.uid
        },
        { new: true }
      );
      return res.json(updated);
    }

    // Create new profile
    const profile = new Profile({
      ...req.body,
      userId: req.user.uid
    });

    const saved = await profile.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE profile
router.put('/', verifyToken, async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { userId: req.user.uid },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE account + associated data
router.delete('/', verifyToken, async (req, res) => {
  try {
    await Invoice.deleteMany({ userId: req.user.uid });
    await Profile.deleteOne({ userId: req.user.uid });
    await admin.auth().deleteUser(req.user.uid);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
