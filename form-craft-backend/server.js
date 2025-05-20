const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = require("./app");

// Import routes

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const templateRoutes = require("./routes/templateRoutes");
const topicRoutes = require("./routes/topicRoutes");
const tagRoutes = require("./routes/tagRoutes");
const salesforceRoutes = require("./routes/salesforceRoutes");
// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://form-craft-152302.web.app",
      "https://form-craft-152302.firebaseapp.com",
    ],
  })
);

// Routes handlers
app.use("/api/salesforce", salesforceRoutes);
app.use("/api/users", userRoutes);
app.use("/api", authRoutes);
app.use("/api", templateRoutes);
app.use("/api", topicRoutes);
app.use("/api", tagRoutes);
// Default /
app.get("/", (req, res) => {
  res.send("Hello server!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀Form craft running on port...${PORT}`);
});
