import React from 'react';
import type { PlayerState } from '../types';

interface PlayerStatusProps {
  playerState: PlayerState;
}

const StatBar: React.FC<{ value: number; maxValue: number; color: string; label: string }> = ({ value, maxValue, color, label }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-bold text-gray-300">{label}</span>
      <span className="text-sm font-mono">{value} / {maxValue}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${(value / maxValue) * 100}%` }}></div>
    </div>
  </div>
);

export const PlayerStatus: React.FC<PlayerStatusProps> = ({ playerState }) => {
  const { className, stats, inventory, gold, currentLocation } = playerState;

  return (
    <div className="w-full bg-gray-800/50 p-5 rounded-lg border border-gray-700 shadow-lg h-full flex flex-col">
      <div className="border-b border-gray-600 pb-3 mb-4">
        <h2 className="text-2xl font-bold text-indigo-400">
          {className || 'Adventurer'}
        </h2>
        <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">{currentLocation}</p>
        <p className="text-lg font-semibold text-yellow-400 mt-2">{gold ?? 0} Gold</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <StatBar value={stats.hp} maxValue={stats.maxHp} color="bg-red-500" label="Health" />
        <StatBar value={stats.mp} maxValue={stats.maxMp} color="bg-blue-500" label="Mana" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <p className="text-sm text-gray-400">STR</p>
          <p className="text-xl font-bold">{stats.strength}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">DEX</p>
          <p className="text-xl font-bold">{stats.dexterity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">INT</p>
          <p className="text-xl font-bold">{stats.intelligence}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2 mb-3">Inventory</h3>
      <div className="flex-grow overflow-y-auto pr-2">
        {inventory.length > 0 ? (
          <ul className="space-y-2">
            {inventory.map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-700/50 p-2 rounded-md group">
                <div>
                  <p className="font-semibold">{item.name} <span className="text-gray-400 font-mono text-sm">x{item.quantity}</span></p>
                  {item.description && <p className="text-xs text-gray-400 italic pt-1">{item.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-center py-4">Your backpack is empty.</p>
        )}
      </div>
    </div>
  );
};