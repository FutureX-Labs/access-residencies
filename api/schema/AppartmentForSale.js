const mongoose = require("mongoose");
const { Schema } = mongoose;

const appartmentForSale = new Schema(
  {
    propertyId: String,
    title: String,
    price: Number,
    thumbnailImage: String,
    images: Array,
    description: String,
    size: Number,
    bedrooms: Number,
    bathrooms: Number,
    town: String,
    city: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appartmentForSale", appartmentForSale);
