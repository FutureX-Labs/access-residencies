const mongoose = require("mongoose");
const { Schema } = mongoose;

const commercialForRent = new Schema(
  {
    propertyId: String,
    title: String,
    rent: Number,
    thumbnailImage: String,
    images: Array,
    description: String,
    propertyType: String,
    size: String,
    town: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("commercialForRent", commercialForRent);
