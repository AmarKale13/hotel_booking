const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotels');
const upload = require("../middlewares/multer");
const { isAdmin, isAuthenticated , verifyToken} = require('../middlewares/auth');
const fs = require("fs");
const path = require("path");

// Submit a hotel with image upload
// DELETE an approved hotel (Admin only)

// GET /api/hotels/:id - Get hotel details by ID


  router.post("/submit", verifyToken, upload.array("images", 5), async (req, res) => {
    try {
        console.log(req);
      const { name, location, mapLink, description, pricePerNight, amenities, contactEmail, contactNumber } = req.body;
  
      const imagePaths = req.files.map(file =>
        file.path.replace(/\\/g, "/").replace(/^.*\/uploads\//, "")
      );
        
      // Create new hotel with required fields including listedBy from req.user.id
      const newHotel = new Hotel({
        name,
        location,
        mapLink,
        description,
        pricePerNight,
        amenities: amenities ? amenities.split(",") : [],
        images: imagePaths,
        contactEmail,
        contactNumber,
        approved: false
      });

      await newHotel.save();
      res.status(201).json({ message: "Property submitted for approval", hotel: newHotel });
    } catch (error) {
      console.error("Error submitting property:", error.message);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });

router.get('/hotel-requests', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const pendingHotels = await Hotel.find({ approved: false });
        res.status(200).json(pendingHotels);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Approve a hotel
router.put('/approve/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel Not Found' });
        }
        hotel.approved = true;
        await hotel.save();
        res.json({ message: 'Hotel approved successfully', hotel });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Disapprove (delete) a hotel and its images
router.delete('/disapprove/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) {
            return res.status(404).json({ message: 'Hotel Not Found' });
        }
        
        // Delete images from filesystem
        hotel.images.forEach(imagePath => {
            const fullPath = path.join(__dirname, "../uploads", imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
              }
            });

            // Delete hotel from database
        await Hotel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hotel disapproved and deleted successfully' });
        
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Get approved hotels (publicly accessible)
router.get('/approved', async (req, res) => {
    try {
      const approvedHotels = await Hotel.find({ approved: true });
        res.json(approvedHotels);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.status(200).json(hotel);
    } catch (error) {
      console.error("Error in GET /api/hotels/:id", err);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
      try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) {
          return res.status(404).json({ message: 'Hotel Not Found' });
        }
        res.json({ message: 'Hotel deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
    });
  
module.exports = router;
