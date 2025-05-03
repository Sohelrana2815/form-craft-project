const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Authentication-related routes
router.post("/signup", authController.signupUser);
router.post("/jwt", authController.generateToken);
router.patch("/login/:email", authController.updateLogin);
router.post("/check-user", authController.checkConflict);
module.exports = router;
