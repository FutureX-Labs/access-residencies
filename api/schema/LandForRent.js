const mongoose = require("mongoose");
const { Schema } = mongoose;

const landForRent = new Schema(
  {
    propertyId: String,
    title: String,
    rent: Number,
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

module.exports = mongoose.model("landForRent", landForRent);
