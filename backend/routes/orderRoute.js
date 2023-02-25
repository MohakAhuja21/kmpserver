// importing in app.js
const express = require("express");
const {
  myOrders,
  updateOrder,
  deleteOrder,
  placeOrder,
  getOrderDetails,
  getAdminOrders,
  placeOrderOnline,
  paymentVerification,
} = require("../controllers/orderController");
const { isAuthenticated, authorizeAdmin } = require("../middleware/auth");
const router = express.Router();


// router.route("/createorder").pos, placeOrder);
router.post("/createorder",isAuthenticated, placeOrder);

router.post("/createorderonline", isAuthenticated,placeOrderOnline);

// payment verification route working in postman. Provided temporary user and other details.
router.post("/paymentverification",isAuthenticated, paymentVerification);

router.get("/myorders",isAuthenticated, myOrders);

router.get("/order/:id",isAuthenticated, getOrderDetails);

// add admin middleware
router.get("/admin/orders",isAuthenticated, authorizeAdmin, getAdminOrders);

router.get("/admin/order/:id",isAuthenticated,authorizeAdmin, updateOrder);

// router.route("/admin/order/:id").put(updateOrder).delete(deleteOrder);

module.exports = router;
