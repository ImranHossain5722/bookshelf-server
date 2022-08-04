const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  book_title: {
    type: String,
    required: true,
  },
  book_description: {
    type: String,
    required: true,
  },
  book_edition: {
    type: String,
    required: true,
  },
  book_country: {
    type: String,
    required: true,
  },
  book_language: {
    type: String,
    required: true,
  },
  book_author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Author",
    required: true,
  },
  book_publisher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Publisher",
    required: true,
  },
  book_price: {
    type: Number,
    required: false,
    min: 1,
  },
  book_pages: {
    type: Number,
    required: false,
    min: 1,
  },
  discount: {
    type: Number,
    required: false,
    default: 0,
  },
  book_qnt: {
    type: Number,
    required: true,
    min: 1,
  },
  book_category: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  book_reviews: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Review",
      required: false,
    },
  ],
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

module.exports = mongoose.model("Book", bookSchema);
