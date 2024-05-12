const express = require("express");
const router = express.Router();
const Banners = require("../../schema/Banners");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const houses = await Banners.find();
    res.status(200).json(houses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/add", upload.array("myFiles"), async (req, res) => {
  try {
    await Banners.deleteMany({});
    const files = req.files;
    console.log("files", files);
    const banners = files.map((file) => file.buffer.toString("base64"));

    const result = new Banners({
      banners,
    });

    const response = await result.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
