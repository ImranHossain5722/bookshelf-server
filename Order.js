const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const cartSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Book",
    required: true,
  },
  qnt: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const paymentMethodSchema = new mongoose.Schema({
  payment_type: {
    type: String,
    required: true,
  },
  tnx_id: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  ordered_items: [cartSchema],
  ordered_price_amount: {
    type: Number,
    required: true,
  },
  payment_info: paymentMethodSchema,
  order_status: {
    type: String,
    default: "pending",
  },
  placed_status: {
    type: Boolean,
    default: true,
    required: true,
  },
  placed_date: {
    type: String,
  },
  picked_status: {
    type: Boolean,
    default: false,
    required: true,
  },
  picked_date: {
    type: String,
  },
  picked_by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
  },
  delivered_status: {
    type: Boolean,
    default: false,
    required: true,
  },
  delivered_date: {
    type: String,
  },
  delivered_by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "UserProfile",
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

// userProfileSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Order", orderSchema);
