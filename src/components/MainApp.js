import React, {useContext} from 'react';
import Songs from './Songs';
import Playlist from './Playlist';
import {ViewContext} from '../Contexts/ViewContext';
import ReactPlayer from './ReactPlayer';
import SearchBar from './SearchBar'
import YoutubePlaylist from './YoutubePlaylist';

export default function MainApp() {
  const [data, setData] = React.useState(null);
  const [view, setView] = useContext(ViewContext);

  React.useEffect(async () => {
    const response1 = await fetch('/api');
    const response2 = await response1.json();
    const data = await response2;
    console.log(data.message);
    setData(data.message);
  }, []);

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
      {/* <SearchBar /> */}
      <button
        className="YoutubePlaylistSongButton"
        onClick={async (e) => {
          e.preventDefault();
          {
            view === 'search' ? setView('playlist') : setView('search');
          }
          console.log(view);
        }}
      >
        YOUTUBE PLAYLISTS/ SEARCH
      </button>
      {view === 'search' ? <SearchBar /> : <YoutubePlaylist/>}
    </div>
  );
}
