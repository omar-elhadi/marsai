import React from 'react';

const Synopsis = ({ synopsis }) => {
  return (
    <div className="flex-1 p-6 bg-gray-800 rounded-lg overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
      <p className="text-gray-300 leading-relaxed">{synopsis}</p>
    </div>
  );
};

export default Synopsis;