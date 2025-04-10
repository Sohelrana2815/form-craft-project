const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Authentication-related routes
app.post("/signup", authController.signupUser);
app.patch("/login/:email", authController.updateLogin);

module.exports = router;
