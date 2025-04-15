const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/dashboard", isAuthenticated, isAdmin, (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

module.exports = router;
