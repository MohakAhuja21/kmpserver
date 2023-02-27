const dotenv = require("dotenv");
const express = require("express");
const { urlencoded } = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");
const passport = require("passport");
const morgan = require('morgan');
const session = require("express-session");
// const MongoStore = require('connect-mongo');
const {connectPassport} = require("./utils/passport");

const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// config
dotenv.config({ path: "backend/config/config.env" });

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// connecting middleware // change secret to process.env.SESSION_SECRET, if not facing any problem
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    },
  })
);
// use this cookieParser before passport step only.
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({extended: true,}));

// after using session. Then only we can begin with this step
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");

connectPassport();

// importing and using routes
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const authRoute= require("./routes/authRoute");

// api
app.use("/api/v1", productRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", authRoute);

app.use(errorMiddleware);

module.exports = app;
