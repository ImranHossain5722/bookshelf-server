const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
  },
  comment: {
    type: String,
    maxLength: 50,
    min: 1,
  },
});

const postSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  post_content: {
    type: String,
    maxLength: 50,
    min: 1,
  },
  post_image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.startsWith("http"),
      message: (props) => `${props.value} is valid a url`,
    },
  },
  up_votes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UserProfile",
      unique: true,
    },
  ],
  down_votes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UserProfile",
      unique: true,
    },
  ],
  post_comments: [commentSchema],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

postSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Post", postSchema);
