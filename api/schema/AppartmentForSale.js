const mongoose = require("mongoose");
const { Schema } = mongoose;

const appartmentForSale = new Schema(
  {
    propertyId: String,
    property: String,
    propertyType: String,
    title: String,
    price: Number,
    thumbnailImage: String,
    images: Array,
    description: String,
    size: Number,
    bedrooms: Number,
    bathrooms: Number,
    city: String,
    isVisibale: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appartmentForSale", appartmentForSale);
