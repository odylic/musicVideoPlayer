require('dotenv').config();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const YoutubeStrategy = require('passport-youtube-v3').Strategy;
const User = require('./server/models/mongoModel');
const session = require('express-session');
const db = require('./server/models/sqlModel');

let tokens = {};

passport.serializeUser(function (user, done) {
  done(null, user);
});
// passport.serializeUser(function (user, done) {
//   done(null, user_id);
// });

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
    function (req, accessToken, refreshToken, profile, done) {
      // passing in accessToken and refreshToken, store in a cookie
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;
      console.log(
        `       req.session.accessToken: ${req.session.accessToken}
        req.session.refreshToken: ${req.session.refreshToken}
      `
      );
      return done(null, profile);
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
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
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
    function (req, accessToken, refreshToken, profile, done) {
      tokens.accessTokenYoutube = accessToken;
      tokens.refreshTokenYoutube = refreshToken;

      // destructure displayName and id from youtube profile
      const {displayName, id} = profile;

      const findUser = `
      SELECT *
      FROM youtubetokens
      WHERE youtube_id = $1
      `;
      const UserId = [id];
      db.query(findUser, UserId).then((response) => {
        console.log('response: ', response);
        return done(null, profile);
      });

      // const addUser = `INSERT INTO youtubetokens (youtube_id, name, access_token, refresh_token) VALUES ($1, $2, $3, $4)`;
      // const newUser = [id, displayName, accessToken, refreshToken];
      // db.query(addUser, newUser).then((response) => {
      //   console.log('response: ', response);
      //   return done(null, profile);
      // });

      // find in database if youtube_id is already saved
      User.findOne({youtube_id: id}).then((response) => {
        // if there's an id found, return done callback
        // console.log(response);
        if (response) return done(null, response);
        // if no id is found
        if (!response) {
          // create a new User
          const user = new User({
            youtube_id: id,
            name: displayName,
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          // save the user to the database
          user.save(function (err) {
            // error handler
            if (err) return done(err);
            // console.log(user);
            // return done callback with the new user
            return done(null, user);
          });
          // return done(null, profile);
        }
      });
    }
  )
);

module.exports = tokens;
