const Hotel = require("../models/Hotel");

exports.submitHotel = async (req, res) => {
  try {
    const { name, location, description, pricePerNight, amenities } = req.body;

    if (!name || !location || !description || !pricePerNight) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const hotelName = name.replace(/\s+/g, "-").toLowerCase(); // Generate folder name
    const imagePaths = req.files.map(file => `${hotelName}/${file.filename}`); // Save relative paths

    const newHotel = new Hotel({
      name,
      location,
      description,
      pricePerNight,
      amenities: amenities ? amenities.split(",") : [],
      images: imagePaths, // Save image paths relative to /uploads
      status: "pending"
    });

    await newHotel.save();
    res.status(201).json({ message: "Hotel submitted for approval.", hotel: newHotel });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
