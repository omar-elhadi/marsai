const fs = require('fs');

let content = fs.readFileSync('client/src/components/VideoModal.tsx', 'utf8');

content = content.replace(
  /<div\s+className="fixed inset-0 z-9999 flex items-center justify-center p-4"\s+style={{ background: 'rgba\(0,0,0,0\.9\)', backdropFilter: 'blur\(4px\)' }}\s+onClick={onClose}\s+>/,
  '<div className="fixed inset-0 z-9999 flex items-center justify-center p-4" style={{ background: \'rgba(0,0,0,0.9)\', backdropFilter: \'blur(4px)\' }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="video-modal-title">'
);

content = content.replace(
  /<p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var\(--color-text\)', textTransform: 'uppercase', letterSpacing: '0.1em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/,
  '<p id="video-modal-title" style={{ fontSize: \'0.75rem\', fontWeight: 700, color: \'var(--color-text)\', textTransform: \'uppercase\', letterSpacing: \'0.1em\', overflow: \'hidden\', textOverflow: \'ellipsis\', whiteSpace: \'nowrap\' }}>'
);

content = content.replace(
  /<button\s+onClick={onClose}/,
  '<button aria-label="Fermer la modale" onClick={onClose}'
);

fs.writeFileSync('client/src/components/VideoModal.tsx', content);
