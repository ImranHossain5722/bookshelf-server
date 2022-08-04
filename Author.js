const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
    required: false,
  },
  author_name: {
    type: String,
    required: true,
  },
  author_email: {
    type: String,
    required: false,
  },
  authors_books: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Book",
    required: false,
  },
  book_reviews: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Review",
    required: false,
  },
  photo_url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.startsWith("http"),
      message: (props) => `${props.value} is valid a url`,
    },
  },
});

module.exports = mongoose.model("Author", authorSchema);
