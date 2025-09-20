import React, { useRef, useEffect } from 'react';
import type { StoryEntry } from '../types';
import { Actor } from '../types';

interface StoryLogProps {
  history: StoryEntry[];
}

export const StoryLog: React.FC<StoryLogProps> = ({ history }) => {
  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="flex-grow w-full bg-gray-800/50 p-6 rounded-lg overflow-y-auto border border-gray-700 shadow-inner min-h-[300px] md:min-h-0">
      <div className="space-y-6">
        {history.map((entry, index) => (
          <div key={index} className={entry.actor === Actor.Player ? 'pl-4 border-l-2 border-cyan-500/50' : ''}>
            {entry.actor === Actor.GM ? (
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{entry.text}</p>
            ) : (
              <p className="text-cyan-300 italic whitespace-pre-wrap leading-relaxed">
                > {entry.text}
              </p>
            )}
          </div>
        ))}
      </div>
      <div ref={endOfLogRef} />
    </div>
  );
};