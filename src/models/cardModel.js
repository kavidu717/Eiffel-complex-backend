import mongoose from "mongoose";

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  color: {
    type: String
  },

  size: {
    type: String
  },

  quantity: {
    type: Number,
    default: 1
  }

}, { _id: false });


// Main Cart Schema
const cartSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  guestId: {
    type: String
  },

  products: [cartItemSchema],

  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }

}, {
  timestamps: true
});

export default mongoose.model("Cart", cartSchema);