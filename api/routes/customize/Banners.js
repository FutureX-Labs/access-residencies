const express = require("express");
const router = express.Router();
const Banners = require("../../schema/Banners");
const multer = require("multer");
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2;
const AuthM = require("../middleware/AuthM");
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const banners = await Banners.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/add", AuthM, upload.array("banners"), async (req, res) => {
  try {
    await Banners.deleteMany({});

    const uploadedImages = [];
    const publicIds = [];

    for (let i = 0; i < req.files.length; i++) {
      const publicId = `banner_${i + 1}`;
      const result = await cloudinary.uploader.upload(req.files[i].path, {
        public_id: publicId,
        folder: "banners",
      });
      uploadedImages.push(result.secure_url);
      publicIds.push(`banners/${publicId}`);

      await fs.unlink(req.files[i].path);
    }

    const newBanner = new Banners({ banners: publicIds });
    await newBanner.save();

    res.status(200).json({ success: true, images: uploadedImages });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
