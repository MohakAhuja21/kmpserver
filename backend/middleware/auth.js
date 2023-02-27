const ErrorHandler = require("../utils/errorhandler");

exports.isAuthenticated=(req,res,next) => {
    const token = req.cookies["connect.sid"];
    if (!token) {
      return next(new ErrorHandler("Not Logged In", 401));
    }
    next();
  };

  // importing in orderRoutes
  exports.authorizeAdmin = (req, res, next) => {
      // checking from the database ki user.role ki value admin hai ki nahi.
      if (req.user.role!=="admin") {
        return next(new ErrorHandler("Only admin allowed",405));
      }
      next();
    };