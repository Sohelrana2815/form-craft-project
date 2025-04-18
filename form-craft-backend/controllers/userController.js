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
  const { role, userIds } = req.body; // get role and userIds form client

  try {
    // Check user is available for this received ids form client side
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });
    if (users.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }
    const updated = await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { role },
    });

    res.status(200).json({
      message: "User role updated!",
      results: updated,
    });
  } catch (error) {
    console.error("Error update role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE USER(S)
exports.deleteUsers = async (req, res) => {
  const userIds = req.body.ids;

  try {
    const usersToDelete = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, uid: true },
    });

    if (usersToDelete.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }

    const uIds = usersToDelete.map((u) => u.uid);

    const firebaseResult = await admin.auth().deleteUsers(uIds);

     




  } catch (error) {}
};
