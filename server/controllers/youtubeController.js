require('dotenv').config();
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const {search} = require('../routers/authRouter');
const youtubeController = {};

const config = {
  clientID: process.env.YOUTUBE_CLIENT_ID,
  clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
  callbackURL: process.env.YOUTUBE_CALLBACK_URL,
};

// youtube query middleware
youtubeController.getYoutubeUrl = async (req, res, next) => {
  try {
    // req.params should be the input to search for
    const {song, artist} = req.params;
    const query = song + ' ' + artist;

    const searchParams = {
      // API KEY
      key: process.env.YOUTUBE_TOKEN,
      part: 'snippet',
      type: 'video',
      // search
      q: query,
      maxResults: 1,
    };

    // await the promise
    const response = await google.youtube('v3').search.list(searchParams);
    const {data} = response;
    const {items} = data;

    // place the urls into this array
    const urlArray = [];

    items.map((item) => {
      // console.log(item)
      const url = {
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      };
      urlArray.push(url);
    });

    // stores the url in the local memory
    // console.log('urlarray: ', urlArray);
    res.locals.url = urlArray;
    return next();
  } catch (err) {
    console.log(err.stack);
  }
};

youtubeController.search = async (req, res, next) => {
  try {
    const {searchInput} = req.query;
    const query = searchInput;

    const searchParams = {
      // API KEY
      key: process.env.YOUTUBE_TOKEN,
      part: 'snippet',
      type: 'video',
      // search
      q: query,
      maxResults: 15,
    };

    // await the promise
    const response = await google.youtube('v3').search.list(searchParams);
    const {data} = response;
    const {items} = data;

    // place the urls into this array
    const urlArray = [];

    items.map((item) => {
      // console.log(item)
      const url = {
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails,
      };
      urlArray.push(url);
    });

    // store in local memory
    res.locals.searchResult = urlArray;
    return next();
  } catch (err) {
    console.log(err.stack);
  }
};

youtubeController.getPlaylist = async (req, res, next) => {
  try {
    const {accessTokenYoutube, refreshTokenYoutube} = req.cookies;

    const oauth2Client = new OAuth2(
      config.clientID,
      config.clientSecret,
      config.callbackURL
    );

    oauth2Client.credentials = {
      access_token: accessTokenYoutube,
      refresh_token: refreshTokenYoutube,
    };

    const playlistParams = {
      // API KEY
      key: process.env.YOUTUBE_TOKEN,
      part: 'snippet',
      mine: true,
      maxResults: 50,
    };

    const response = await google
      .youtube({version: 'v3', auth: oauth2Client})
      .playlists.list(playlistParams);
    // console.log(response);
    const {data} = response;
    // console.log(data)
    const {items} = data;
    // console.log(items);
    const playlistArr = [];
    items.map((playlist) => {
      const playlistItem = {
        title: playlist.snippet.title,
        id: playlist.id,
      };
      // console.log(playlistItem);
      playlistArr.push(playlistItem);
    });
    res.locals.playlistResults = playlistArr;
    return next();
  } catch (err) {
    console.log(err.stack);
  } finally {
  }
};

youtubeController.getSongs = async (req, res, next) => {
  try {
    const {accessTokenYoutube, refreshTokenYoutube} = req.cookies;
    const {id} = req.params;
    // console.log(id);

    const oauth2Client = new OAuth2(
      config.clientID,
      config.clientSecret,
      config.callbackURL
    );

    oauth2Client.credentials = {
      access_token: accessTokenYoutube,
      refresh_token: refreshTokenYoutube,
    };

    const playlistParams = {
      // API KEY
      key: process.env.YOUTUBE_TOKEN,
      part: 'snippet',
      playlistId: id,
      maxResults: 1000,
    };

    const response = await google
      .youtube({version: 'v3', auth: oauth2Client})
      .playlistItems.list(playlistParams);
    // console.log(response);
    const {data} = response;
    // console.log(data)
    const {items} = data;
    // console.log(items);
    // the array that gets stored in memory with all the iterated items
    const playlistArr = [];
    items.map((playlist) => {
      const playlistItem = {
        title: playlist.snippet.title,
        videoId: playlist.snippet.resourceId.videoId,
        url: `https://www.youtube.com/watch?v=${playlist.snippet.resourceId.videoId}`,
      };
      // console.log(playlistItem);
      // push into the array
      playlistArr.push(playlistItem);
    });
    res.locals.songs = playlistArr;
    return next();
  } catch (err) {
    console.log(err.stack);
  }
};

youtubeController.searchPlaylist = async (req, res, next) => {
  try {
    const {searchInput} = req.query;
    const query = searchInput;

    const searchParams = {
      // API KEY
      key: process.env.YOUTUBE_TOKEN,
      part: 'snippet',
      type: 'playlist',
      // search
      q: query,
      maxResults: 25,
    };

    // await the promise
    const response = await google.youtube('v3').search.list(searchParams);
    const {data} = response;
    const { items } = data;
    console.log(items)

    // place the urls into this array
    const urlArray = [];

    items.map((item) => {
      // console.log(item)
      const url = {
        title: item.snippet.title,
        playlistId: item.id.playlistId,
        thumbnail: item.snippet.thumbnails,
      };
      urlArray.push(url);
    });

    // store in local memory
    res.locals.searchResult = urlArray;
    return next();
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports = youtubeController;
