const express = require("express");
const router = express.Router();
const auth = require("../../schema/Auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await auth.findOne({ username, password });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    const authDetails = new auth({
      username,
      password,
      isAdmin,
    });
    const result = await authDetails.save();
    res.status(200).send(result.data);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
