const express = require('express');
const SpotifyController = require('../controllers/spotifyController');
const router = express.Router();

router.get('/login', SpotifyController.startAuth);

router.get('/auth', SpotifyController.confirmAuth, (req, res) => {
  res.status(200).redirect('/app');
});

router.get('/playlists', SpotifyController.sendPlaylists, (req, res) => {
  // console.log(res.locals.playlists)
  res.status(200).json(res.locals.playlists);
});

router.get(
  '/songs/:playlistID',
  SpotifyController.sendPlaylistSongs,
  (req, res) => {
    res.status(200).json(res.locals.playlistSongs);
  }
);

module.exports = router;
