const express = require("express");
const router = express.Router();
const commercialForRent = require("../../schema/CommercialForRent");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const houses = await commercialForRent.find();
    res.status(200).json(houses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await commercialForRent.findById(id);

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

    const { propertyId, title, rent, description, size, propertyTypes, city } =
      JSON.parse(req.body.additionalData);
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;

    const result = new commercialForRent({
      propertyId,
      property: "Commercial",
      propertyType: "ForRent",
      title,
      rent,
      thumbnailImage,
      images,
      description,
      size,
      propertyTypes,

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
    const { propertyId, title, rent, description, size, propertyTypes, city } =
      JSON.parse(req.body.additionalData);

    if (!files || files.length === 0) {
      const id = req.params.id;

      const result = await commercialForRent.findByIdAndUpdate(id, {
        propertyId,
        title,
        rent,
        description,
        size,
        propertyTypes,
        city,
      });

      return res.status(200).json(result);
    }
    const images = files.map((file) => file.buffer.toString("base64"));
    const thumbnailImage = images[images.length - 1];
    thumbnailImage ? images.pop() : thumbnailImage;
    const Id = req.params.id;

    const result = await commercialForRent.findByIdAndUpdate(Id, {
      propertyId,
      title,
      rent,
      thumbnailImage,
      images,
      description,
      size,
      propertyTypes,

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
    const result = await commercialForRent.findByIdAndDelete(Id);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/filter", async (req, res) => {
  try {
    const { city, rent, size, propertyTypes } = req.body;

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

    if (propertyTypes) {
      filter.propertyTypes = propertyTypes;
    }

    let filtered = await commercialForRent.find(filter).exec();

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

    const filtered = await commercialForRent.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
