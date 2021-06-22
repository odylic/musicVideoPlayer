import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Spacer, GridItem} from '@chakra-ui/react';
import {SongContext} from '../Contexts/SongContext';
import {ViewContext} from '../Contexts/ViewContext';
import Songs from './Songs';

export default function Playlist() {
  // useState hook, initial is an empty array
  const [playlists, setPlaylist] = useState([]);
  const [view, setView] = useContext(ViewContext);
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
    <div className="playlist">
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
                view ? setView(false) : setView(true);
                // console.log(view);
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
