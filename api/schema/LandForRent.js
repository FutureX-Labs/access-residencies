const mongoose = require("mongoose");
const { Schema } = mongoose;

const landForRent = new Schema(
  {
    propertyId: String,
    property: String,
    propertyType: String,
    title: String,
    rent: Number,
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

module.exports = mongoose.model("landForRent", landForRent);
