import React from 'react';
import Playlist from './Playlist';
import '../App.scss';
import {ChakraProvider, Box, Button, GridItem, Grid} from '@chakra-ui/react';
import {SongsProvider} from './SongContext';
import Songs from './Songs';

function App() {
  const [data, setData] = React.useState(null);

  // // React.useEffect(() => {
  // //   fetch('/api')
  // //     .then((res) => {
  // //       console.log(res)
  // //       return res.json()
  // //     })
  // //     .then((data) => setData(data.message));
  // // }, []);

  React.useEffect(async () => {
    const response1 = await fetch('/api');
    const response2 = await response1.json();
    const data = await response2;
    console.log(data.message);
    setData(data.message);
  }, []);

  return (
    // SongsProvider provides the context for SongsContext with createContext
    <SongsProvider>
      <div className="App">
        <header className="App-header">
          <p>{!data ? 'Loading...' : data}</p>
          <Playlist />
          <Songs />
        </header>
      </div>
    </SongsProvider>
  );
}

export default App;
