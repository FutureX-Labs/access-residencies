const express = require("express");
const router = express.Router();
const houseForSale = require("../../schema/HouseForSale");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const houses = await houseForSale.find();
    res.status(200).json(houses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await houseForSale.findById(id);

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

    const result = new houseForSale({
      propertyId,
      property: "House",
      propertyType: "ForSale",
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

      const result = await houseForSale.findByIdAndUpdate(id, {
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

    const result = await houseForSale.findByIdAndUpdate(Id, {
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

router.post("/edit/isVisible/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { isVisibale } = req.body;
    const result = await houseForSale.findByIdAndUpdate(id, {
      isVisibale,
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
    console.log("Id", Id);

    const result = await houseForSale.findByIdAndDelete(Id);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/filter", async (req, res) => {
  try {
    const { city, price, size, bedrooms, bathrooms } = req.body;

    const filter = {};

    if (price !== undefined && price !== null) {
      filter.price = price;
    }

    if (city !== undefined && city !== null) {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    if (size !== undefined && size !== null) {
      filter.size = size;
    }

    if (bedrooms !== undefined && bedrooms !== null) {
      filter.bedrooms = bedrooms;
    }

    if (bathrooms !== undefined && bathrooms !== null) {
      filter.bathrooms = bathrooms;
    }

    let filtered = await houseForSale.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/filter/main", async (req, res) => {
  try {
    const { city, price, title } = req.body;

    const filter = {};

    // Filtering by price if provided
    if (price !== undefined && price !== null) {
      filter.price = price;
    }

    // Filtering by city using a case-insensitive regex for flexible matching
    if (city !== undefined && city !== null) {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    // Filtering by title using a case-insensitive regex for partial matches
    if (title !== undefined && title !== null) {
      filter.title = { $regex: new RegExp(title, "i") };
    }

    // Perform the search with the constructed filter
    let filtered = await houseForSale.find(filter).exec();

    // Sending the filtered results back to the client
    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Error processing your request", error: error });
  }
});

router.post("/filterId", async (req, res) => {
  try {
    const { propertyId } = req.body;

    const filter = {};

    if (propertyId !== undefined) {
      filter.propertyId = propertyId;
    }

    const filtered = await houseForSale.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
