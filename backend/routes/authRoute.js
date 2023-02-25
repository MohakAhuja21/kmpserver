const express = require("express");
const passport = require("passport");
const {
    myProfile,
    logout,
  getAdminUsers,
  getAdminStats,
} = require("../controllers/user");
const { isAuthenticated, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", { scope: ["profile"] })
);

// router.get("/login/success", (req, res) => {
  // if (req.user) {
  //   res.status(200).json({ user: req.user });
  // } else {
  //   res.status(401).json({ message: "Not Authorized" });
  // }
// });

// router.get("/login/failed", (req, res) => {
//   res.status(401).json({ message: "login failed" });
// });

router.get(
  "/login",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
  })
);

router.get("/me", isAuthenticated, myProfile);
router.get("/logout", logout);

//add admin route
router.get("/admin/users", isAuthenticated, authorizeAdmin, getAdminUsers);

router.get("/admin/stats", isAuthenticated, authorizeAdmin, getAdminStats);

// importing in app.js
module.exports = router;
