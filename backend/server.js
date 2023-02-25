const app = require("./app");
const dotenv = require("dotenv");
// const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");
const connectPassport= require("./utils/passport")

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`shutting down the server due to uncaught exception.`);
  process.exit(1);
});

// config
dotenv.config({ path: "backend/config/config.env" });

// connect to database > mongoDb
connectDatabase();
// google auth
connectPassport();

// module.exports = razorpay;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     // secure: true,
//   });

app.get("/",(req,res,next)=>{
  res.send("<h1>Backend Working !</h1>")
})

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on PORT: ${process.env.PORT}`);
  // this NODE_ENV MODE IS WRITTEN IN PACKAGE.JSON(backend)
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`shutting down the server due to unhandled promise rejection.`);

  server.close(() => {
    process.exit(1);
  });
});
