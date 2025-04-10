const db = require("../db");

exports.signupUser = async (req, res) => {
  const { name, email, uid } = req.body;
  console.log(name, email, uid);

  try {
    const result = await db.query(
      "INSERT INTO users (name, email, uid) VALUES ($1, $2, $3) RETURNING *",
      [name, email, uid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === 23505) {
      // Email unique error code
      return res.status(409).json({ error: "Email already in use." });
    } else {
      console.log("Error inserting users data.", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

exports.updateLogin = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const checkUser = await db.query(
      "SELECT is_blocked FROM users WHERE email = $1",
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
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log("Error update last login", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
