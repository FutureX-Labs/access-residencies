const mongoose = require("mongoose");
const { Schema } = mongoose;

const landForSale = new Schema(
  {
    propertyId: String,
    property: String,
    propertyType: String,
    title: String,
    price: Number,
    thumbnailImage: String,
    images: Array,
    description: String,
    landExtent: {
      perches: Number,
      acres: Number,
    },

    city: String,
    isVisibale: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("landForSale", landForSale);
