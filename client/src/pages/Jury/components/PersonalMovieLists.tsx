// @ts-nocheck
import React, { useState } from 'react';

const PersonalMovieLists = () => {
  const [lists, setLists] = useState({
    like: [],
    discuss: [],
    dislike: [],
  });

  const addToList = (listName, movie) => {
    setLists((prevLists) => ({
      ...prevLists,
      [listName]: [...prevLists[listName], movie],
    }));
  };

  return (
    <div>
      <h2>Personal Movie Lists</h2>
      <div>
        <h3>"Like" List</h3>
        <ul>
          {lists.like.map((movie, index) => (
            <li key={index}>{movie}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>"To Discuss" List</h3>
        <ul>
          {lists.discuss.map((movie, index) => (
            <li key={index}>{movie}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>"Dislike" List</h3>
        <ul>
          {lists.dislike.map((movie, index) => (
            <li key={index}>{movie}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          placeholder="Movie name"
          id="movieInput"
        />
        <button onClick={() => addToList('like', document.getElementById('movieInput').value)}>
          Add to Like
        </button>
        <button onClick={() => addToList('discuss', document.getElementById('movieInput').value)}>
          Add to Discuss
        </button>
        <button onClick={() => addToList('dislike', document.getElementById('movieInput').value)}>
          Add to Dislike
        </button>
      </div>
    </div>
  );
};

export default PersonalMovieLists;