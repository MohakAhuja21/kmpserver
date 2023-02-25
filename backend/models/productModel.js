const mongoose = require("mongoose");

const productSchema =new mongoose.Schema
({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  manufacturer: {
    type:String,
    // required:[true, "please enter product manufacturer"],
  },
  description: {
    type: String,
    // required: [true, "Please Enter product Description"],
  },
  packaging: {
    type:String,
    // required:false,
  },
  salt_composition:{
    type:String,
    // required:false,
  },
  common_side_effect:{
    type:String,
    // required:false,
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  // ratings: {
  //   type: Number,
  //   default: 0,
  // },
// WE WILL BE USING CLOUDINARY FOR STORING IMAGES.
  images: [
    {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
  ],
  category: {
    type: String,
    // required: [true, "Please Enter Product Category"],
  },
  Stock: {
    type: Number,
    // required: [true, "Please Enter product Stock"],
    // maxLength: [4, "Stock cannot exceed 4 characters"],
    // default: 70,
  },
  // numOfReviews: {
  //   type: Number,
  //   default: 0,
  // },
  // reviews: [
  //   {
  //     user: {
  //       type: mongoose.Schema.ObjectId,
  //       ref: "User",
  //       required: true,
  //     },
  //     name: {
  //       type: String,
  //       required: true,
  //     },
  //     rating: {
  //       type: Number,
  //       required: true,
  //     },
  //     comment: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],

  // we are commenting user for now/
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User",
  //   required: false,
  // },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  
});

// importing in productController.
module.exports = mongoose.model("Product", productSchema);