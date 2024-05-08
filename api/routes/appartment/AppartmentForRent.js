const express = require("express");
const router = express.Router();
const appartmentForRent = require("../../schema/AppartmentForRent");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const houses = await appartmentForRent.find();
    res.status(200).json(houses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find document by ID
    const response = await appartmentForRent.findById(id);

    if (!response) {
      // If no document found with the given ID, return 404 Not Found
      return res.status(404).json({ message: "not found" });
    }

    // If document found, return it
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
      price,
      description,
      size,
      bedrooms,
      bathrooms,

      city,
    } = JSON.parse(req.body.additionalData);
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;

    const result = new appartmentForRent({
      propertyId,
      property: "Appartment",
      propertyType: "ForRent",
      title,
      price,
      thumbnailImage,
      images,
      description,
      size,
      bedrooms,
      bathrooms,
      city,
      isVisibale: false,
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
    const {
      propertyId,
      title,
      price,
      description,
      size,
      bedrooms,
      bathrooms,
      city,
    } = JSON.parse(req.body.additionalData);
    if (!files || files.length === 0) {
      const id = req.params.id;

      const result = await appartmentForRent.findByIdAndUpdate(id, {
        propertyId,
        title,
        price,
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
    const Id = req.params.id;

    const result = await appartmentForRent.findByIdAndUpdate(Id, {
      propertyId,
      title,
      price,
      thumbnailImage,
      images,
      description,
      size,
      bedrooms,
      bathrooms,

      city,
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
    const result = await appartmentForRent.findByIdAndDelete(Id);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/filter", async (req, res) => {
  try {
    const { city, rent, size, bedrooms, bathrooms } = req.body;

    const filter = {};

    if (rent !== undefined) {
      filter.rent = rent;
    }

    if (city) {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    if (size !== undefined) {
      filter.size = size;
    }

    if (bedrooms !== undefined) {
      filter.bedrooms = bedrooms;
    }

    if (bathrooms !== undefined) {
      filter.bathrooms = bathrooms;
    }

    let filtered = await appartmentForRent.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/filterId", async (req, res) => {
  try {
    const { propertyId } = req.body;

    const filter = {};

    if (propertyId !== undefined) {
      filter.propertyId = propertyId;
    }

    const filtered = await appartmentForRent.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});
module.exports = router;
