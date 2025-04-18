const prisma = require("../db");
const admin = require("../firebase-admin");

// GET ALL USERS

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET USER BY ID

exports.getUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      // If no user 404 return
      return res.status(404).json({ error: "No user found" });
    }
    // if success

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by Id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET USER ROLE

exports.getUserRole = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (!user) {
      // No user
      return res.status(404).json({ error: "No user found" });
    }
    // If success send user role

    res.status(200).json({ userRole: user.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH BLOCK/UNBLOCK

exports.blockUsers = async (req, res) => {
  const { userIds, is_blocked } = req.body;

  try {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    if (users.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }

    const updated = await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { isBlocked: is_blocked },
    });

    res.status(200).json({
      message: "Block status updated",
      results: updated,
    });
  } catch (error) {
    console.error("Error update block status:", error);
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
