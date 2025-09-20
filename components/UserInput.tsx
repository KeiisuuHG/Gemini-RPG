import React, { useState } from 'react';
import { StatusModal } from './StatusModal';
import type { PlayerState } from '../types';

interface UserInputProps {
  onSubmit: (action: string) => void;
  actions: string[];
  playerState: PlayerState | null;
}

export const UserInput: React.FC<UserInputProps> = ({ onSubmit, actions, playerState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full flex flex-col items-center space-y-3">
        <h3 className="text-lg font-semibold text-gray-400">Choose your action:</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => onSubmit(action)}
              className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
            >
              {action}
            </button>
          ))}
          {playerState && (
             <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-all duration-200 ease-in-out"
              aria-label="Check character status"
            >
              Check Status
            </button>
          )}
        </div>
      </div>
      {isModalOpen && playerState && (
        <StatusModal playerState={playerState} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};
