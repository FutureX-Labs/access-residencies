const express = require("express");
const router = express.Router();
const apartmentForRent = require("../../schema/ApartmentForRent");
const log = require("../../schema/Log");
const multer = require("multer");
const fs = require("fs").promises;
const cloudinary = require("cloudinary").v2;
const AuthM = require("../middleware/AuthM");
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const houses = await apartmentForRent.find();
    res.status(200).json(houses);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await apartmentForRent.findById(id);

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
        folder: `apartment-rent/${propertyId}`,
      });

      uploadedImages.push(`apartment-rent/${propertyId}/image_${i}`);

      await fs.unlink(files[i].path);
    }

    const thumbnailImage = uploadedImages[0];
    const images = uploadedImages.slice(1);

    const result = new apartmentForRent({
      propertyId,
      property: "Apartment",
      propertyType: "ForRent",
      title,
      rent,
      thumbnailImage,
      images,
      description,
      size,
      bedrooms,
      bathrooms,
      city,
      isVisibale: true,
    });

    const response = await result.save();

    const newLog = new log({ activity: `Added new apartment for rent: ${propertyId}` });
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

    await cloudinary.uploader.upload(thumbnailFile.path, {
      public_id: `image_0`,
      folder: `apartment-rent/${propertyId}`,
    });
    await fs.unlink(thumbnailFile.path);

    const newLog = new log({ activity: `Uploaded new thumbnail for ${propertyId}` });
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
    const Id = req.params.id;

    apartmentForRent.findById(Id, { images: 1, _id: 0 }).then((details) => {
      cloudinary.api.delete_resources(details.images, {
        type: "upload",
        resource_type: "image",
      });
    });

    const uploadedImages = [];

    for (let i = 0; i < imageFiles.length; i++) {
      await cloudinary.uploader.upload(imageFiles[i].path, {
        public_id: `image_${i + 1}`,
        folder: `apartment-rent/${propertyId}`,
      });

      uploadedImages.push(`apartment-rent/${propertyId}/image_${i + 1}`);

      await fs.unlink(imageFiles[i].path);
    }

    await apartmentForRent.findByIdAndUpdate(
      Id,
      { $set: { images: uploadedImages } },
      { new: true }
    );

    const newLog = new log({ activity: `Uploaded new images for ${propertyId}` });
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

    const result = await apartmentForRent.findByIdAndUpdate(Id, {
      title,
      rent,
      description,
      size,
      bedrooms,
      bathrooms,
      city,
    });

    const newLog = new log({ activity: `Updated additional data for ${Id}` });
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
    const result = await apartmentForRent.findByIdAndUpdate(id, {
      isVisibale,
    });
    const newLog = new log({ activity: `Updated visibility for ${id}` });
    await newLog.save();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete("/delete/:id", AuthM, (req, res) => {
  let fetchedDetails;
  apartmentForRent
    .findById(req.params.id, {
      propertyId: 1,
      images: 1,
      thumbnailImage: 1,
      _id: 0,
    })
    .then((details) => {
      fetchedDetails = details;
      const newLog = new log({ activity: `Deleted apartment for rent: ${fetchedDetails.propertyId}` });
      newLog.save();
      return cloudinary.api.delete_resources(
        [details.thumbnailImage, ...details.images],
        { type: "upload", resource_type: "image" }
      );
    })
    .then(() => {
      return cloudinary.api.delete_folder(
        `apartment-rent/${fetchedDetails.propertyId}`
      );
    })
    .then(() => {
      return apartmentForRent.findByIdAndDelete(req.params.id);
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

    let filtered = await apartmentForRent.find(filter).exec();

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

    if (title !== "" && title !== null) {
      filter.title = { $regex: new RegExp(title, "i") };
    }

    console.log(filter);

    let filtered = await apartmentForRent.find(filter).exec();

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

    const filtered = await apartmentForRent.find(filter).exec();

    res.status(200).json(filtered);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});
module.exports = router;
