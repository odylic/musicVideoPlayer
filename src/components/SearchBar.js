import React, {useState, useContext} from 'react';
import {VideoContext} from '../Contexts/VideoContext';

export default function SearchBar() {
  const [value, setValue] = useState();
  const [searches, setSearches] = useState([]);
  const [video, setVideo] = useContext(VideoContext);
  const [view, setView] = useState()


  return (
    <div className="SearchBar">
      Search For Playlist On Youtube
      <div className="SearchForm">
        <form action="/youtube/search">
          <input
            name="searchInput"
            onChange={(e) => setValue(e.target.value)}
          ></input>
          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                setView('singleSearch')
                const response = await fetch(
                  `/youtube/search?searchInput=${value}`
                );
                const data = await response.json();
                setSearches(data);
                console.log(await data);
              } catch (err) {
                console.log(err.stack);
              } finally {
              }
            }}
          >
            Search
          </button>
          Search For Playlists on Youtube
        </form>
        <form action="/youtube/searchPlaylist">
          <input
            name="searchInput"
            onChange={(e) => setValue(e.target.value)}
          ></input>
          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                setView('playlistSearch')
                const response = await fetch(
                  `/youtube/searchPlaylist?searchInput=${value}`
                );
                const data = await response.json();
                setSearches(data);
                // console.log(await data);
              } catch (err) {
                console.log(err.stack);
              } finally {
              }
            }}
          >
            Search Playlist
          </button>
        </form>
      </div>

  
      
        {searches.map((search) => (
            <div>
              <button
                className="SearchResults"
                onClick={async (e) => {
                  e.preventDefault();
                  // try {
                  //   const addedToPlaylist = [...video, search.url];
                  //   setVideo(addedToPlaylist);
                  // } catch (err) {
                  //   console.log(err.stack);
                  // } finally {
                  //   console.log('done');
                  // }
                  const response = await fetch(
                    `/youtube/songs/${search.playlistId}`
                  );
                  // console.log(response);
                  const data = await response.json();
                  // console.log(data);
                  const urlArr = [];
                  data.map((item) => {
                    urlArr.push(item.url);
                  });
                  // console.log(urlArr);
                  // // useState hook to set the song with the data from the fetch hook
                  setVideo(urlArr);
                }}
              >
                {search.title}
                <br />
                <img src={search.thumbnail.default.url}></img>
              </button>
            </div>
          ))
        }

    </div>
  );
}
