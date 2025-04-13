const jwt = require("jsonwebtoken");
const db = require("../db");
exports.verifyToken = async (req, res, next) => {
  try {
    // ১. টোকেন হেডার থেকে নিন
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    // ২. if no token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // ৩. Verify token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token", decoded);

    // 4. Database check

    const user = await db.query("SELECT is_blocked FROM users WHERE id = $1", [
      decoded.id,
    ]);

    if (!user.rows[0] || user.rows[0].is_blocked) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized access" });
  }
};
