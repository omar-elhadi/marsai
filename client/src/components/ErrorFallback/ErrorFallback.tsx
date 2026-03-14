import React from 'react';

export const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Une erreur inattendue s'est produite</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Réessayer</button>
    </div>
  );
};
