const mongoose = require("mongoose");
const { Schema } = mongoose;

const log = new Schema(
  {
    activity: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("log", log);
