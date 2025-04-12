const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
// User management routes

router.get("/", verifyToken, userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/block", userController.blockUsers);
router.patch("/role", userController.updateUserRole);
router.delete("/", userController.deleteUsers);

module.exports = router;
