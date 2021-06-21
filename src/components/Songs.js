import React, {useContext} from 'react';
import {SongContext} from '../Contexts/SongContext';

export default function Songs() {
  const [songs, setSongs] = useContext(SongContext);
  return (
    <div className="songs">
      Songs
      {songs.map((song) => (
        <div>
          {song.songName}
        </div>
      ))}
    </div>
  );
}
