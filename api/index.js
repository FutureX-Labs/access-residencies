const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const appartmentForRent = require("./schema/AppartmentForRent");
const appartmentForSale = require("./schema/AppartmentForSale");
const commercialForRent = require("./schema/CommercialForRent");
const commercialForSale = require("./schema/CommercialForSale");
const houseForRent = require("./schema/HouseForRent");
const houseForSale = require("./schema/HouseForSale");
const landForRent = require("./schema/LandForRent");
const landForSale = require("./schema/LandForSale");

const HouseForSale = require("./routes/house/HouseForSale");
const HouseForRent = require("./routes/house/HouseForRent");
const LandForSale = require("./routes/land/LandForSale");
const LandForRent = require("./routes/land/LandForRent");
const AppartmentForSale = require("./routes/appartment/AppartmentForSale");
const AppartmentForRent = require("./routes/appartment/AppartmentForRent");
const CommercialForSale = require("./routes/commercial/CommercialForSale");
const CommercialForRent = require("./routes/commercial/CommercialForRent");
const Banners = require("./routes/customize/Banners");
const Features = require("./routes/customize/Features");
const PropertyId = require("./routes/customize/PropertyId");
const auth = require("./routes/auth/Auth");

app.use("/api/auth", auth);

app.use("/api/houseforsale", HouseForSale);
app.use("/api/houseforrent", HouseForRent);
app.use("/api/landforsale", LandForSale);
app.use("/api/landforrent", LandForRent);
app.use("/api/appartmentforsale", AppartmentForSale);
app.use("/api/appartmentforrent", AppartmentForRent);
app.use("/api/commercialforsale", CommercialForSale);
app.use("/api/commercialforrent", CommercialForRent);
app.use("/api/customize/banners", Banners);
app.use("/api/customize/features", Features);
app.use("/api/customize/propertyid", PropertyId);

// app.get("/api/property/:propertyId", async (req, res) => {
//   try {
//     const { propertyId } = req.params;
//     console.log("propertyId", propertyId);
//     // Define an array to store results from all models
//     const results = [];

//     // Get data from each model
//     const models = [
//       HouseForSale,
//       HouseForRent,
//       LandForSale,
//       LandForRent,
//       CommercialForSale,
//       CommercialForRent,
//       AppartmentForSale,
//       AppartmentForRent,
//     ];

//     // Loop through each model and retrieve data by propertyId
//     for (const Model of models) {
//       console.log("Model:", Model); // Log the model object
//       console.log("Model.prototype:", Object.getPrototypeOf(Model)); // Log the prototype
//       const data = await Model.find({ propertyId: propertyId });
//       results.push({ model: Model.modelName, data: data });
//     }

//     // Send the combined results as the API response
//     res.json(results);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post('/api', async (req, res) => {
//   const  propertyIds  = req.body.propertyIds;
//   console.log("Received propertyIds:", propertyIds);

//   if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
//     return res.status(400).json({ message: "Invalid input: propertyIds array required." });
//   }

//   try {
//     const models = [
//       houseForSale, houseForRent, landForSale, landForRent,
//       commercialForSale, commercialForRent, appartmentForSale, appartmentForRent
//     ]; // All your models

//     const promises = models.map(model => model.find({ propertyId: { $in: propertyIds } }));
//     const results = await Promise.all(promises);
//     const mergedResults = [].concat.apply([], results); // Flatten the array of results

//     res.json({ data: mergedResults });
//   } catch (error) {
//     console.error('Failed to fetch data:', error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.get('/api/property/:propertyId', async (req, res) => {
//   const propertyId = req.params.propertyId; // Extract propertyId from URL parameters
//   console.log("Received propertyId:", propertyId);

//   try {
//     // List all models that might contain the propertyId
//     const models = [
//       houseForSale, houseForRent, landForSale, landForRent,
//       commercialForSale, commercialForRent, appartmentForSale, appartmentForRent
//     ];

//     // Create a promise array to handle multiple asynchronous queries
//     const promises = models.map(model => model.find({ propertyId: propertyId }));

//     // Wait for all promises to resolve
//     const results = await Promise.all(promises);

//     // Flatten the results array (since Promise.all returns an array of arrays)
//     const mergedResults = results.flat();

//     // Send the merged results back as a JSON response
//     if (mergedResults.length === 0) {
//       res.status(404).json({ message: "No data found for the given property ID" });
//     } else {
//       res.json({ data: mergedResults });
//     }
//   } catch (error) {
//     console.error('Failed to fetch data:', error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

app.post("/api/properties", async (req, res) => {
  const { propertyIds } = req.body; // Extract array of propertyIds from request body
  console.log("Received propertyIds:", propertyIds);

  if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input: propertyIds array required." });
  }

  try {
    // List all models that might contain the propertyIds
    const models = [
      houseForSale,
      houseForRent,
      landForSale,
      landForRent,
      commercialForSale,
      commercialForRent,
      appartmentForSale,
      appartmentForRent,
    ];

    // Create a promise array to handle multiple asynchronous queries for each model
    const promises = models.map((model) =>
      model.find({ propertyId: { $in: propertyIds } })
    );

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Flatten the results array
    const mergedResults = results.flat();

    // Send the merged results back as a JSON response
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

mongoose
  .connect("mongodb://127.0.0.1:27017/accessResidencies")
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server started at port", process.env.PORT);
      console.log("Db Connected");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
