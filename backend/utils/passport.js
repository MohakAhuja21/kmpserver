// importing in app.js
const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// config
dotenv.config({ path: "backend/config/config.env" });

const connectPassport = () => {
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // database
      const user = await User.findOne({ googleID: profile.id });

      if (user) {
        return done(null, user);
      } else {
        const newUser = await User.create({
          googleID: profile.id,
          name: profile.displayName,
          photo: profile.photos[0].value,
        });
        return done(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
}

// importing in app.js
module.exports = connectPassport;
