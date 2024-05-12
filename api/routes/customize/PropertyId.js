const express = require("express");
const router = express.Router();
const PropertyIdSchema = require("../../schema/PropertyId");

router.get("/", async (req, res) => {
  try {
    const data = await PropertyIdSchema.find();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/add", async (req, res) => {
  try {
    await PropertyIdSchema.deleteMany({});
    const propertyIds = req.body.propertyIds; // Access propertyIds from req.body
    console.log("propertyIds:", propertyIds); // Check if propertyIds is correctly received

    const result = new PropertyIdSchema({ propertyId: propertyIds });
    const savedResult = await result.save();
    res.status(200).json(savedResult);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
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
