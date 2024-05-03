const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
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
