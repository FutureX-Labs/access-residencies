const express = require("express");
const router = express.Router();
const houseForRent = require("../../schema/HouseForRent");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const houses = await houseForRent.find();
    res.status(200).json(houses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await houseForRent.findById(id);

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
    const {
      propertyId,
      title,
      rent,
      description,
      size,
      bedrooms,
      bathrooms,

      city,
    } = JSON.parse(req.body.additionalData);
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;

    console.log(images);
    console.log(
      propertyId,
      title,
      rent,
      description,
      size,
      bedrooms,
      bathrooms,

      city
    );
    const newHouse = new houseForRent({
      propertyId,
      property: "House",
      propertyType: "ForRent",
      title,
      rent,
      thumbnailImage,
      images,
      description,
      size,
      bedrooms,
      bathrooms,
      isVisibale: false,
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
    const {
      propertyId,
      title,
      rent,
      description,
      size,
      bedrooms,
      bathrooms,

      city,
    } = JSON.parse(req.body.additionalData);
    if (!files || files.length === 0) {
      const id = req.params.id;

      const result = await houseForSale.findByIdAndUpdate(id, {
        propertyId,
        title,
        rent,
        description,
        size,
        bedrooms,
        bathrooms,

        city,
      });

      return res.status(200).json(result);
    }
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;
    const houseId = req.params.id;

    await houseForRent.findByIdAndUpdate(houseId, {
      propertyId,
      title,
      rent,
      thumbnailImage,
      images,
      description,
      size,
      bedrooms,
      bathrooms,

      city,
    });

    res.status(200).json("House edited successfully");
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const houseId = req.params.id;

    // Delete house object
    await houseForRent.findByIdAndDelete(houseId);

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
      minRent,
      maxRent,
      description,
      size,
      bedrooms,
      bathrooms,

      city,
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
    if (bedrooms) {
      filter.bedrooms = bedrooms;
    }
    if (bathrooms) {
      filter.bathrooms = bathrooms;
    }
    if (city) {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    const filteredHouses = await houseForRent.find(filter);

    res.status(200).json(filteredHouses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
