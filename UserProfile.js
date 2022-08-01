const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userProfileSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
  },
  user_phone: {
    type: Number,
    required: false,
    unique: true,
  },
  user_role: {
    type: String,
    required: false,
  },
  user_cart: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Book",
    required: false,
  },
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
