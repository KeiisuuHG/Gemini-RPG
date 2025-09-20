
import React from 'react';

interface GameOverScreenProps {
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  return (
    <div className="w-full text-center p-6 bg-gray-800/70 border border-indigo-500/50 rounded-lg shadow-lg animate-pulse">
      <h3 className="text-2xl font-bold text-indigo-400 mb-4">The story has concluded.</h3>
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
      >
        Start a New Adventure
      </button>
    </div>
  );
};
