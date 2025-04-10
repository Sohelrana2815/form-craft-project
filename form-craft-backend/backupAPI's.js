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
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/signup", async (req, res) => {
  const { name, email, uid } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users (name, email, uid) VALUES ($1, $2, $3) RETURNING *",
      [name, email, uid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === 23505) {
      // email unique error
      res.status(400).json({ error: "Email already exist" });
    } else {
      console.error("Error inserting user:", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  }
});

// app.patch("/api/login/:email", async (req, res) => {
//   const userEmail = req.params.email;
//   try {
//     // First, check if the user exists and is not blocked
//     const userResult = await db.query(
//       "SELECT is_blocked FROM users WHERE email = $1",
//       [userEmail]
//     );
//     console.log(userResult.rows);

//     if (userResult.rowCount === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const user = userResult.rows[0];

//     if (user.is_blocked) {
//       return res.status(403).json({ message: "User is blocked" });
//     }

//     const result = await db.query(
//       "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1 RETURNING *",
//       [userEmail]
//     );

//     res.status(200).json({
//       message: "Last login updated successfully",
//       user: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Error while update login:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.delete("/api/users/:id", async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const result = await db.query("DELETE FROM users WHERE id= $1", [userId]);
//     if (result.rowCount > 0) {
//       // User successfully deleted
//       return res.status(200).json({ message: "User deleted successfully" });
//     } else {
//       // No user found
//       return res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error ");
//     res.status(500).json({ error: "Internal server error", error });
//   }
// });

app.patch("/api/users/block", async (req, res) => {
  const { userIds, is_blocked } = req.body;
  // console.log(ids.userIds);
  console.log("userIds from post man", userIds, is_blocked);

  try {
    const userResult = await db.query("SELECT * FROM users");
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    const result = await db.query(
      "UPDATE users SET is_blocked = $1 WHERE id = ANY($2::int[]) RETURNING *",
      [is_blocked, userIds]
    );
    res.status(200).json({
      message: "Block status updated Successfully",
      usersResult: result.rows,
    });
  } catch (error) {
    console.log("Error update block status");
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/users/role", async (req, res) => {
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
      .json({ message: "User role changed successfully!", data: result.rows });
  } catch (error) {
    console.log("Error changing role");
    res.status(500).json({ error: "Internal server error" });
  }
});

// try {
//   // SQL query for block/unblock mul
//   const result = await db.query(
//     "UPDATE users SET is_blocked = $1 WHERE id = ANY($2 :: int[]) RETURNING *",
//     [is_blocked, userIds]
//   );
//   if (result.rowCount === 0) {
//     return res.status(404).json({ error: "No users found to block/unblock" });
//   }

//   res.status(200).json({
//     message: `${result.rowCount} successfully block/unblock `,
//     user: result.rows,
//   });
// } catch (error) {
//   console.log("Error updating block status:", error);
//   res.status(500).json({ error: "Internal server error" });
// }

app.patch("/api/login/:email", async (req, res) => {
  const userEmail = req.params.email;
  console.log(userEmail);

  try {
    const checkUser = await db.query(
      "SELECT is_blocked FROM users WHERE email = $1",
      [userEmail]
    );

    if (checkUser.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = checkUser.rows[0];
    if (user.is_blocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    const result = await db.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1 RETURNING *",
      [userEmail]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log("Error while update last login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/users", async (req, res) => {
  const userIds = req.body.ids; // Array of IDs
  try {
    // Get UIDs from PostgreSQL
    const uidResult = await db.query(
      "SELECT uid FROM users WHERE id = ANY($1::int[])",
      [userIds]
    );
    const uIDs = uidResult.rows.map((row) => row.uid);
    if (uIDs.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }

    // Delete from Firebase

    const firebaseResult = await admin.auth().deleteUsers(uIDs);

    if (firebaseResult.failureCount > 0) {
      const errors = firebaseResult.errors.map((err) => ({
        uid: err.uid,
        error: err.error.message,
      }));
      return res.status(500).json({
        error: "Partial deletion failure",
        details: errors,
      });
    }

    // SQL query for delete many users
    const result = await db.query(
      // ANY CHECK THAT THE VALUE/IDs IS INSIDE THE ARRAY OR NOT.
      "DELETE FROM users WHERE id = ANY($1::int[]) RETURNING *",
      [userIds]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No users found to delete" });
    }
    res.status(200).json({
      message: `${result.rowCount} user(s) deleted successfully!`,
      deletedUsers: result.rows,
    });
  } catch (error) {
    console.log("Error deleting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
