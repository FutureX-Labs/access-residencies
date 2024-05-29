const express = require("express");
const router = express.Router();
const PropertyIdSchema = require("../../schema/PropertyId");
const AuthM = require("../middleware/AuthM");
const log = require("../../schema/Log");

const apartmentForRent = require("../../schema/ApartmentForRent");
const apartmentForSale = require("../../schema/ApartmentForSale");
const commercialForRent = require("../../schema/CommercialForRent");
const commercialForSale = require("../../schema/CommercialForSale");
const houseForRent = require("../../schema/HouseForRent");
const houseForSale = require("../../schema/HouseForSale");
const landForRent = require("../../schema/LandForRent");
const landForSale = require("../../schema/LandForSale");

router.get("/", async (req, res) => {
  try {
    const data = await PropertyIdSchema.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/add", AuthM, async (req, res) => {
  try {
    await PropertyIdSchema.deleteMany({});
    const propertyIds = req.body.propertyIds; 
    console.log("propertyIds:", propertyIds);

    const result = new PropertyIdSchema({ propertyId: propertyIds });
    const savedResult = await result.save();
    const newLog = new log({ activity: "Added new propertyIds" });
    await newLog.save();
    res.status(200).json(savedResult);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});


router.post("/check", AuthM, async (req, res) => {
  const { propertyId } = req.body;

  if (!propertyId || propertyId.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input: propertyId required." });
  }

  try {
    const models = [
      houseForSale,
      houseForRent,
      landForSale,
      landForRent,
      commercialForSale,
      commercialForRent,
      apartmentForSale,
      apartmentForRent,
    ];

    const promises = models.map((model) =>
      model.find({ propertyId: { $in: propertyId }, isVisibale: true })
    );

    const results = await Promise.all(promises);

    if (results.length === 0) {
      res.status(404).json({ message: "No data found for the given property IDs" });
    } else {
      const isPropertyIdAvailable = results.some((result) => result.length > 0);
      res.status(200).json({ available: isPropertyIdAvailable });
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/getDetails", async (req, res) => {
  const { propertyIds } = req.body;

  if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input: propertyIds array required." });
  }

  try {
    const models = [
      houseForSale,
      houseForRent,
      landForSale,
      landForRent,
      commercialForSale,
      commercialForRent,
      apartmentForSale,
      apartmentForRent,
    ];

    const promises = models.map((model) =>
      model.find({ propertyId: { $in: propertyIds }, isVisibale: true })
    );

    const results = await Promise.all(promises);

    const mergedResults = results.flat();

    const propertyIdIndexMap = propertyIds.reduce((acc, propertyId, index) => {
      acc[propertyId] = index;
      return acc;
    }, {});

    mergedResults.sort((a, b) => {
      return propertyIdIndexMap[a.propertyId] - propertyIdIndexMap[b.propertyId];
    });

    if (mergedResults.length === 0) {
      res
        .status(404)
        .json({ message: "No data found for the given property IDs" });
    } else {
      res.json({ data: mergedResults });
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;

// router.post("/add", async (req, res) => {
//   try {
//     const { propertyIds } = req.body; // Extract propertyIds from req.body
//     console.log("propertyIds", propertyIds); // Check if propertyIds is correctly received
//     // Handle saving propertyIds to database
//     res.status(200).json({ message: "PropertyIds received successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json(error);
//   }
// });
