import React, {useState, useEffect, useContext} from 'react';
import ReactPlayer from 'react-player';
import {VideoContext} from '../Contexts/VideoContext';
import {ViewContext} from '../Contexts/ViewContext';

export default function reactPlayer() {
  const [light, setLight] = useState(false);
  const [video, setVideo] = useContext(VideoContext);
  console.log('video in reactplayer: ', video);

  // useEffect(() => {
  //   console.log('useEffect: ', video);
  //   helperFunction()
  // }, [video]);

  // const helperFunction = () => {
  //   return (
  //     <ReactPlayer
  //       url={video}
  //       width={`100%`}
  //       height={`100%`}
  //       controls={true}
  //       loop={true}
  //       playing={true}
  //       // light={true}
  //       playsinline={true}
  //       onReady={()=>this.setState()}
  //     />
  //   );
  // };

  return (
    <div className="react-player">
      {video.length !== 0 ? (
        <ReactPlayer
          url={video}
          width={`100%`}
          height={`100%`}
          controls={true}
          loop={true}
          playing={true}
          light={light}
          playsinline={true}
        />
      ) : (
        <div className="reactplayerfiller">
          <h1>Music Video Player</h1>
          <h2>Please Choose a Song/Playlist</h2>
        </div>
      )}
      <button
        className="light"
        onClick={async (e) => {
          e.preventDefault();
          light ? setLight(false) : setLight(true);
        }}
      >
        Light
      </button>
    </div>
  );
}
