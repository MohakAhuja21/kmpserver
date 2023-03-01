// from productModel.js
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeatures");
const { catchAsyncError } = require("../middleware/catchAsyncError");

//postman CREATE A PRODUCT //admin
// importing this is productRoute
// next here is basically a callback function.
exports.createProduct = catchAsyncError(async (req, res, next) => {
  // through this whenever we create a product. It will create a unique ID along with it to be displayed in productModel.js> user: //

  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  // 201->created
  res.status(201).json({
    success: true,
    product,
  });
});

// postman GET ALL PRODUCT
// exports.getAllProducts = catchAsyncError(async (req, res) => {
exports.getAllProducts = catchAsyncError(async (req, res) => {
  // pagination
  // no of products to to be displayed per page. Importing in apiFeatures.js
  const resultPerPage = 12;
  const productsCount = await Product.countDocuments();

  // adding-> search,filters to product
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()

    let products = await apiFeatures.query;

    let filteredProductsCount = products.length;
  
    apiFeatures.pagination(resultPerPage);
  
    products = await apiFeatures.query.clone();

  res.status(200).json({
    success: true,
    // using below in productAction in frontend.
    products,
    productsCount,
    // products.js>pagination
    resultPerPage,
    filteredProductsCount
  });
});

// update product //admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete a product //admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

//postman  GET PRODUCT DETAILS
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  // return res.status(500).json({
  //   success: false,
  //   message: "Product not found",
  // });

  res.status(200).json({
    success: true,
    product,
  });
});