const mongoose = require("mongoose");
const { Schema } = mongoose;

const appartmentForRent = new Schema(
  {
    propertyId: String,
    title: String,
    rent: Number,
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

module.exports = mongoose.model("appartmentForRent", appartmentForRent);
