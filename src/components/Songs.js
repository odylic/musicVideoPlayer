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

                // await for youtube playlist search
                const response = await fetch(
                  `/youtube/searchPlaylist?searchInput=${search}`
                );

                // // json Parse the response
                const data = await response.json();
                const playlistIdArr = [];
                // put the urls into the array
                data.map((youtubeSearchItem) => {
                  // console.log(youtubeSearchItem);
                  playlistIdArr.push(youtubeSearchItem.playlistId);
                });

                const response1 = await fetch(
                  `/youtube/songs/${playlistIdArr[0]}`
                );
                // console.log(response1);
                const data1 = await response1.json();
                // console.log(data1);
                const urlArr = [];
                data1.map((item) => {
                  urlArr.push(item.url);
                });
                // console.log(urlArr);
                // // useState hook to set the song with the data from the fetch hook
                setVideo(urlArr);
                
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
