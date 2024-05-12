const mongoose = require("mongoose");
const { Schema } = mongoose;

const PropertyIdSchema = new Schema(
  {
    propertyId: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("propertyId", PropertyIdSchema);
