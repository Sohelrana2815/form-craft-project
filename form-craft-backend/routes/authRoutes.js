const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Authentication-related routes
router.post("/signup", authController.signupUser);
router.patch("/login/:email", authController.updateLogin);

module.exports = router;
