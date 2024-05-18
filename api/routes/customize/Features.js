const express = require("express");
const router = express.Router();
const Features = require("../../schema/Features");
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

router.post("/add", AuthM, upload.array("myFiles"), async (req, res) => {
  try {
    await Features.deleteMany({});

    const uploadedImages = [];
    const FeatureData = [];

    const urlData = req.body.urls;

    for (let i = 0; i < req.files.length; i++) {
      const publicId = `feature_${i + 1}`;
      const result = await cloudinary.uploader.upload(req.files[i].path, {
        public_id: publicId,
        folder: "features",
      });
      uploadedImages.push(result.secure_url);

      FeatureData.push({
        file: `features/${publicId}`,
        url: urlData[i] || "#home",
      });

      await fs.unlink(req.files[i].path);
    }
    console.log(FeatureData);

    const newFeature = new Features({ features: FeatureData });
    await newFeature.save();

    res.status(200).json({ success: true, images: uploadedImages });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
