import React, {useState, useContext} from 'react';
import {VideoContext} from '../Contexts/VideoContext';

export default function SearchBar() {
  const [value, setValue] = useState();
  const [searches, setSearches] = useState([]);
  const [video, setVideo] = useContext(VideoContext);

  return (
    <div className="SearchBar">
      Search on Youtube
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
        </form>
      </div>

      {searches.map((search) => (
        <div>
          <button
            className="SearchResults"
            onClick={async (e) => {
              e.preventDefault();
              try {
                const addedToPlaylist = [...video, search.url];
                setVideo(addedToPlaylist);
              } catch (err) {
                console.log(err.stack);
              } finally {
                console.log('done');
              }
            }}
          >
            {search.title}
            <br />
            <img src={search.thumbnail.default.url}></img>
          </button>
        </div>
      ))}
    </div>
  );
}
