// from productModel.js
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeatures");
const catchAsyncError = require("../middleWare/catchAsyncError");

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

// Create New Review or Update the review >> productModel.js // >> productRoute.js
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // rating algorithm --> ex. we are getting 4 reviews on our product .
  // reviews(4)-rating - 4,5,5,4= 16(total)/product.reviews.length(4)=>16/4=4(overall rating)

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});