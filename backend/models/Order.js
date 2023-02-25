const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethod: {
    type: "String",
    enum: ["COD", "Online"],
    default: "COD",
  },
  paymentInfo: {
    type: mongoose.Schema.ObjectId,
    ref: "Payment",
  },
  paidAt: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
    default: 0,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  shippingCharges: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered"],
    default: "Processing",
  },
  //   totalPrice => itemsPrice+taxPrice+shippingPrice //done in frontend.
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// imported in orderController.js
module.exports = mongoose.model("Order", orderSchema);
