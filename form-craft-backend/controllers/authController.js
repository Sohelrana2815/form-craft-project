const jwt = require("jsonwebtoken");
const prisma = require("../db");
const admin = require("../firebase-admin/firebase-admin-config");

exports.signupUser = async (req, res) => {
  const { username, email, uid } = req.body;
  console.log("Received signup data:", { username, email, uid });
  // Basic validation: Ensure essential fields are provided

  if (!username || !email || !uid) {
    return res
      .status(400)
      .json({ message: "Username, email and UID are required." });
  }

  try {
    // Create user in PostgreSQL DB via Prisma
    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        uid: uid, // Firebase UID
        // createdAt, role and isBlocked will be handled by schema defaults
      },
      select: {
        id: true,
        username: true,
        email: true,
        uid: true,
        role: true,
        isBlocked: true,
      },
    });
    res
      .status(201)
      .json({ message: "User created successfully in PostgreSQL DB." });
  } catch (err) {
    console.error("Error creating in database:", err);
    // Unique constraint violation
    if (err.code === "P2002") {
      try {
        await admin.auth().deleteUser(uid);
        // console.log(
        //   `Firebase user with UID ${uid} deleted due to database conflict.`
        // );
        return res.status(409).json({
          message:
            "User already exists in the database. Firebase user deleted to resolve conflict. Please try signing up again.",
          error: "Email or UID already exists.",
        });
      } catch (firebaseError) {
        console.error("Firebase user deletion failed:", firebaseError);
        // If Firebase deletion also fails, it's a critical inconsistency.
        return res.status(500).json({
          message:
            "Database conflict detected, but failed to delete user from Firebase. Manual intervention may be required.",
          error: "Failed to synchronize user deletion with Firebase.",
        });
      }
    } else {
      // Handle other potential database errors
      return res
        .status(500)
        .json({ message: "Internal server error during user creation." });
    }
  }
};

exports.checkUserStatus = async (req, res) => {
  const userEmail = req.params.email;
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { isBlocked: true },
    });
    if (!user) {
      return res.status(404).json({ error: "No user found." });
    }
    if (user.isBlocked) {
      return res.status(403).json({ error: "User is Blocked" });
    }
    res.status(200).json({ status: "active" });
  } catch (err) {
    console.error("Status check failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateLastLogin = async (req, res) => {
  const userEmail = req.params.email;
  // console.log("User email in the updateLogin API:", userEmail);
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

    // 3. Update lastLogin timestamp
    const updateTimestamp = await prisma.user.update({
      where: { email: userEmail },
      data: { lastLogin: new Date() },
      select: {
        lastLogin: true,
      },
    });
    res.status(200).json(updateTimestamp);
  } catch (err) {
    console.error("Failed to update lastLogin:", err);
  }
  res.status(500).json({ error: "Internal server error" });
};

exports.generateJwtToken = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  try {
    // 1. Find user from DB
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, uid: true, isBlocked: true, email: true },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // 2. Check user block or not
    if (user.isBlocked) {
      return res.status(403).json({ error: "User is blocked!" });
    }
    // 3. JWT token generate

    const token = jwt.sign(
      {
        id: user.id,
        uid: user.uid,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    console.error("Token generation failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
