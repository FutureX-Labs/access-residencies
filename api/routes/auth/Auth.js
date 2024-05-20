const express = require("express");
const router = express.Router();
const auth = require("../../schema/Auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const jwt = require("jsonwebtoken");
const log = require("../../schema/Log");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("username", username);
    console.log("password", password);
    const user = await auth.findOne({ username, password });
    if (user) {
      const token = jwt.sign(
        { isAdmin: user.isAdmin, username: user.username },
        process.env.JWT_SECRET
      );

      const newLog = new log({ activity: `User logged in : ${username}` });
      await newLog.save();

      res.status(200).send({ token: token, user });
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

    const newLog = new log({ activity: `User signed up : ${username}` });
    await newLog.save();
    const result = await authDetails.save();
    res.status(200).send(result.data);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
