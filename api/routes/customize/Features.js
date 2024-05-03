const express = require("express");
const router = express.Router();
const Features = require("../../schema/Features");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const features = await Features.find();
    res.status(200).json(features);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/add", upload.array("myFiles"), async (req, res) => {
  try {
    await Features.deleteMany({});
    const files = req.files;
    const urlData = req.body.urls;

    console.log("files", files);
    console.log("urlData", urlData);

    const features = files.map((file, index) => ({
      file: file.buffer.toString("base64"),
      url: urlData[index] || "#home",
    }));

    console.log("features", features);

    const result = new Features({
      features,
    });

    const response = await result.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
