
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  isLoading: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h2 className="text-4xl font-bold text-indigo-300 mb-4">Welcome, Adventurer</h2>
      <p className="text-lg text-gray-400 mb-8 max-w-2xl">
        You stand at the precipice of a new world, crafted by an AI storyteller. Your choices will forge a unique path through an unpredictable narrative. Are you ready to begin?
      </p>
      <button
        onClick={onStart}
        disabled={isLoading}
        className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Summoning the world...' : 'Start Your Adventure'}
      </button>
    </div>
  );
};
