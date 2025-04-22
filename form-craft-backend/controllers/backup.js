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