const User = require('../models/Users');
const jwt = require('jsonwebtoken');

const getUserProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user.userId).select('-password'); // Exclude password
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } 
  catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    let { name, email, password, contact, address } = req.body;

    // Normalize email
    email = email.trim().toLowerCase();

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email Already Registered' });
    }

    // Create a new user (password stored as plain text)
    user = new User({ name, email, password, contact, address });
    await user.save();

    // Send success response
    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const LoginUser = async (req, res) => {
  try {
    // console.log("Received request body:", req.body); // Debug log

    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }

    // Normalize email for consistency
    email = email.trim().toLowerCase();

    // Find user in DB
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    const token = jwt.sign({ userId: user._id , role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    console.log(`user.role`);
  } 
  catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { registerUser, LoginUser,getUserProfile};
