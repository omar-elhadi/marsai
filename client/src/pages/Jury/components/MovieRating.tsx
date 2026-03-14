import React, { useState } from 'react';

const MovieRating = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (value) => {
    setRating(value);
    onRate(value);
  };

  return (
    <div>
      <h3>Rate this movie</h3>
      <div style={{ display: 'flex', gap: '5px' }}>
        {[...Array(10)].map((_, index) => (
          <button
            key={index}
            style={{
              backgroundColor: rating > index ? '#FFD700' : '#ccc',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
            onClick={() => handleRating(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MovieRating;