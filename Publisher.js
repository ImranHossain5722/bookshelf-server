const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
  publisher_name: {
    type: String,
    required: true,
  },
  publisher_email: {
    type: String,
    required: true,
  },
  publisher_books: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Book",
    required: false,
  },
  publisher_reviews: {
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

module.exports = mongoose.model("Publisher", publisherSchema);
