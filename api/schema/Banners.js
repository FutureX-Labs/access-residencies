const mongoose = require("mongoose");
const { Schema } = mongoose;

const banners = new Schema(
  {
    banners: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banners", banners);
