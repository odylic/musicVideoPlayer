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
              const search = `${song.songName} ${song.artistArr.join(' ')}`;

              // await for promised from youtube/:song/:artist route
              const response = await fetch(
                `/youtube/${song.songName}/${song.artistArr.join(' ')}`
              );
              
              // json Parse the response
              const data = await response.json();
              const urlArray = [];
              // put the urls into the array
              data.map((youtubeSearchItem) => {
                urlArray.push(youtubeSearchItem.url);
              });

              // set the video state with the urlsArray
              setVideo(urlArray);
              console.log(video);
            }}
          >
            {song.songName} -{song.artistArr[0]}{' '}
          </button>
        </div>
      ))}
    </div>
  );
}
