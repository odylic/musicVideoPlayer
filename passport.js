require('dotenv').config();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const YoutubeStrategy = require('passport-youtube-v3').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(null, user);
//   });
// });

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT,
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, cb) {
      // passing in accessToken and refreshToken, store in a cookie
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;
      console.log(
        `       req.session.accessToken: ${req.session.accessToken}
        req.session.refreshToken: ${req.session.refreshToken}
      `
      );
      return cb(null, profile);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.use(
  new YoutubeStrategy(
    {
      clientID: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      callbackURL: process.env.YOUTUBE_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, cb) {
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;
      console.log('tokens in passport:', accessToken, refreshToken);
      return cb(null, profile);
    }
  )
);
