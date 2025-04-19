const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();

// Import routes

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://form-craft-152302.web.app",
      "vercel", // new frontend url
    ],
  })
);

// Routes handlers
app.use("/api/users", userRoutes);
app.use("/api", authRoutes);

app.listen(3000, () => {
  console.log(`server running`);
});
