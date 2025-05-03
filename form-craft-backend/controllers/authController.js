const jwt = require("jsonwebtoken");
const prisma = require("../db");
const admin = require("../firebase-admin/firebase-admin-config");

exports.signupUser = async (req, res) => {
  const { name, email, uid } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { name, email, uid },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "P2002") {
      try {
        await admin.auth().deleteUser(uid);
        return res.status(409).json({ error: "This Email already exist!" });
      } catch (firebaseError) {
        console.error("Firebase user delete failed.", firebaseError);
        res.status(500).json({
          error: "Email conflict failed to delete firebase error",
        });

        res.status(500).json({ error: "Internal server error" });
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

    // If already exist user name & email in DB, then return the user
    if (existingEmail) {
      return res.status(409).json({ error: "This email already exist!" });
    }
    if (existingName) {
      return res.status(409).json({ error: "This name is already taken." });
    }

    // No conflict

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Conflict check error:", error);
    res.status(500).json({ error: error.message });
  }
};

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
        lastLogin: true,
      },
    });

    res.status(200).json(updateUser);
  } catch (error) {
    console.error("Failed update last login:", error);
    // Prisma error
    if (error.code === "P2025") {
      return res.status(404).json({ error: "No user found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.generateToken = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    //1. Find user from Database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, uid: true, isBlocked: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2. Check the user is blocked or not
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
      { expiresIn: "8h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Token generation failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
