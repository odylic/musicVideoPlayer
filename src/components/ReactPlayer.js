import React, {useContext} from 'react';
import ReactPlayer from 'react-player';
import {VideoContext} from '../Contexts/VideoContext';

export default function reactPlayer() {
  const [video, setVideo] = useContext(VideoContext);
  return (
    <div className="react-player">
      <ReactPlayer
        url={video}
        width={`100%`}
        height={`100%`}
        controls={true}
        loop={true}
        playing={true}
      />
    </div>
  );
}
