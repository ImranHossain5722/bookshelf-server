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
  user_role: {
    type: String,
    required: true,
  },
  user_photo_url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.startsWith("http"),
      message: (props) => `${props.value} is valid a url`,
    },
  },
});

userProfileSchema.plugin(uniqueValidator);

module.exports = mongoose.model("UserProfile", userProfileSchema);
