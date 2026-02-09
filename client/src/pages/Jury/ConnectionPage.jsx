import React from 'react';

const ConnectionPageJury = () => {
  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
      <div className="text-black shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Connexion Jury</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Votre Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Votre Mot de passe"
            />
            <div className="text-right mt-2">
              <a href="#" className="text-sm text-indigo-600 hover:underline">Mot de passe oublié ?</a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-6">
          <button
            className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.15 0 5.9 1.2 8.05 3.15l6-6C34.9 3.15 29.8 1 24 1 14.7 1 6.9 6.6 3.15 14.4l7.2 5.6C12.6 13.2 17.8 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.85 24.6c0-1.8-.15-3.6-.45-5.4H24v10.2h12.95c-.6 3-2.4 5.55-5.1 7.2l7.8 6C43.8 37.8 46.85 31.8 46.85 24.6z"
              />
              <path
                fill="#4A90E2"
                d="M10.35 28.8c-1.2-3.6-1.2-7.8 0-11.4l-7.2-5.6C.15 16.2 0 20.1 0 24s.15 7.8 3.15 11.4l7.2-5.6z"
              />
              <path
                fill="#FBBC05"
                d="M24 47c5.8 0 10.8-1.95 14.4-5.25l-7.8-6c-2.1 1.35-4.8 2.1-7.8 2.1-6.15 0-11.4-3.75-13.5-9.15l-7.2 5.6C6.9 41.4 14.7 47 24 47z"
              />
            </svg>
            Connexion avec Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPageJury;