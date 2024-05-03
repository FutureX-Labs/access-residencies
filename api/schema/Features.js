const mongoose = require("mongoose");
const { Schema } = mongoose;

const features = new Schema(
  {
    features: [
      {
        file: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          default: "#home",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("features", features);
