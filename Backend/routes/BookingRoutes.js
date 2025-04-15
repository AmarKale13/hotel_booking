// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

// GET booking details by session id (for payment success page)
router.get('/session/:sessionId', isAuthenticated, async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const booking = await Booking.findOne({ sessionId }).populate('hotel').populate('user');
    if (!booking) {
        console.log("Booking not found for session ID:", sessionId);
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } 
  catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all bookings (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('hotel').populate('user');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
