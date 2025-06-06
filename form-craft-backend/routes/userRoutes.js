const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyAdmin } = require("../middleware/adminMiddleware");

// User management routes

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.get("/role/:email", userController.getUserRole);
router.patch("/block", userController.blockUsers);
router.patch("/role", userController.updateUserRole);
router.delete("/", userController.deleteUsers);

module.exports = router;
