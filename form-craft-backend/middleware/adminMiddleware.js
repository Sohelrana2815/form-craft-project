const db = require("../db");

exports.verifyAdmin = async (req, res, next) => {
  try {
    // ১. টোকেন থেকে ইউজার আইডি নিন (verifyToken মিডলওয়্যার থেকে প্রাপ্ত)
    const userId = req.user.id;
    console.log("From admin middleware:", req.user);

    // ২. ডেটাবেস থেকে ইউজারের রোল চেক করুন
    const userRole = await db.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);
    // ৩. ইউজার না পেলে বা রোল অ্যাডমিন না হলে এরর
    if (!userRole.rows[0] || userRole.rows[0].role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
      });
    }
    // ৪. সব ঠিক থাকলে পরবর্তী স্টেপে যান
    next();
  } catch (error) {
    console.log("Admin error", error);
    res.status(500).json({ error: "Sever error" });
  }
};
