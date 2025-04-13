const db = require("../db");
const admin = require("../firebase-admin");

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(200).json({ error: "Internal server error" });
  }
};
// GET USER BY ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length > 0) {
      // User found send user data
      res.json(result.rows[0]);
    } else {
      // No user found.
      return res.status(404).json({ error: "No user found" });
    }
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET USER ROLE

exports.getUserRole = async (req, res, next) => {
  const email = req.params.email;
  try {
    const result = await db.query("SELECT role FROM users WHERE email = $1", [
      email,
    ]);
    res.status(200).json({ result: result.rows[0]?.role || "user" });
  } catch (error) {
    console.log("Fetching role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH BLOCK/UNBLOCK

exports.blockUsers = async (req, res) => {
  const { userIds, is_blocked } = req.body;
  console.log(userIds, is_blocked, "Block status API");

  try {
    const userResult = await db.query("SELECT * FROM users");
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }
    const result = await db.query(
      "UPDATE users SET is_blocked = $1 WHERE id = ANY($2::int[]) RETURNING *",
      [is_blocked, userIds]
    );
    res
      .status(200)
      .json({ message: "Block status updated.", results: result.rows });
  } catch (error) {
    console.log("Error update block status");
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH ROLE CHANGE

exports.updateUserRole = async (req, res) => {
  const { role, userIds } = req.body;
  try {
    const userResult = await db.query("SELECT * FROM users");
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }
    const result = await db.query(
      "UPDATE users SET role = $1 WHERE id = ANY($2::int[]) RETURNING *",
      [role, userIds]
    );
    res
      .status(200)
      .json({ message: "User role changed.", results: result.rows });
  } catch (error) {
    console.log("Error changing role", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE USER(S)
exports.deleteUsers = async (req, res) => {
  const userIds = req.body.ids; // ARRAY OF IDs
  try {
    // Get uid's from PostgreSQL DB.
    const uidResult = await db.query(
      "SELECT uid FROM users WHERE id = ANY($1::int[])",
      [userIds]
    );
    const uIDs = uidResult.rows.map((row) => row.uid);
    if (uIDs.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }
    // Delete user from FIREBASE
    const firebaseResult = await admin.auth().deleteUsers(uIDs);
    if (firebaseResult.failureCount > 0) {
      const errors = firebaseResult.errors.map((err) => ({
        uid: err.uid,
        error: err.error.message,
      }));
      return rs.status(500).json({
        error: "Partial deletion failure",
        details: errors,
      });
    }

    // SQL query for delete from DB
    const result = await db.query(
      "DELETE FROM users WHERE id = ANY($1::int[]) RETURNING *",
      [userIds]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No user found" });
    }
    res.status(200).json({ message: "User(s) deleted.", results: result.rows });
  } catch (error) {
    console.log("Error deleting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
