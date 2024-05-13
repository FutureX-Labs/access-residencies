const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use("/api/auth", upload.none(), auth);

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
  .connect(process.env.MONGOURI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server started at port", process.env.PORT);
      console.log("Db Connected");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
