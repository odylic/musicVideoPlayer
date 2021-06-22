import React, {useState, useContext} from 'react';

import '../App.scss';
import {ChakraProvider, Box, Button, GridItem, Grid} from '@chakra-ui/react';
import MainApp from './MainApp';
import {SongsProvider} from '../Contexts/SongContext';
import {ViewProvider} from '../Contexts/ViewContext';
import {VideoProvider} from '../Contexts/VideoContext';

export default function App() {
  // use hook to view playlist or songs
  const [view, setView] = useState();

  // // React.useEffect(() => {
  // //   fetch('/api')
  // //     .then((res) => {
  // //       console.log(res)
  // //       return res.json()
  // //     })
  // //     .then((data) => setData(data.message));
  // // }, []);

  return (
    // SongsProvider provides the context for SongsContext with createContext
    <ViewProvider>
      <SongsProvider>
        <VideoProvider>
          <MainApp />
        </VideoProvider>
      </SongsProvider>
    </ViewProvider>
  );
}
