const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require("../models/Order");
const User = require("../models/User");

// login and see user details
exports.myProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
  // if (req.user) {
  //   res.status(200).json({ user: req.user, success: true });
  // }
  // else {
  //   res.status(401).json({ message: "Not Authorized" });
  // }
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    // cookie name of google is connect.sid as seen in console.
    res.clearCookie("connect.sid", {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    });
    res.status(200).json({
      message: "Logged Out",
    });
  });
};

exports.getAdminUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    users,
  });
});

// for dashboard functionality
exports.getAdminStats = catchAsyncError(async (req, res, next) => {
  const usersCount = await User.countDocuments();

  const orders = await Order.find({});

  const processingOrders = orders.filter((i) => i.orderStatus === "Processing");
  const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
  const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");

  let totalIncome = 0;

  orders.forEach((i) => {
    totalIncome += i.totalAmount;
  });

  res.status(200).json({
    success: true,
    usersCount,
    ordersCount: {
      total: orders.length,
      processing: processingOrders.length,
      shipped: shippedOrders.length,
      delivered: deliveredOrders.length,
    },
    totalIncome,
  });
});
