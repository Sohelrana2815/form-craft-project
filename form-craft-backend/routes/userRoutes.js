const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User management routes

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/block", userController.blockUsers);
router.patch("/role", userController.updateUserRole);
router.delete("/", userController.deleteUsers);

module.exports = router;
