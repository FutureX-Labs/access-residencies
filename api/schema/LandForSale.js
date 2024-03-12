const mongoose = require("mongoose");
const { Schema } = mongoose;

const landForSale = new Schema(
  {
    propertyId: String,
    title: String,
    price: Number,
    thumbnailImage: String,
    images: Array,
    description: String,
    landExtent: {
      perches: Number,
      acres: Number,
    },
    town: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("landForSale", landForSale);
