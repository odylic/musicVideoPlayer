import React, {useContext} from 'react';
import Songs from './Songs';
import Playlist from './Playlist';
import {ViewContext} from '../Contexts/ViewContext';
import ReactPlayer from './ReactPlayer';

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
            view ? setView(false) : setView(true);
          }
          console.log(view);
        }}
      >
        VIEW PLAYLISTS/SONGS
      </button>
      {view ? <Songs /> : <Playlist />}
      <ReactPlayer />
    </div>
  );
}
