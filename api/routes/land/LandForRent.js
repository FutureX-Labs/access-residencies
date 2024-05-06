const express = require("express");
const router = express.Router();
const landForRent = require("../../schema/LandForRent");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const result = await landForRent.find();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await landForRent.findById(id);

    if (!response) {
      return res.status(404).json({ message: "not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/add", upload.array("myFiles"), async (req, res) => {
  try {
    const files = req.files;
    const { propertyId, title, rent, description, perches, acres, city } =
      JSON.parse(req.body.additionalData);
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;

    console.log(images);
    console.log(propertyId, title, rent, description, perches, acres, city);
    const newHouse = new landForRent({
      propertyId,
      property: "Land",
      propertyType: "ForRent",
      title,
      rent,
      thumbnailImage,
      images,
      description,
      landExtent: {
        perches,
        acres,
      },

      city,
    });

    const response = await newHouse.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.put("/edit/:id", upload.array("myFiles"), async (req, res) => {
  try {
    const files = req.files;
    const { propertyId, title, rent, description, perches, acres, city } =
      JSON.parse(req.body.additionalData);

    if (!files || files.length === 0) {
      const id = req.params.id;

      const result = await landForRent.findByIdAndUpdate(id, {
        propertyId,
        title,
        rent,
        description,
        landExtent: {
          perches,
          acres,
        },
        city,
      });

      return res.status(200).json(result);
    }
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;
    const houseId = req.params.id;

    const result = await landForRent.findByIdAndUpdate(houseId, {
      propertyId,
      title,
      rent,
      thumbnailImage,
      images,
      description,
      landExtent: {
        perches,
        acres,
      },

      city,
      isVisibale: false,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Delete house object
    await landForRent.findByIdAndDelete(id);

    res.status(200).json("House deleted successfully");
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
      minPrice,
      maxPrice,
      description,
      minPerches,
      maxPerches,
      minAcres,
      maxAcres,

      city,
    } = req.body;

    const filter = {};

    if (propertyId) {
      filter.propertyId = propertyId;
    }
    if (title) {
      filter.title = { $regex: new RegExp(title, "i") };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice) {
        filter.price.$lte = maxPrice;
      }
    }
    if (description) {
      filter.description = { $regex: new RegExp(description, "i") };
    }
    if (minPerches || maxPerches) {
      filter["landExtent.perches"] = {};
      if (minPerches) {
        filter["landExtent.perches"].$gte = minPerches;
      }
      if (maxPerches) {
        filter["landExtent.perches"].$lte = maxPerches;
      }
    }
    if (minAcres || maxAcres) {
      filter["landExtent.acres"] = {};
      if (minAcres) {
        filter["landExtent.acres"].$gte = minAcres;
      }
      if (maxAcres) {
        filter["landExtent.acres"].$lte = maxAcres;
      }
    }
    if (city) {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    const filteredHouses = await landForRent.find(filter);

    res.status(200).json(filteredHouses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
