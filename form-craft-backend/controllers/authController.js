const jwt = require("jsonwebtoken");
const prisma = require("../db");
const admin = require("../firebase-admin/firebase-admin-config");

exports.signupUser = async (req, res) => {
  const { name, email, uid } = req.body;
  console.log(name, email, uid);

  try {
    const newUser = await prisma.user.create({
      data: { name, email, uid },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "P2002") {
      try {
        // Delete user form firebase
        await admin.auth().deleteUser(uid);
        res.status(409).json({
          error: "Email already exist. Firebase!",
        });
      } catch (firebaseError) {
        console.error("Firebase deletion failed.", firebaseError);
        res.status(500).json({
          error: "Email conflict failed to delete firebase user",
        });
      }
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.checkConflict = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check for existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    // Check for existing name

    const existingName = await prisma.user.findUnique({
      where: { name },
      select: { name: true },
    });

    // Conflict handling

    if (existingEmail) {
      return res.status(409).json({ error: "This email already used" });
    }

    if (existingName) {
      return res.status(409).json({ error: "This name is already taken" });
    }

    // No conflict

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Conflict check error", error);
    res.status(500).json({ error: error.message });
  }
};

// exports.updateLogin = async (req, res) => {
//   const userEmail = req.params.email;

//   try {
//     const checkUser = await db.query(
//       "SELECT id, uid, is_blocked FROM users WHERE email = $1",
//       [userEmail]
//     );
//     if (checkUser.rowCount === 0) {
//       return res.status(404).json({ error: "No user found" });
//     }
//     const user = checkUser.rows[0];
//     if (user.is_blocked) {
//       return res.status(403).json({ error: "User is blocked" });
//     }

//     const result = await db.query(
//       "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1 RETURNING *",
//       [userEmail]
//     );

//     // Generate jwt token

//     const token = jwt.sign(
//       {
//         uid: user.uid,
//         email: user.email,
//         id: user.id,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       token,
//       user: result.rows[0],
//     });
//   } catch (error) {
//     console.log("Error update last login", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.updateLogin = async (req, res) => {
  const userEmail = req.params.email;

  try {
    // 1. Find user

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, uid: true, isBlocked: true, email: true },
    });
    if (!user) {
      return res.status(404).json({ error: "No user found." });
    }

    // 2. Block check

    if (user.isBlocked) {
      return res.status(403).json({ error: "User is blocked!" });
    }

    // 3. Last login update

    const updateUser = await prisma.user.update({
      where: { email: userEmail },
      data: { lastLogin: new Date() },
      select: {
        id: true,
        email: true,
        uid: true,
        lastLogin: true,
      },
    });

    // 4. JWT token generate

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
      user: updateUser,
    });
  } catch (error) {
    console.error("Failed update last login:", error);
    // Prisma error
    if (error.code === "P2025") {
      return res.status(404).json({ error: "No user found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
