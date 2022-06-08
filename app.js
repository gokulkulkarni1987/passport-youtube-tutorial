const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');

const app = express();

//setup view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
  maxAge: 24 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

// initialise passport
app.use(passport.initialize());
app.use(passport.session());

// connect to Mongo DB
mongoose.connect(keys.mongoDB.dbURI, () => {
  console.log('Connected to MongoDB');
});

//setup routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create root for home
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => {
  console.log('app now listening for requests on post 3000');
});

