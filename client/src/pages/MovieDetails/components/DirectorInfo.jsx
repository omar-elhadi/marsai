import React from 'react';
import SocialLinks from '../SocialLinks/SocialLinks';

const DirectorInfo = ({ director, aiTools, socialMedia }) => {
  return (
    <div className="flex-1 p-6 bg-gray-800 rounded-lg overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Réalisateur</h2>
      <p className="text-xl font-semibold text-purple-400 mb-6">{director}</p>
      
      <h3 className="text-lg font-semibold text-white mb-3">IA Utilisées</h3>
      <ul className="space-y-2 mb-6">
        {aiTools.map((tool, index) => (
          <li key={index} className="text-gray-300 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            {tool}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-white mb-3">Réseaux Sociaux</h3>
      <SocialLinks socialMedia={socialMedia} />
    </div>
  );
};

export default DirectorInfo;