const express = require("express");
const router = express.Router();
const Banners = require("../../schema/Banners");
const log = require("../../schema/Log");
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
    await Banners.find().then((details) => {
      if (details.length > 0) {
        cloudinary.api.delete_resources(details[0].banners, {
          type: "upload",
          resource_type: "image",
        });
      }
    });

    await Banners.deleteMany({});

    const publicIDs = [];

    for (let i = 0; i < req.files.length; i++) {
      const result = await cloudinary.uploader.upload(req.files[i].path, {
        folder: "banners",
        // invalidate: true,
        // overwrite: true
      });
      console.log(result);
      publicIDs.push(result.public_id);

      await fs.unlink(req.files[i].path);
    }

    const newBanner = new Banners({ banners: publicIDs });
    await newBanner.save();

    const newLog = new log({ activity: "Added new banners" });
    await newLog.save();
    res.status(200).json({ success: true, images: publicIDs });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
