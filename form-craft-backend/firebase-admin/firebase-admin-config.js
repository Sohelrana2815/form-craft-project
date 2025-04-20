const admin = require("firebase-admin");

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix newline formatting
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  console.log("Firebase Admin initialized successfully!");
} catch (error) {
  console.log("Firebase Admin initialization error:", error);
}

module.exports = admin;
