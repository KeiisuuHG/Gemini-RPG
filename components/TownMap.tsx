// Fix: Replaced placeholder content with a functional TownMap component.
import React from 'react';
import type { PlayerState } from '../types';

interface TownMapProps {
  onNavigate: (action: string) => void;
  playerState: PlayerState;
}

const locations = [
  { name: 'Tavern', description: "A place for rest and rumors.", action: "Go to the Tavern" },
  { name: 'Blacksmith', description: "Weapons and armor are forged here.", action: "Go to the Blacksmith" },
  { name: 'General Store', description: "All sorts of goods for an adventurer.", action: "Go to the General Store" },
  { name: 'Town Gates', description: "The path to adventure lies beyond.", action: "Leave the town" },
];

export const TownMap: React.FC<TownMapProps> = ({ onNavigate, playerState }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <h2 className="text-3xl font-bold text-indigo-300 mb-2">Welcome to {playerState.currentLocation}</h2>
      <p className="text-gray-400 mb-8">You are in the town square. The air is bustling with activity. Where would you like to go?</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {locations.map((location) => (
          <button
            key={location.name}
            onClick={() => onNavigate(location.action)}
            className="p-6 bg-gray-800/60 border border-gray-700 rounded-lg hover:bg-indigo-900/50 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out text-left transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-indigo-400">{location.name}</h3>
            <p className="text-gray-400 mt-1">{location.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
