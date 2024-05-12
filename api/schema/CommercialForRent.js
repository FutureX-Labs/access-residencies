const mongoose = require("mongoose");
const { Schema } = mongoose;

const commercialForRent = new Schema(
  {
    propertyId: String,
    property: String,
    propertyType: String,
    title: String,
    rent: Number,
    thumbnailImage: String,
    images: Array,
    description: String,
    propertyTypes: String,
    size: Number,
    city: String,
    isVisibale: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("commercialForRent", commercialForRent);
