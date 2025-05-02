const prisma = require("../db");

exports.verifyAdmin = async (req, res, next) => {
  try {
    // 1. User id form verifyToken (req.user = decoded)
    const userId = req.user.id;
    // 2. Find user with decoded id
    // console.log(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // 3. No user or user role filed !== "admin" (return)
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // 4. If all test passed go to next middleware
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
