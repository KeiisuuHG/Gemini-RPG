
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4 text-gray-400 italic">
      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
      <span>The storyteller is weaving your fate...</span>
    </div>
  );
};
