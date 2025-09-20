import React from 'react';
import type { PlayerState } from '../types';

interface StatusModalProps {
  playerState: PlayerState;
  onClose: () => void;
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

export const StatusModal: React.FC<StatusModalProps> = ({ playerState, onClose }) => {
  const { className, stats, inventory, gold } = playerState;

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-indigo-500/30"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 id="status-modal-title" className="text-2xl font-bold text-indigo-400">
            {className || 'Adventurer'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close status modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <p className="text-lg font-semibold text-yellow-400 mb-6">{gold ?? 0} Gold</p>
          
          <div className="space-y-4 mb-6">
            <StatBar value={stats.hp} maxValue={stats.maxHp} color="bg-red-500" label="Health" />
            <StatBar value={stats.mp} maxValue={stats.maxMp} color="bg-blue-500" label="Mana" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 text-center bg-gray-900/50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">STR</p>
              <p className="text-2xl font-bold">{stats.strength}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">DEX</p>
              <p className="text-2xl font-bold">{stats.dexterity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">INT</p>
              <p className="text-2xl font-bold">{stats.intelligence}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2 mb-3">Inventory</h3>
          <div>
            {inventory.length > 0 ? (
              <ul className="space-y-2">
                {inventory.map((item, index) => (
                  <li key={index} className="flex justify-between items-start bg-gray-700/50 p-3 rounded-md">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.description && <p className="text-xs text-gray-400 italic pt-1">{item.description}</p>}
                    </div>
                    <span className="text-gray-400 font-mono text-sm ml-4">x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-center py-4">Your backpack is empty.</p>
            )}
          </div>
        </div>
         {/* Modal Footer */}
         <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
