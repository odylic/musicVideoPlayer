import React, {useState, useContext} from 'react';
import Songs from './Songs';
import Playlist from './Playlist';
import {ViewContext} from '../Contexts/ViewContext';
import ReactPlayer from './ReactPlayer';
import SearchBar from './SearchBar';
import YoutubePlaylist from './YoutubePlaylist';
import {VideoProvider} from '../Contexts/VideoContext';

export default function MainApp() {
  const [data, setData] = React.useState(null);
  const [view, setView] = useContext(ViewContext);
  const [youtubeView, setYoutubeView] = useState('playlist');


  return (
    <div className="grid">
      <button
        className="playlistSongButton"
        onClick={async (e) => {
          e.preventDefault();
          {
            view === 'songs' ? setView('playlist') : setView('songs');
          }
          console.log(view);
        }}
      >
        VIEW PLAYLISTS/SONGS
      </button>
      {view === 'songs' ? <Songs /> : <Playlist />}

      <ReactPlayer />

      <button
        className="YoutubePlaylistSongButton"
        onClick={async (e) => {
          e.preventDefault();
          {
            youtubeView === 'search'
              ? setYoutubeView('playlist')
              : setYoutubeView('search');
          }
          console.log(youtubeView);
        }}
      >
        YOUTUBE PLAYLISTS/ SEARCH
      </button>
      {youtubeView === 'search' ? <SearchBar /> : <YoutubePlaylist />}
    </div>
  );
}
