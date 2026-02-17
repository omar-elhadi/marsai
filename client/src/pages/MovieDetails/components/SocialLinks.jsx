import React from 'react';

const SocialLinks = ({ socialMedia }) => {
  return (
    <div className="flex gap-4">
      {socialMedia.twitter && (
        <a 
          href={socialMedia.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Twitter
        </a>
      )}
      {socialMedia.instagram && (
        <a 
          href={socialMedia.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Instagram
        </a>
      )}
      {socialMedia.linkedin && (
        <a 
          href={socialMedia.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          LinkedIn
        </a>
      )}
    </div>
  );
};

export default SocialLinks;