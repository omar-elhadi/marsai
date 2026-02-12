import React, { useState } from 'react';
import NotificationSystem from './components/Notification';
import PersonalMovieLists from './components/PersonalMovieLists';
import MovieRating from './components/MovieRating';
import YouTubePlayer from './components/YouTubePlayer';

const VotesJury = () => {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [notifications, setNotifications] = useState([]);

  const handleRating = (movieId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [movieId]: rating,
    }));
    addNotification(`Rated movie ${movieId} with ${rating}`);
  };

  const handleAddComment = (movieId) => {
    if (newComment.trim()) {
      setComments((prevComments) => ({
        ...prevComments,
        [movieId]: [...(prevComments[movieId] || []), newComment],
      }));
      setNewComment('');
      addNotification(`Added comment to movie ${movieId}`);
    }
  };

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const movies = [
    { id: 1, title: 'Film 1', videoId: 'dQw4w9WgXcQ' },
    { id: 2, title: 'Film 2', videoId: '3JZ_D3ELwOQ' },
    { id: 3, title: 'Film 3', videoId: 'tgbNymZ7vqY' },
  ];

  return (
    <div className="p-6 bg-black-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Votes Jury</h1>
      <NotificationSystem notifications={notifications} />
      <div className="space-y-8">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">{movie.title}</h3>
            <YouTubePlayer videoId={movie.videoId} />
            <div className="mt-4">
              <MovieRating onRate={(rating) => handleRating(movie.id, rating)} />
              <p className="mt-2 text-gray-600">Rating: {ratings[movie.id] || 'Not rated'}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">Comments</h4>
              <ul className="list-disc list-inside space-y-1">
                {(comments[movie.id] || []).map((comment, index) => (
                  <li key={index} className="text-gray-700">{comment}</li>
                ))}
              </ul>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
                <button
                  onClick={() => handleAddComment(movie.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <PersonalMovieLists />
      </div>
    </div>
  );
};

export default VotesJury;