const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const PORT = 3000;
app.use(express.static(__dirname + '/public'));
const passport = require('passport');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cookieSession = require('cookie-session');
require('./passport');
const session = require('express-session');

const authRouter = require('./server/routers/authRouter');
const authController = require('./server/controllers/authController');
const spotifyRouter = require('./server/routers/spotifyRouter');
const youtubeRouter = require('./server/routers/youtubeRouter');

// use spotify/auth/
app.use('/spotify', spotifyRouter);
app.use('/youtube', youtubeRouter);

app.get('/ping', (req, res) => {
  res.json({message: 'pong'});
});

app.get('/test', (req, res) => {
  res.json({message: 'Hello from test endpoint'});
});

app.get('/api', (req, res) => {
  res.json({message: 'Hello from server this time'});
});

// app.use(
//   session({
//     secret: 'shhhh',
//     resave: true,
//     saveUninitialized: true,
//   })
// );

// Configure Session Storage
// only cookies for passport is session-name, session-name.sig
app.use(
  cookieSession({
    name: 'session-name',
    keys: ['key1', 'key2'],
  })
);

//Configure Passport
app.use(passport.initialize());
app.use(passport.session());

// spotify passport auth
app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: [
      'playlist-read-private playlist-read-collaborative user-library-read',
    ],
  })
);

// callback redirect
app.get(
  '/spotify/auth',
  passport.authenticate('spotify', {failureRedirect: '/failed'}),
  function (req, res) {
    res.redirect('/app');
  }
);

// Auth Routes
app.get(
  '/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/failed'}),
  function (req, res) {
    res.redirect('/app');
  }
);

// Auth Routes for Youtube
app.get(
  '/auth/youtube',
  passport.authenticate('youtube', {
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
  })
);

app.get(
  '/auth/youtube/callback',
  passport.authenticate('youtube', {failureRedirect: '/failed'}),
  function (req, res) {
    res.redirect('/app');
  }
);

//Logout
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

// authController.checkUserLoggedIn,
// check if logged in, to give access to app
app.get('/app', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on ${PORT} 🚀`);
});
