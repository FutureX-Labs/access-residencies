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
    const FeatureData = [];

    await Features.deleteMany({});

    for (let i = 0; i < files.length; i++) {
      const publicId = `feature_${i + 1}`;
      await cloudinary.uploader.upload(files[i].path, {
        public_id: publicId,
        folder: "features",
        invalidate: true,
        overwrite: true
      });

      FeatureData.push({
        file: `features/${publicId}`,
        url: "#home",
      });

      await fs.unlink(files[i].path);
    }

    const newFeature = new Features({ features: FeatureData });
    await newFeature.save();

    const newLog = new log({ activity: "Added new features" });
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
    const featureData = features.features;

    for (let i = 0; i < featureData.length; i++) {
      featureData[i].url = urlData[i];
    }

    features.features = featureData;
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
