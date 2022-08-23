const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const sellsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    total_sells_amount: {
      type: Number,
      default: 0,
      required: true,
    },
    total_sells_qnt: {
      type: Number,
      default: 0,
      required: true,
    },
    total_withdrawal_amount: {
      type: Number,
      default: 0,
      required: true,
    },
    balance_amount: {
      type: Number,
      default: 0,
      required: true,
    },
    books_list: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);

// userProfileSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Sells", sellsSchema);
