const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    //options for google strategy
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
  }, (accessToke, refreshToken, profile, done) => {
    //passport callback function
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if (currentUser) {
        console.log('User is: ', currentUser);
        done(null, currentUser);
      } else {
        new User({
          username: profile.displayName,
          googleId: profile.id,
        }).save().then((newUser) => {
          console.log('new user created: ', newUser);
          done(null, newUser);
        });
      }
    });
  })
);