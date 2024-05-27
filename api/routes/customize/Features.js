const express = require("express");
const router = express.Router();
const Features = require("../../schema/Features");
const log = require("../../schema/Log");
const multer = require("multer");
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2;
const AuthM = require("../middleware/AuthM");
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const features = await Features.find();
    res.status(200).json(features);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/addImages", AuthM, upload.array("features"), async (req, res) => {
  try {
    const files = req.files;
    const publicURLs = [];

    Features.findById(Id, { features: 1, _id: 0 }).then((details) => {
      for (let i = 0; i < details.features.length; i++) {
        cloudinary.api.delete_resources(details.features[i].file, {
          type: "upload",
          resource_type: "image",
        });
      }
    });

    await Features.deleteMany({});

    for (let i = 0; i < files.length; i++) {
      const result = await cloudinary.uploader.upload(files[i].path, {
        folder: "features",
      });

      publicURLs.push({
        file: result.secure_url,
        url: "#home",
      });

      await fs.unlink(files[i].path);
    }

    const newFeature = new Features({ features: publicURLs });
    await newFeature.save();

    const newLog = new log({ activity: "Added new features" });
    await newLog.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }

});

router.post("/addUrls", AuthM, async (req, res) => {
  try {
    console.log(req.body);
    const urlData = req.body.urls;

    const features = await Features.findOne();
    const publicURLs = features.features;

    for (let i = 0; i < publicURLs.length; i++) {
      publicURLs[i].url = urlData[i];
    }

    features.features = publicURLs;
    await features.save();

    const newLog = new log({ activity: "Added new urls" });
    await newLog.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
