const jwt = require("jsonwebtoken");
const prisma = require("../db");

exports.verifyToken = async (req, res, next) => {
  try {
    // 1. Retrieve token from authHeaders
    const token = req.headers?.authorization?.split(" ")[1];

    // 2. No token return the user

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // 3. Token validity check
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check token owner exist and isBlocked

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { isBlocked: true },
    });

    // 5. No user or if user is blocked return

    if (!user || user.isBlocked) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // 6. Set decoded info in req.user
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized access" });
  }
};
