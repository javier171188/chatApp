const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../model/user");

passport.use(new LocalStrategy(
  {
    usernameField: "email",
  },
  ((email, password, done) => {
    User.findOne({ email }, async (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: "Incorrect email or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect email or password." });
      }

      return done(null, user);
    });
  }),
));
