import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Spacer, GridItem} from '@chakra-ui/react';
import {SongContext} from './SongContext';

export default function Playlist() {
  // useState hook, initial is an empty array
  const [playlists, setPlaylist] = useState([]);
  // useContext for songs
  const [songs, setSongs] = useContext(SongContext);

  // runs after every render
  useEffect(() => {
    // if nothing is in playlists state
    if (playlists.length === 0) {
      // fetch from spotify/playlist route
      fetch('/spotify/playlists')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // sets playlists state as data
          setPlaylist(data);
        })
        .catch((err) => {
          console.log(err.stack);
        });
    }
  });

  return (
    <div>
      {playlists.map((playlist) => {
        return (
          <div key={playlist.id}>
            {/* button click to show songs */}
            <button
              onClick={async (e) => {
                e.preventDefault();
                const response = await fetch(`/spotify/songs/${playlist.id}`);
                console.log(response);
                const data = await response.json();
                console.log(data);
                // useState hook to set the song with the data from the fetch hook
                setSongs(data);
              }}
              style={{height: '30px'}}
              className="playlistButton"
            >
              {playlist.name}
            </button>
          </div>
        );
      })}
    </div>
  );
}
