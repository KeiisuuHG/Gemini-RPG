import React, { useState, useCallback } from 'react';
import { StartScreen } from './components/StartScreen';
import { StoryLog } from './components/StoryLog';
import { UserInput } from './components/UserInput';
import { GameOverScreen } from './components/GameOverScreen';
import { LoadingIndicator } from './components/LoadingIndicator';
import { PlayerStatus } from './components/PlayerStatus';
import { TownMap } from './components/TownMap';
import { getGameUpdate } from './services/geminiService';
import type { StoryEntry, PlayerState } from './types';
import { Actor } from './types';

const Header: React.FC = () => (
  <header className="w-full p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 fixed top-0 left-0 z-10">
    <h1 className="text-2xl font-bold text-center text-indigo-400 font-mono tracking-wider">
      Gemini RPG
    </h1>
  </header>
);

const App: React.FC = () => {
  const [storyHistory, setStoryHistory] = useState<StoryEntry[]>([]);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsGameOver(false);
    setStoryHistory([]);
    setPlayerState(null);
    setActions([]);

    try {
      const initialPrompt = "The player has started a new game. Place them in the 'Town' and describe the scene.";
      const update = await getGameUpdate(initialPrompt, null);
      
      // The first update is just the description, so we don't add it to history to avoid a double message.
      // We set the player state which will trigger the TownMap to render with its own description.
      setPlayerState(update.playerState);
      setActions(update.actions); // This may not be needed if TownMap generates actions, but good for consistency.
      setGameStarted(true);
    } catch (err) {
      setError('Failed to start the adventure. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmitAction = useCallback(async (action: string) => {
    if (!action.trim()) return;

    // For TownMap navigation, we don't show the player action in the log.
    if(playerState?.currentLocation !== 'Town') {
        const newPlayerEntry: StoryEntry = { actor: Actor.Player, text: action };
        setStoryHistory(prev => [...prev, newPlayerEntry]);
    }
    setIsLoading(true);
    setError(null);
    setActions([]);

    try {
      const update = await getGameUpdate(action, playerState);
      
      if (update.story) {
        const newGmEntry: StoryEntry = { actor: Actor.GM, text: update.story };
        setStoryHistory(prev => [...prev, newGmEntry]);
      }
      
      setPlayerState(update.playerState);
      
      if (update.gameOver) {
        setIsGameOver(true);
      } else {
        setActions(update.actions);
      }
      
    } catch (err) {
      setError('The story could not continue. An error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [playerState]);

  const handleRestart = () => {
    setGameStarted(false);
    setIsGameOver(false);
    setStoryHistory([]);
    setPlayerState(null);
    setActions([]);
  };

  const renderGameContent = () => {
    if (isLoading && !playerState) { // Show loading only on initial load
      return <div className="flex items-center justify-center h-full"><LoadingIndicator /></div>;
    }
    
    if (playerState?.currentLocation === 'Town') {
      return <TownMap onNavigate={handleSubmitAction} playerState={playerState} />;
    }

    return (
      <>
        <StoryLog history={storyHistory} />
        {isLoading && <LoadingIndicator />}
        <div className="mt-auto pt-4">
          {isGameOver ? (
            <GameOverScreen onRestart={handleRestart} />
          ) : (
            !isLoading && <UserInput onSubmit={handleSubmitAction} actions={actions} playerState={playerState} />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-mono flex flex-col items-center p-4 pt-24">
      <Header />
      <main className="w-full max-w-7xl h-full flex flex-col flex-grow">
        {!gameStarted ? (
          <StartScreen onStart={handleStartGame} isLoading={isLoading} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-full">
            <div className="md:col-span-1 h-full">
               {playerState && <PlayerStatus playerState={playerState} />}
            </div>
            <div className="md:col-span-2 h-full flex flex-col">
              {renderGameContent()}
            </div>
          </div>
        )}
        {error && <div className="mt-4 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-md text-center">{error}</div>}
      </main>
    </div>
  );
};

export default App;