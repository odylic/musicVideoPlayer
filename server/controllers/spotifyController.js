require('dotenv').config();
const {parse} = require('@babel/core');
const {genSalt} = require('bcrypt');
const btoa = require('btoa');
const fetch = require('node-fetch');
const spotifyController = {};

spotifyController.startAuth = async (req, res, next) => {
  try {
    const state = await genSalt(1);
    res.cookie('spotifyState', state);
    const spotifyData = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT,
      response_type: 'code',
      state: state,
      redirect_uri: process.env.SPOTIFY_REDIRECT,
      scope:
        'playlist-read-private playlist-read-collaborative user-library-read',
    });
    res.redirect('https://accounts.spotify.com/authorize?' + spotifyData);
  } catch (e) {
    console.error(e);
  }
  return;
};

spotifyController.confirmAuth = async (req, res, next) => {
  try {
    if (req.query.error) throw req.query.error;

    // genSalt(1)
    const state = req.query.state || null;
    // maybe this is the spotify data code
    const code = req.query.code || null;

    // this is the cookie spotifyState, which needs the cookieParser
    const cookieState = req.cookies.spotifyState || null;

    // if state isn't same as cookieState or doesn't exist, checks sessionID as state
    if (!state || !cookieState || state !== cookieState)
      throw 'Invalid state token';

    // fetchbody are the search parameters
    const fetchBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT,
    });

    // binary version of client and secret that spotify wants
    const spotifyAuth = btoa(
      process.env.SPOTIFY_CLIENT + ':' + process.env.SPOTIFY_SECRET
    );

    // fetch response for token, post request, with headers with the search parameters of fetchBody, and an outbuffer with the tokens
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + spotifyAuth,
      },
      body: fetchBody,
    });

    // if status is not 200, throw error status and status text
    if (response.status !== 200)
      throw (
        'Spotify Auth API problem: ' +
        response.status +
        ' ' +
        response.statusText
      );

    // parsed response has access tokens and refresh tokens
    const parsedResponse = await response.json();

    // stores the spotify tokens in local memory
    res.locals.spotifyTokens = {
      accessToken: parsedResponse.access_token || null,
      refreshToken: parsedResponse.refresh_token || null,
    };

    // makes the response put the cookies
    res.cookie('refreshToken', parsedResponse.refresh_token);
    res.cookie('accessToken', parsedResponse.access_token);
    // to console.log cookies, use req.cookies
    // console.log(req.cookies.refreshToken);

    return next();
  } catch (e) {
    console.error(e);
    return;
  }
};

spotifyController.sendPlaylists = async (req, res, next) => {
  try {
    const {accessToken, refreshToken} = req.cookies;

    const queryParams = new URLSearchParams({
      limit: 1000,
    });

    // has the response with headers and buffer, this is the api where you get the playlist data
    const response = await fetch(
      'http://api.spotify.com/v1/me/playlists?limit=50',
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }
    );
    // parsedResponse has the playlists as an items object and the href
    const parsedResponse = await response.json();

    // error handler
    if (response.status !== 200) throw parsedResponse;

    // destructure the items which are playlists
    const {items} = parsedResponse;

    const playlistArr = [];

    // for all items in items array
    for (let i = 0; i < items.length; i += 1) {
      // destructure name and id of items
      const {name, id} = items[i];
      // push into the playlist array
      playlistArr.push({name, id});
    }

    res.locals.playlists = playlistArr;
    // console.log(res.locals.playlists)
    return next();
  } catch (err) {
    console.log(err.stack);
    return;
  }
};

spotifyController.sendPlaylistSongs = async (req, res, next) => {
  try {
    const {accessToken, refreshToken} = req.cookies;
    const {playlistID} = req.params;

    // fetch the playlistId array of songs
    const response = await fetch(
      'https://api.spotify.com/v1/playlists/' +
        playlistID +
        '?fields=tracks.items(track(name,artists(name)))',
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }
    );

    // json parse response
    const parsedResponse = await response.json();

    // error handler
    if (response.status !== 200) throw parsedResponse;

    // tracks is tracks.items
    const tracks = parsedResponse.tracks.items;
    const songArr = [];

    // iterate through the playlist and fill the array with the songName and artist
    for (let i = 0; i < tracks.length; i += 1) {
      const songName = tracks[i].track.name;
      const artistArr = tracks[i].track.artists.map((el) => el.name);

      songArr.push({songName, artistArr});
    }

    // put in local memory
    res.locals.playlistSongs = songArr;

    return next();
  } catch (err) {
    console.log(err.stack);
    return;
  }
};

module.exports = spotifyController;

// module.exports = {
//   async startAuth(req, res, next) {
//     try {
//       const state = await genSalt(1);

//       res.cookie('spotifyState', state);

//       const spotifyData = new URLSearchParams({
//         client_id: process.env.SPOTIFY_CLIENT,
//         response_type: 'code',
//         state: state,
//         redirect_uri: process.env.SPOTIFY_REDIRECT,
//         scope:
//           'playlist-read-private playlist-read-collaborative user-library-read',
//       });

//       res.redirect('https://accounts.spotify.com/authorize?' + spotifyData);
//     } catch (e) {
//       console.error(e);
//     }

//     return;
//   },

//   async confirmAuth(req, res, next) {
//     try {
//       if (req.query.error) throw req.query.error;

//       const state = req.query.state || null;
//       const code = req.query.code || null;

//       const cookieState = req.cookies.spotifyState || null;

//       if (!state || !cookieState || state !== cookieState)
//         throw 'Invalid state token';

//       const fetchBody = new URLSearchParams({
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: process.env.SPOTIFY_REDIRECT,
//       });

//       const spotifyAuth = btoa(
//         process.env.SPOTIFY_CLIENT + ':' + process.env.SPOTIFY_SECRET
//       );

//       const response = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: 'Basic ' + spotifyAuth,
//         },
//         body: fetchBody,
//       });

//       if (response.status !== 200)
//         throw (
//           'Spotify Auth API problem: ' +
//           response.status +
//           ' ' +
//           response.statusText
//         );

//       const parsedResponse = await response.json();

//       res.locals.spotifyTokens = {
//         accessToken: parsedResponse.access_token || null,
//         refreshToken: parsedResponse.refresh_token || null,
//       };

//       res.cookie('refreshToken', parsedResponse.refresh_token);
//       res.cookie('accessToken', parsedResponse.access_token);

//       return next();
//     } catch (e) {
//       console.error(e);
//       return;
//     }
//   },

//   async refreshToken(refreshToken) {
//     try {
//       const fetchBody = new URLSearchParams({
//         grant_type: 'refresh_token',
//         refresh_token: refreshToken,
//         client_id: process.env.SPOTIFY_CLIENT,
//         client_secret: process.env.SPOTIFY_SECRET,
//       });

//       const spotifyAuth = btoa(
//         `${process.env.SPOTIFY_CLIENT}:${process.env.SPOTIFY_SECRET}`
//       );

//       const response = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: 'Basic ' + spotifyAuth,
//         },
//         body: fetchBody,
//       });

//       const parsedResponse = await response.json();

//       res.cookie('accessToken', parsedResponse.access_token);
//       if (parsedResponse.refresh_token)
//         res.cookie('refreshToken', parsedResponse.refresh_token);

//       return parsedResponse.access_token;
//     } catch (e) {
//       console.error(e);
//       return;
//     }
//   },

//   async sendPlaylists(req, res, next) {
//     try {
//       const {accessToken, refreshToken} = req.cookies;

//       const queryParams = new URLSearchParams({
//         limit: 50,
//       });
//       //const test_token = "BQA5QHd5q4pwqA5Eikvn7kL7kGDZBTHevZIDHt7hLvelqD3Wo6kYsPuM9qd4gS8kHgOOb_Oz5Bnow7A6S6Cbq5l6sRaYrOdIn_Bc72j8fbdn9d2fFkMAzQIE1S87BiPGIZZhd55WCsZB8iMN7N-9yDPRg47DWBEzxxoepEJRGTly_6Vk_ARZ_HoKvis7wLZo"
//       const response = await fetch(
//         'https://api.spotify.com/v1/me/playlists?limit=50',
//         {
//           headers: {
//             Authorization: 'Bearer ' + accessToken,
//           },
//         }
//       );

//       const parsedResponse = await response.json();

//       if (response.status !== 200) throw parsedResponse;

//       const {items} = parsedResponse;

//       const playlistArr = [];

//       for (let i = 0; i < items.length; i += 1) {
//         const {name, id} = items[i];

//         playlistArr.push({name, id});
//       }

//       res.locals.playlists = playlistArr;

//       return next();
//     } catch (e) {
//       console.error(e);
//       return;
//     }
//   },

//   async sendPlaylistSongs(req, res, next) {
//     try {
//       const {accessToken, refreshToken} = req.cookies;
//       const {playlistID} = req.params;

//       const response = await fetch(
//         'https://api.spotify.com/v1/playlists/' +
//           playlistID +
//           '?fields=tracks.items(track(name,artists(name)))',
//         {
//           headers: {
//             Authorization: 'Bearer ' + accessToken,
//           },
//         }
//       );

//       const parsedResponse = await response.json();

//       if (response.status !== 200) throw parsedResponse;

//       const tracks = parsedResponse.tracks.items;

//       const songArr = [];

//       for (let i = 0; i < tracks.length; i += 1) {
//         const songName = tracks[i].track.name;
//         const artistArr = tracks[i].track.artists.map((el) => el.name);

//         songArr.push({songName, artistArr});
//       }

//       res.locals.playlistSongs = songArr;

//       return next();
//     } catch (e) {
//       console.error(e);
//       return;
//     }
//   },
// };
