const mongoose = require("mongoose");
const { Schema } = mongoose;

const commercialForSale = new Schema(
  {
    propertyId: String,
    property: String,
    propertyType: String,
    title: String,
    price: Number,
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

module.exports = mongoose.model("commercialForSale", commercialForSale);
