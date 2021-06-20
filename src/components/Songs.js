import React, {useContext} from 'react';
import {SongContext} from './SongContext';

export default function Songs() {
  const [songs, setSongs] = useContext(SongContext);
  return (
    <div>
      Songs
      {songs.map((song) => (
        <div>
          {song.songName}
        </div>
      ))}
    </div>
  );
}
