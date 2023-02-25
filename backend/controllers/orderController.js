const catchAsyncError = require("../middleWare/catchAsyncError");
const Payment = require("../models/Payment");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const crypto = require("crypto");
const Order = require("../models/Order");
const razorpay = require("../config/razorpay");

// Create new Order >> imported in orderRoute.js
exports.placeOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  // we are using here "" just for postman post request purposes/.
  // const user = "req.user._id";
  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };
  await Order.create(orderOptions);

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully via COD",
  });
});

exports.placeOrderOnline = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  // const user = "req.user._id";
  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  // using razorpay
  const options = {
    amount: Number(totalAmount) * 100,
    currency: "INR",
  };

  razorpay.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        error: "Error creating order",
      });
    }

    res.status(201).json({
      success: true,
      order,
      orderOptions,
    });
  });
});
exports.paymentVerification = catchAsyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderOptions,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await Order.create({
      ...orderOptions,
      paidAt: new Date(Date.now()),
      paymentInfo: payment._id,
    });

    res.status(201).json({
      success: true,
      message: `Order Placed Successfully. Payment ID: ${payment._id}`,
    });
  } else {
    return next(new ErrorHandler("Payment Failed", 400));
  }
});

// get Single Order
exports.getOrderDetails = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name");

  if (!order)
    return next(new ErrorHandler("Order not found with this Id", 404));

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "user",
    "name"
  );

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAdminOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  // here we are getting totalPrice from our database. Like if 10 users have placed an order from our website, it will show us the total amount spent by all that user in our "DASHBOARD".
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name");

  if (!order)
    return next(new ErrorHandler("Order not found with this Id", 404));

  if (order.orderStatus === "Processing") order.orderStatus = "Shipped";
  else if (order.orderStatus === "Shipped") {
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date(Date.now());
  } else if (order.orderStatus === "Delivered")
    return next(new ErrorHandler("You have already delivered this order", 400));

  await order.save();

  res.status(200).json({
    success: true,
    message: "Status Updated successfully !",
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
