const express = require("express");
const router = express.Router();
const commercialForSale = require("../../schema/CommercialForSale");
const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2;
const AuthM = require("../middleware/AuthM");
const upload = multer({ dest: "uploads/" });
const log = require("../../schema/Log");

router.get("/", async (req, res) => {
  try {
    const houses = await commercialForSale.find();
    res.status(200).json(houses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await commercialForSale.findById(id);

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

    const { propertyId, title, price, description, size, propertyTypes, city } =
      JSON.parse(req.body.additionalData);

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const result = await cloudinary.uploader.upload(files[i].path, {
        folder: `commercial-sale/${propertyId}`,
      });

      uploadedImages.push(result.public_id);

      await fs.unlink(files[i].path);
    }

    const thumbnailImage = uploadedImages[0];
    const images = uploadedImages.slice(1);

    const result = new commercialForSale({
      propertyId,
      property: "Commercial",
      propertyType: "ForSale",
      title,
      price,
      thumbnailImage,
      images,
      description,
      size,
      propertyTypes,
      city,
      isVisibale: true,
    });

    const response = await result.save();

    const newLog = new log({ activity: `New Commercial For Sale Added : ${propertyId}` });
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

    await commercialForSale.find({ propertyId }).then((details) => {
      cloudinary.api.delete_resources([details[0].thumbnailImage], {
        type: "upload",
        resource_type: "image",
      });
    });

    const result = await cloudinary.uploader.upload(thumbnailFile.path, {
      folder: `commercial-sale/${propertyId}`,
    });
    await fs.unlink(thumbnailFile.path);

    await commercialForSale.findOneAndUpdate(
      { propertyId: propertyId },
      { $set: { thumbnailImage: result.public_id } }
    );

    const newLog = new log({ activity: `Thumbnail Image Updated : ${propertyId}` });
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

    await commercialForSale.find({ propertyId }).then((details) => {
      cloudinary.api.delete_resources(details[0].images, {
        type: "upload",
        resource_type: "image",
      });
    });

    const uploadedImages = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const result = await cloudinary.uploader.upload(imageFiles[i].path, {
        folder: `commercial-sale/${propertyId}`,
      });

      uploadedImages.push(result.public_id);

      await fs.unlink(imageFiles[i].path);
    }

    await commercialForSale.findOneAndUpdate(
      { propertyId: propertyId },
      { $set: { images: uploadedImages } }
    );

    const newLog = new log({ activity: `Images Updated : ${propertyId}` });
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

    const result = await commercialForSale.findByIdAndUpdate(Id, {
      title,
      rent,
      description,
      size,
      bedrooms,
      bathrooms,
      city,
    });

    const newLog = new log({ activity: `Additional Data Updated : ${result.propertyId}` });
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
    const result = await commercialForSale.findByIdAndUpdate(id, {
      isVisibale,
    });

    const newLog = new log({ activity: `Visibility Updated : ${result.propertyId}` });
    await newLog.save();

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete("/delete/:id", AuthM, (req, res) => {
  let fetchedDetails;
  commercialForSale
    .findById(req.params.id, {
      propertyId: 1,
      images: 1,
      thumbnailImage: 1,
      _id: 0,
    })
    .then((details) => {
      fetchedDetails = details;
      const newLog = new log({ activity: `Commercial For Sale Deleted : ${details.propertyId}` });
      newLog.save();
      return cloudinary.api.delete_resources(
        [details.thumbnailImage, ...details.images],
        { type: "upload", resource_type: "image" }
      );
    })
    .then(() => {
      return cloudinary.api.delete_folder(
        `commercial-sale/${fetchedDetails.propertyId}`
      );
    })
    .then(() => {
      return commercialForSale.findByIdAndDelete(req.params.id);
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
    const { city, price, size, propertyTypes } = req.body;

    const filter = {};

    if (price !== NaN && price !== null && price !== "All") {
      filter.price = { $lte: price };
    }

    if (city !== "" && city !== null && city !== "All") {
      const cityList = city.split(",").map(cityName => cityName.trim());
      filter.city = { $in: cityList };
    }

    if (size !== NaN && size !== null && size !== "All") {
      filter.size = { $gte: size };
    }

    if (propertyTypes !== null && propertyTypes !== "All") {
      filter.propertyTypes = propertyTypes;
    }

    console.log(filter);

    let filtered = await commercialForSale.find(filter).exec();
    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/filter", async (req, res) => {
  try {
    const { city, price, size, propertyTypes } = req.body;

    const filter = {};

    filter.isVisibale = true;

    if (price !== NaN && price !== null && price !== "All") {
      filter.price = { $lte: price };
    }

    if (city !== "" && city !== null && city !== "All") {
      const cityList = city.split(",").map(cityName => cityName.trim());
      filter.city = { $in: cityList };
    }

    if (size !== NaN && size !== null && size !== "All") {
      filter.size = { $gte: size };
    }

    if (propertyTypes !== null && propertyTypes !== "All") {
      filter.propertyTypes = propertyTypes;
    }

    console.log(filter);

    let filtered = await commercialForSale.find(filter).exec();
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

    filter.isVisibale = true;

    if (price !== NaN && price !== null && price !== "All") {
      filter.price = { $lte: price };
    }

    if (city !== "" && city !== null && city !== "All") {
      const cityList = city.split(",").map(cityName => cityName.trim());
      filter.city = { $in: cityList };
    }

    if (title !== "" && title !== null) {
      filter.title = { $regex: new RegExp(title, "i") };
    }

    console.log(filter);

    let filtered = await commercialForSale.find(filter).exec();

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

    const filtered = await commercialForSale.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
