const express = require('express');
const youtubeController = require('../controllers/youtubecontroller');
const router = express.Router();

// gets the songs from the youtube playlist
router.get('/songs/:id', youtubeController.getSongs, (req, res) => {
  res.status(200).json(res.locals.songs);
});

// gets the youtubeURL for react player
router.get('/:song/:artist', youtubeController.getYoutubeUrl, (req, res) => {
  // console.log('in router', res.locals.url);
  res.status(200).json(res.locals.url);
});

router.get('/search', youtubeController.search, (req, res) => {
  // console.log('in router', res.locals.searchResult);
  res.status(200).json(res.locals.searchResult);
});

router.get('/searchPlaylist', youtubeController.searchPlaylist, (req, res) => {
  // console.log('in router', res.locals.searchResult);
  res.status(200).json(res.locals.searchResult);
});

router.get('/playlist', youtubeController.getPlaylist, (req, res) => {
  res.status(200).json(res.locals.playlistResults);
});

// router.post('/postTokens', sqlController.saveTokens, (req, res) => {
//   res.status(200).json(res.locals.response);
// });

module.exports = router;
