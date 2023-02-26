const ErrorHandler = require("../utils/errorhandler");

exports.isAuthenticated=(req,res,next) => {
    const token = req.cookies["connect.sid"];
    if (!token) {
      return next(new ErrorHandler("Not Logged In", 401));
    }
    next();
  };
// exports.isAuthenticated = (req, res, next) => {
//   const token = req.cookies["connect.sid"];
//   if (!token) {
//     // if the token doesn't exist, the user is not authenticated
//     return next(new ErrorHandler("Not Logged In", 401));
//   }
//   // if the token exists, check if the user is authenticated with Passport
//   if (req.isAuthenticated()) {
//     // user is authenticated, continue with the next middleware
//     return next();
//   } else {
//     // user is not authenticated, redirect to the homepage or other appropriate URL
//     res.redirect(process.env.FRONTEND_URL);
//   }
// };


  // importing in orderRoutes
  exports.authorizeAdmin = (req, res, next) => {
      // checking from the database ki user.role ki value admin hai ki nahi.
      if (req.user.role!=="admin") {
        return next(new ErrorHandler("Only admin allowed",405));
      }
      next();
    };