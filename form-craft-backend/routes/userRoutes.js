const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User management routes

app.get("/", userController.getUser);
app.get("/:id", userController.getUserById);
app.patch("/block", userController.blockUsers);
app.patch("/role", userController.updateUserRole);
app.delete("/", userController.deleteUsers);

module.exports = router;
