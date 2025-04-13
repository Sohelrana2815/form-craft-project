const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const { verifyAdmin } = require("../middleware/adminMiddleware");
// User management routes

router.get("/", verifyToken, verifyAdmin, userController.getUsers);
router.get("/:id", userController.getUserById);
router.get("/role/:email", userController.getUserRole);
router.patch("/block", verifyToken, verifyAdmin, userController.blockUsers);
router.patch("/role", verifyToken, verifyAdmin, userController.updateUserRole);
router.delete("/", verifyToken, verifyAdmin, userController.deleteUsers);

module.exports = router;
