const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Hotel = require("../models/Hotels");
const Booking = require("../models/Booking");
const { isAuthenticated, isAdmin,verifyToken } = require('../middlewares/auth');

// Get all users (Admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Make a user admin (Admin only)
router.put('/make-admin/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = "admin";
    await user.save();
    res.json({ message: "User is now an admin", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Delete a user (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


// New endpoint: GET /api/users/profile/:userId
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("name address email contact role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});



router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name address email contact");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

router.get("/my-hotels", verifyToken, async (req, res) => {
  try {
    const hotels = await Hotel.find({ listedBy: req.user.id });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hotels", error: error.message });
  }
});

router.get("/my-bookings", verifyToken, async (req, res) => {
  // Alternatively, you can extract req.user.id from the token instead of a URL param
  try {
    const bookings = await Booking.find({ userId: req.params.id }).populate("hotel");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
});

module.exports = router;
