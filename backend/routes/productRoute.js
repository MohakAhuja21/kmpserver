const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");

const router = express.Router();

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

module.exports = router;
