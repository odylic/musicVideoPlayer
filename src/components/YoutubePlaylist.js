import React, {useContext, useEffect, useState} from 'react';
import {SongContext} from '../Contexts/SongContext';
import {ViewContext} from '../Contexts/ViewContext';
import {VideoContext} from '../Contexts/VideoContext';

export default function YoutubePlaylist() {
  // useState hook, initial is an empty array
  const [playlists, setPlaylist] = useState([]);
  const [view, setView] = useContext(ViewContext);
  // useContext for songs
  const [songs, setSongs] = useContext(SongContext);
  const [video, setVideo] = useContext(VideoContext);

  // runs after every render
  useEffect(() => {
    // if nothing is in playlists state
    if (playlists.length === 0) {
      // fetch from spotify/playlist route
      fetch('/youtube/playlist')
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          // sets playlists state as data
          setPlaylist(data);
        })
        .catch((err) => {
          console.log(err.stack);
        });
    }
  });

  return (
    <div className="YoutubePlaylist">
      {playlists.length !== 0
        ? playlists.map((playlist) => {
            return (
              <div>
                {/* button click to show songs */}
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    const response = await fetch(
                      `/youtube/songs/${playlist.id}`
                    );
                    // console.log(playlist)
                    // console.log(response);
                    const data = await response.json();
                    // console.log(data);
                    const urlArr = [];
                    data.map((item) => {
                      urlArr.push(item.url);
                    });
                    console.log(urlArr);
                    // // useState hook to set the song with the data from the fetch hook
                    setVideo(urlArr);
                    // // if view is true (showing playlist), set to false (showing songs)
                    // view === 'playlist'
                    //   ? setView('songs')
                    //   : setView('playlist');
                    // console.log(view);
                  }}
                  style={{height: '30px'}}
                  className="playlistButton"
                >
                  {playlist.title}
                </button>
              </div>
            );
          })
        : 'Sign in with Youtube'}
    </div>
  );
}
