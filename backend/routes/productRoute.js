const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");

const router = express.Router();

// router.route("/products").get(getAllProducts);
router.get("/products",getAllProducts);

// auth.js for creating Product
router
  .route("/admin/products/new")
  .post( createProduct);

// postman product updating request
router
  .route("/admin/product/:id")
  .put( updateProduct)
  .delete( deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(createProductReview);

router
  .route("/reviews")
  // in getProductReviews we can add . So that first after logging in only we can see product review. Here we have not done that because we want anyone to see ratings and reviews even if they are not logged in.!
  .get(getProductReviews)
  .delete(deleteReview);


module.exports = router;
