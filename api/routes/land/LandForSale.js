const express = require("express");
const router = express.Router();
const landForSale = require("../../schema/LandForSale");
const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2;
const AuthM = require("../middleware/AuthM");

const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const result = await landForSale.find();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await landForSale.findById(id);

    if (!response) {
      return res.status(404).json({ message: "not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/add", AuthM, upload.array("myFiles"), async (req, res) => {
  try {
    const files = req.files;
    const { propertyId, title, price, description, perches, acres, city } =
      JSON.parse(req.body.additionalData);

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      await cloudinary.uploader.upload(files[i].path, {
        public_id: `image_${i}`,
        folder: `land-sale/${propertyId}`,
      });

      uploadedImages.push(`land-sale/${propertyId}/image_${i}`);

      await fs.unlink(files[i].path);
    }

    const thumbnailImage = uploadedImages[0];
    const images = uploadedImages.slice(1);

    console.log(images);
    console.log(propertyId, title, price, description, perches, acres, city);
    const newHouse = new landForSale({
      propertyId,
      property: "Land",
      propertyType: "ForSale",
      title,
      price,
      thumbnailImage,
      images,
      description,
      landExtent: {
        perches,
        acres,
      },

      city,
      isVisibale: true,
    });

    const response = await newHouse.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.put("/edit/:id/uploadThumbnail/", AuthM, upload.single("thumbnail"), async (req, res) => {
  try {
    const thumbnailFile = req.file;
    const propertyId = req.body.propertyId;

    await cloudinary.uploader.upload(thumbnailFile.path, {
      public_id: `image_0`,
      folder: `land-sale/${propertyId}`,
    });
    await fs.unlink(thumbnailFile.path);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/edit/:id/uploadImages/", AuthM, upload.array("image"), async (req, res) => {
  try {
    const imageFiles = req.files;
    const propertyId = req.body.propertyId;
    const Id = req.params.id;

    landForSale.findById(Id, { images: 1, _id: 0 }).then((details) => {
      cloudinary.api.delete_resources(details.images, {
        type: "upload",
        resource_type: "image",
      });
    });

    const uploadedImages = [];

    for (let i = 0; i < imageFiles.length; i++) {
      await cloudinary.uploader.upload(imageFiles[i].path, {
        public_id: `image_${i + 1}`,
        folder: `land-sale/${propertyId}`,
      });

      uploadedImages.push(`land-sale/${propertyId}/image_${i + 1}`);

      await fs.unlink(imageFiles[i].path);
    }

    await landForSale.findByIdAndUpdate(
      Id,
      { $set: { images: uploadedImages } },
      { new: true }
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/edit/:id/additionalData/", AuthM, async (req, res) => {
  try {
    const Id = req.params.id;

    const {
      title,
      rent,
      description,
      size,
      bedrooms,
      bathrooms,
      city,
    } = JSON.parse(req.body.additionalData);

    const result = await landForSale.findByIdAndUpdate(Id, {
      title,
      rent,
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

router.post("/edit/isVisible/:id", AuthM, async (req, res) => {
  try {
    const id = req.params.id;
    const { isVisibale } = req.body;
    console.log("id", id);
    console.log("isVisibale", isVisibale);
    const result = await landForSale.findByIdAndUpdate(id, {
      isVisibale,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete("/delete/:id", AuthM, (req, res) => {
  let fetchedDetails;
  landForSale
    .findById(req.params.id, {
      propertyId: 1,
      images: 1,
      thumbnailImage: 1,
      _id: 0,
    })
    .then((details) => {
      fetchedDetails = details;
      return cloudinary.api.delete_resources(
        [details.thumbnailImage, ...details.images],
        { type: "upload", resource_type: "image" }
      );
    })
    .then(() => {
      return cloudinary.api.delete_folder(
        `land-sale/${fetchedDetails.propertyId}`
      );
    })
    .then(() => {
      return landForSale.findByIdAndDelete(req.params.id);
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json(error);
    });
});

router.post("/filter", async (req, res) => {
  try {
    const { city, price, perches, acres, role } = req.body;

    const filter = {};

    if (role !== "admin") {
      filter.isVisibale = true;
    }

    if (price !== NaN && price !== null && price !== "All") {
      filter.price = { $lte: price };
    }

    if (city !== "" && city !== null && city !== "All") {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    const aggregationPipeline = [
      {
        $match: filter,
      },
      {
        $set: {
          totalPerchesAndAcres: {
            $sum: [
              "$landExtent.perches",
              {
                $multiply: ["$landExtent.acres", 160],
              },
            ],
          },
        },
      },
      {
        $match: {
          $expr: {
            $gte: [
              "$totalPerchesAndAcres",
              { $sum: [perches || 0, (acres || 0) * 160] },
            ],
          },
        },
      },
    ];

    // console.log("Aggregation Pipeline:", JSON.stringify(aggregationPipeline, null, 2));

    let filtered = await landForSale.aggregate(aggregationPipeline).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});
router.post("/filter/main", async (req, res) => {
  try {
    const { city, price, title, role } = req.body;

    const filter = {};

    if (role !== "admin") {
      filter.isVisibale = true;
    }

    // Filtering by price if provided
    if (price !== NaN && price !== null && price !== "All") {
      filter.price = { $lte: price };
    }

    // Filtering by city using a case-insensitive regex for flexible matching
    if (city !== "" && city !== null && city !== "All") {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    // Filtering by title using a case-insensitive regex for partial matches
    if (title !== "" && title !== null) {
      filter.title = { $regex: new RegExp(title, "i") };
    }

    console.log(filter);

    // Perform the search with the constructed filter
    let filtered = await landForSale.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Error processing your request", error: error });
  }
});

router.post("/filterId", AuthM, async (req, res) => {
  try {
    const { propertyId } = req.body;

    const filter = {};

    if (propertyId !== undefined) {
      filter.propertyId = propertyId;
    }

    const filtered = await landForSale.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
