const express = require("express");
const router = express.Router();
const landForRent = require("../../schema/LandForRent");
const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2;
const AuthM = require("../middleware/AuthM");

const upload = multer({ dest: "uploads/" });

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

router.post("/add", AuthM, upload.array("myFiles"), async (req, res) => {
  try {
    const files = req.files;
    const { propertyId, title, rent, description, perches, acres, city } =
      JSON.parse(req.body.additionalData);

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      await cloudinary.uploader.upload(files[i].path, {
        public_id: `image_${i}`,
        folder: `land-rent/${propertyId}`,
      });

      uploadedImages.push(`land-rent/${propertyId}/image_${i}`);

      await fs.unlink(files[i].path);
    }

    const thumbnailImage = uploadedImages[0];
    const images = uploadedImages.slice(1);

    console.log(images);
    console.log(propertyId, title, rent, description, perches, acres, city);
    const newLand = new landForRent({
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
      isVisibale: true,
    });

    const response = await newLand.save();

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.put("/edit/:id", AuthM, upload.array("myFiles"), async (req, res) => {
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

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      await cloudinary.uploader.upload(files[i].path, {
        public_id: `image_${i}`,
        folder: `land-rent/${propertyId}`,
      });

      uploadedImages.push(`land-rent/${propertyId}/image_${i}`);

      await fs.unlink(files[i].path);
    }

    const thumbnailImage = uploadedImages[0];
    const images = uploadedImages.slice(1);

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
    const result = await landForRent.findByIdAndUpdate(id, {
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
  landForRent
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
        `land-rent/${fetchedDetails.propertyId}`
      );
    })
    .then(() => {
      return landForRent.findByIdAndDelete(req.params.id);
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
    const { city, rent, perches, acres, role } = req.body;

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

    let filtered = await landForRent.aggregate(aggregationPipeline).exec();

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

    let filtered = await landForRent.find(filter).exec();

    // Sending the filtered results back to the client
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

    const filtered = await landForRent.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
