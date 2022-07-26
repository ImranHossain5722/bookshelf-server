const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const categorySchema = new mongoose.Schema({
  category_title: {
    type: String,
    required: true,
    unique: true,
  },
  category_icon_url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.startsWith("http"),
      message: (props) => `${props.value} is valid a url`,
    },
  },
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);
