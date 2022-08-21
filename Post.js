const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
  },
  comment: {
    type: String,
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
  },
  post_image: {
    type: String,
    validate: {
      validator: (v) => v.startsWith("http"),
      message: (props) => `${props.value} is valid a url`,
    },
  },
  up_votes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UserProfile",
    },
  ],
  down_votes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UserProfile",
    },
  ],
  post_comments: [commentSchema],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("Post", postSchema);
