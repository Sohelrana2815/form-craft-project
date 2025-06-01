const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Authentication-related routes
router.post("/signup", authController.signupUser);
router.post("/jwt", authController.generateJwtToken);
router.get("/user-status/:email", authController.checkUserStatus);
router.patch("/login/:email", authController.updateLastLogin);
module.exports = router;
