const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  review: {
    type: String,
    maxLength: 250,
    required: true,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
