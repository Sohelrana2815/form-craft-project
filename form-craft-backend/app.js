const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
// middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

app.get("/api/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users", error);
  }
});

app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM users WHERE id= $1", [userId]);
    if (result.rows.length > 0) {
      // User found, send the user data
      res.json(result.rows[0]);
    } else {
      // User not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // email unique error
      res.status(400).json({ error: "Email already exist" });
    } else {
      console.error("Error inserting user:", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await db.query("DELETE FROM users WHERE id= $1", [userId]);
    if (result.rowCount > 0) {
      // User successfully deleted
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      // No user found
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error ");
    res.status(500).json({ error: "Internal server error", error });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  try {
    const checkUser = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user

    const result = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === 23505) {
      return res.status(409).json({ error: "Email address already in use." });
    } else {
      console.error("Error update user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
