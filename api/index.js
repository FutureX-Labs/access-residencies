const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
var cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: "dpzlg0mru",
  api_key: "444118675797768",
  api_secret: "uymmOwa5HdAIGGDw_nmzbKct9us",
});

const HouseForSale = require("./routes/house/HouseForSale");
const HouseForRent = require("./routes/house/HouseForRent");
const LandForSale = require("./routes/land/LandForSale");
const LandForRent = require("./routes/land/LandForRent");
const ApartmentForSale = require("./routes/apartment/ApartmentForSale");
const ApartmentForRent = require("./routes/apartment/ApartmentForRent");
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
app.use("/api/apartmentforsale", ApartmentForSale);
app.use("/api/apartmentforrent", ApartmentForRent);
app.use("/api/commercialforsale", CommercialForSale);
app.use("/api/commercialforrent", CommercialForRent);
app.use("/api/customize/banners", Banners);
app.use("/api/customize/features", Features);
app.use("/api/customize/propertyid", PropertyId);


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
