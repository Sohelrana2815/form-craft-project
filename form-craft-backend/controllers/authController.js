const jwt = require("jsonwebtoken");
const db = require("../db");
const admin = require("firebase-admin");

exports.signupUser = async (req, res) => {
  const { name, email, uid } = req.body;
  console.log(name, email, uid);

  try {
    // 1. Insert into database first
    const result = await db.query(
      "INSERT INTO users (name, email, uid) VALUES ($1, $2, $3) RETURNING *",
      [name, email, uid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      try {
        await admin.auth().deleteUser(uid);
      } catch (firebaseError) {
        console.error("Firebase Error", firebaseError);
      }
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.checkConflict = async (req, res) => {
  const { name, email } = req.body;
  console.log(name, email);

  try {
    // Check for existing email
    const emailCheck = await db.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );

    // Check for existing name

    const nameCheck = await db.query("SELECT name FROM users WHERE name = $1", [
      name,
    ]);

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: "Email already exists!" });
    }

    if (nameCheck.rows.length > 0) {
      return res.status(409).json({ error: "Name already taken!" });
    }
    // No conflict found
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateLogin = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const checkUser = await db.query(
      "SELECT id, uid, is_blocked FROM users WHERE email = $1",
      [userEmail]
    );
    if (checkUser.rowCount === 0) {
      return res.status(404).json({ error: "No user found" });
    }
    const user = checkUser.rows[0];
    if (user.is_blocked) {
      return res.status(403).json({ error: "User is blocked" });
    }

    const result = await db.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1 RETURNING *",
      [userEmail]
    );

    // Generate jwt token

    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: result.rows[0],
    });
  } catch (error) {
    console.log("Error update last login", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
