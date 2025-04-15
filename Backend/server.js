const dotenv = require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/login_db");
const authRoutes = require("./routes/authRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");
const paymentRoutes = require('./routes/PaymentRoutes');
const bookingRoutes = require('./routes/BookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// ✅ Correct CORS Middleware (Fixing the issue)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend
    credentials: true, // Allow cookies and authentication
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Setup Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api', paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Start Server
app.listen(PORT, () => console.log(`Listening to Port ${PORT}`));
