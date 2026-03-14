import React from 'react';

const YouTubePlayer = ({ videoId }) => {
  if (!videoId) {
    return <p>No video selected</p>;
  }

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        title="YouTube Video Player"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;