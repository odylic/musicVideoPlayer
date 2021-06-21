
import React, {useState, createContext} from 'react';
// export Context with createContext, without a default value in the parens
export const SongContext = createContext();

// export SongsProvider with a parameter of props, pass the SongsProvider to App.js and will be able to declare the context in the children without prop drilling
export const SongsProvider = (props) => {
  // use a state hook
  const [songs, setSongs] = useState([]);
  return (
    // Provider is a react component, allows consuming components to subscribe context changes
    // All consumers will rerender when the value, songs, setSongs, changes
    // Take provider key from SongContext with value of songs, setSongs hook
    <SongContext.Provider value={[songs, setSongs]}>
      {/* displays the children of the passed in props */}
      {props.children}
    </SongContext.Provider>
  )
};
