const express = require("express");
const router = express.Router();
const houseForRent = require("../../schema/HouseForRent");
const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require('fs').promises;
const cloudinary = require("cloudinary").v2;

const upload = multer({ dest: 'uploads/' });

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
    
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      await cloudinary.uploader.upload(files[i].path, {
        public_id: `image_${i}`,
        folder: `house-rent/${propertyId}`
      });

      uploadedImages.push(`house-rent/${propertyId}/image_${i}`);

      await fs.unlink(files[i].path);
    }

    const thumbnailImage = uploadedImages[0];
    const images = uploadedImages.slice(1);


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
      isVisibale: true,
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

      const result = await houseForRent.findByIdAndUpdate(id, {
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
    
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      await cloudinary.uploader.upload(files[i].path, {
        public_id: `image_${i}`,
        folder: `house-rent/${propertyId}`
      });

      uploadedImages.push(`house-rent/${propertyId}/image_${i}`);

      await fs.unlink(files[i].path);
    }

    const thumbnailImage = uploadedImages[0];
    const images = uploadedImages.slice(1);

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

router.post("/edit/isVisible/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { isVisibale } = req.body;
    const result = await houseForRent.findByIdAndUpdate(id, {
      isVisibale,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete("/delete/:id", (req, res) => {
  let fetchedDetails;
  houseForRent.findById(req.params.id, { propertyId: 1, images: 1, thumbnailImage: 1, _id: 0 })
    .then(details => {
      fetchedDetails = details;
      return cloudinary.api.delete_resources([details.thumbnailImage, ...details.images], { type: 'upload', resource_type: 'image' });
    })
    .then(() => {
      return cloudinary.api.delete_folder(`house-rent/${fetchedDetails.propertyId}`);
    })
    .then(() => {
      return houseForRent.findByIdAndDelete(req.params.id);
    })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      console.error(error);
      res.status(400).json(error);
    });
});

router.post("/filter", async (req, res) => {
  try {
    const { city, rent, size, bedrooms, bathrooms, role } = req.body;

    const filter = {};

    if (role !== "admin") {
      filter.isVisibale = true;
    }

    if (rent !== NaN && rent !== null && rent !== "All") {
      filter.rent = { $lte: rent };
    }

    if (city !== "" && city !== null && city !== "All") {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    if (size !== NaN && size !== null && size !== "All") {
      filter.size = { $gte: size };
    }

    if (bedrooms !== NaN && bedrooms !== null && bedrooms !== "All") {
      filter.bedrooms = { $gte: bedrooms };
    }

    if (bathrooms !== NaN && bathrooms !== null && bathrooms !== "All") {
      filter.bathrooms = { $gte: bathrooms };
    }

    console.log(filter);
    
    let filtered = await houseForRent.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/filter/main", async (req, res) => {
  try {
    const { city, rent, title, role } = req.body;

    const filter = {};

    if (role !== "admin") {
      filter.isVisibale = true;
    }

    if (rent !== NaN && rent !== null && rent !== "All") {
      filter.rent = { $lte: rent };
    }

    if (city !== "" && city !== null && city !== "All") {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    if (title !== "" && title !== null && city !== "All") {
      filter.title = { $regex: new RegExp(title, "i") };
    }

    console.log(filter);

    let filtered = await houseForRent.find(filter).exec();

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

    const filtered = await houseForRent.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
