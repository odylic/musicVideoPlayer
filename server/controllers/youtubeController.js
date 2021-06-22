require('dotenv').config();
const {google} = require('googleapis');
const {search} = require('../routers/authRouter');
const youtubeController = {};

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
      // search
      q: query,
      maxResults: 25,
    };

    // await the promise
    const response = await google.youtube('v3').search.list(searchParams);
    const {data} = response;
    const { items } = data;
   

    // place the urls into this array
    const urlArray = [];

    items.map((item) => {
      // console.log(item)
      const url = {title: item.snippet.title, url:`https://www.youtube.com/watch?v=${item.id.videoId}`}
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

// Running the file will hit up the API
// req.body.query
const query = 'bowling for soup';

const searchParams = {
  // API KEY
  key: process.env.YOUTUBE_TOKEN,
  part: 'snippet',
  // search
  q: query,
  maxResults: 1,
};

// returns a promise
// google
//   .youtube('v3')
//   .search.list(searchParams)
//   .then((response) => {
//     const {data} = response;
//     data.items.forEach((item) => {
//       console.log(
//         `Title: ${item.snippet.title}\nURL: <a href="https://www.youtube.com/watch?v=${item.id.videoId}">`
//       );
//     });
//   })
//   .catch((err) => console.log(err.stack));

const playlistParams = {
  // API KEY
  key: process.env.YOUTUBE_TOKEN,
  part: 'snippet',
  playlistId: 'PLCwVd26SHEzRoUMmd8gdgST1SKIRwERdV',
  maxResults: 1000,
};

// google
//   .youtube('v3')
//   .playlistItems.list(playlistParams)
//   .then((response) => {
//     const {data} = response;
//     data.items.forEach((item) => {
//       console.log(
//         `"https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}",`
//       );
//     });
//   });

module.exports = youtubeController;
