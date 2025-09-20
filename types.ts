// Fix: Replaced placeholder content with actual type definitions.
export enum Actor {
  Player = 'PLAYER',
  GM = 'GM', // Game Master
}

export interface StoryEntry {
  actor: Actor;
  text: string;
}

export interface Item {
  name: string;
  quantity: number;
  description?: string;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  strength: number;
  dexterity: number;
  intelligence: number;
}

export interface PlayerState {
  className: string;
  stats: PlayerStats;
  inventory: Item[];
  gold: number;
  currentLocation: string; // e.g., 'Town', 'Forest', 'Cave'
}

export interface GameUpdate {
  story: string;
  actions: string[];
  playerState: PlayerState;
  gameOver: boolean;
}
