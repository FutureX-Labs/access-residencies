const express = require("express");
const router = express.Router();
const landForRent = require("../../schema/LandForRent");
const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2;
const AuthM = require("../middleware/AuthM");
const log = require("../../schema/Log");

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
      const result = await cloudinary.uploader.upload(files[i].path, {
        folder: `land-rent/${propertyId}`,
      });

      uploadedImages.push(result.public_id);

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

    const newLog = new log({ activity: `Land for Rent added: ${propertyId}` });
    await newLog.save();

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

    await landForRent.find({ propertyId }).then((details) => {
      cloudinary.api.delete_resources([details[0].thumbnailImage], {
        type: "upload",
        resource_type: "image",
      });
    });

    const result = await cloudinary.uploader.upload(thumbnailFile.path, {
      folder: `land-rent/${propertyId}`,
    });
    await fs.unlink(thumbnailFile.path);

    await landForRent.findOneAndUpdate(
      { propertyId: propertyId },
      { $set: { thumbnailImage: result.public_id } }
    );

    const newLog = new log({ activity: `Land for Rent thumbnail updated: ${propertyId}` });
    await newLog.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/edit/:id/uploadImages/", AuthM, upload.array("image"), async (req, res) => {
  try {
    const imageFiles = req.files;
    const propertyId = req.body.propertyId;

    await landForRent.find({ propertyId }).then((details) => {
      cloudinary.api.delete_resources(details[0].images, {
        type: "upload",
        resource_type: "image",
      });
    });

    const uploadedImages = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const result = await cloudinary.uploader.upload(imageFiles[i].path, {
        folder: `land-rent/${propertyId}`,
      });

      uploadedImages.push(result.public_id);

      await fs.unlink(imageFiles[i].path);
    }

    await landForRent.findOneAndUpdate(
      { propertyId: propertyId },
      { $set: { images: uploadedImages } }
    );

    const newLog = new log({ activity: `Land for Rent images updated: ${propertyId}` });
    await newLog.save();

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

    const result = await landForRent.findByIdAndUpdate(Id, {
      title,
      rent,
      description,
      size,
      bedrooms,
      bathrooms,
      city,
    });

    const newLog = new log({ activity: `Land for Rent additional data updated: ${Id}` });
    await newLog.save();

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

    const newLog = new log({ activity: `Land for Rent visibility updated: ${id}` });
    await newLog.save();

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
      const newLog = new log({ activity: `Land for Rent deleted: ${details.propertyId}` });
      newLog.save();
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

router.post("/filter/admin", AuthM, async (req, res) => {
  try {
    const { city, rent, perches, acres } = req.body;

    const filter = {};

    if (rent !== NaN && rent !== null && rent !== "All") {
      filter.rent = { $lte: rent };
    }

    if (city !== "" && city !== null && city !== "All") {
      const cityList = city.split(",").map(cityName => cityName.trim());
      filter.city = { $in: cityList };
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

router.post("/filter", async (req, res) => {
  try {
    const { city, rent, perches, acres } = req.body;

    const filter = {};

    filter.isVisibale = true;

    if (rent !== NaN && rent !== null && rent !== "All") {
      filter.rent = { $lte: rent };
    }

    if (city !== "" && city !== null && city !== "All") {
      const cityList = city.split(",").map(cityName => cityName.trim());
      filter.city = { $in: cityList };
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
    const { city, rent, title } = req.body;

    const filter = {};

    filter.isVisibale = true;

    if (rent !== NaN && rent !== null && rent !== "All") {
      filter.rent = { $lte: rent };
    }

    if (city !== "" && city !== null && city !== "All") {
      const cityList = city.split(",").map(cityName => cityName.trim());
      filter.city = { $in: cityList };
    }

    if (title !== "" && title !== null) {
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
