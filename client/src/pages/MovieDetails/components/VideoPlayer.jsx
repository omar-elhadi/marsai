import React from 'react';

const VideoPlayer = ({ youtubeId }) => {
  return (
    <div className="flex-1 bg-black rounded-lg overflow-hidden">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;