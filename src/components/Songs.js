import React, {useContext} from 'react';
import {SongContext} from '../Contexts/SongContext';
import {VideoContext} from '../Contexts/VideoContext';

export default function Songs() {
  const [songs, setSongs] = useContext(SongContext);
  const [video, setVideo] = useContext(VideoContext);
  return (
    <div className="songs">
      {songs.map((song) => (
        <div>
          <button
            className="songButtons"
            style={{height: '30px'}}
            onClick={async (e) => {
              e.preventDefault();
              // search parameters for name and artists combined in a string
              try {
                const search = `${song.songName} ${song.artistArr[0]}`;

                // await for promised from youtube/:song/:artist route
                const response = await fetch(
                  `/youtube/${song.songName}/${song.artistArr[0]}`
                );

                // json Parse the response
                const data = await response.json();
                const urlArray = [];
                // put the urls into the array
                data.map((youtubeSearchItem) => {
                  // console.log(youtubeSearchItem);
                  urlArray.push(youtubeSearchItem.url);
                });

                const updatedPlaylist = [...video, ...urlArray];

                // set the video state with the urlsArray
                setVideo(updatedPlaylist);
                // printing to try to debug why the state doesn't update on the first click but does on second with 2 updates
                // console.log(await updatedPlaylist)
              } catch (err) {
                console.log(err.stack);
              }
            }}
          >
            {song.songName} -{song.artistArr[0]}{' '}
          </button>
        </div>
      ))}
    </div>
  );
}
