const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const cartSchema = new mongoose.Schema({
  book: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Book",
    required: false,
  },
  qnt: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const userProfileSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  user_phone: {
    type: Number,
    required: false,
    unique: true,
  },
  user_address: String,
  user_role: {
    type: String,
    required: false,
  },
  user_cart: [cartSchema],
  user_wishlist: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Book",
    required: false,
  },
  user_photo_url: {
    type: String,
    required: false,
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

userProfileSchema.plugin(uniqueValidator);

module.exports = mongoose.model("UserProfile", userProfileSchema);
