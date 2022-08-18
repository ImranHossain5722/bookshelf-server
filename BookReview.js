const mongoose = require("mongoose");

const bookReviewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  book_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Book",
    required: true,
  },
  review: {
    type: String,
    maxLength: 250,
    required: true,
  },
  ratings: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("BookReview", bookReviewSchema);
