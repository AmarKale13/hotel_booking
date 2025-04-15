const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const isAuthenticated = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded token:", decoded);
        // console.log("User authenticated:", decoded);
        req.user = decoded;
        // console.log("Decoded");
        next();
    } catch (error) {
        console.log("Invalid or expired token:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        console.log("Decoded req.user in isAdmin:", req.user); // Debug log to see token details

        const user = await User.findById(req.user.userId);
        if (!user) {
            console.log("User not found for id:", req.user.userId);
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        console.log("Found user in DB:", user);

        if (user.role !== 'admin') {
            console.log("User role is not admin. It is:", user.role);
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        
        console.log("User is Admin");
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId =decoded.userId;
      req.role = decoded.role;
      console.log(req.userId, "User ID from token in verifyToken middleware");
      next();
    } catch (error) {
      res.status(401).json({ message: "Token invalid or expired" });
    }
  };


module.exports = { isAuthenticated,isAdmin,verifyToken };
