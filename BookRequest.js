const mongoose = require("mongoose");

const bookRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  book_title: {
    type: String,
    required: true,
  },
  book_edition: {
    type: String,
  },
  book_country: {
    type: String,
  },
  book_language: {
    type: String,
  },
  book_author: {
    type: String,
    required: true,
  },
  book_publisher: {
    type: String,
  },
  book_qnt: {
    type: Number,
    min: 1,
  },
  book_category: {
    type: String,
  },
  book_cover_photo_url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.startsWith("http"),
      message: (props) => `${props.value} is valid a url`,
    },
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("Book-request", bookRequestSchema);
