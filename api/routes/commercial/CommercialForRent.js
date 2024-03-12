const express = require("express");
const router = express.Router();
const commercialForRent = require("../../schema/CommercialForRent");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/getdata", async (req, res) => {
  try {
    const houses = await commercialForRent.find();
    res.status(200).json(houses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/add", upload.array("myFiles"), async (req, res) => {
  try {
    const files = req.files;
    const { propertyId, title, rent, description, size, propertyType, town } =
      JSON.parse(req.body.additionalData);
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;

    const result = new commercialForRent({
      propertyId,
      title,
      rent,
      thumbnailImage,
      images,
      description,
      size,
      propertyType,
      town,
    });

    const response = await result.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.put("/edit/:id", upload.array("myFiles"), async (req, res) => {
  try {
    const files = req.files;
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;
    const Id = req.params.id;
    const { propertyId, title, rent, description, size, propertyType, town } =
      req.body;

    const result = await commercialForRent.findByIdAndUpdate(Id, {
      propertyId,
      title,
      rent,
      thumbnailImage,
      images,
      description,
      size,
      propertyType,
      town,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const Id = req.params.id;

    // Delete house object
    const result = await commercialForRent.findByIdAndDelete(Id);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/filter", async (req, res) => {
  try {
    const {
      propertyId,
      title,
      minRent,
      maxRent,
      description,
      size,
      propertyType,
      town,
    } = req.body;

    const filter = {};

    if (propertyId) {
      filter.propertyId = propertyId;
    }
    if (title) {
      filter.title = { $regex: new RegExp(title, "i") };
    }
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) {
        filter.rent.$gte = minRent;
      }
      if (maxRent) {
        filter.rent.$lte = maxRent;
      }
    }
    if (description) {
      filter.description = { $regex: new RegExp(description, "i") };
    }
    if (size) {
      filter.size = size;
    }
    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (town) {
      filter.town = { $regex: new RegExp(town, "i") };
    }

    const filtered = await commercialForRent.find(filter);

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
