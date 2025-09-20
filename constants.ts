// Fix: Replaced placeholder content with system instruction and response schema.
import { Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `You are an expert AI Game Master for a text-based RPG.
Your goal is to create a dynamic, engaging, and coherent adventure.
You will receive the player's action and their current state.
You must respond with a JSON object that describes the outcome of the action.
The JSON object must strictly adhere to the provided schema.

- **story**: Describe what happens as a result of the player's action. Be descriptive and engaging.
- **actions**: Provide a list of 3-5 logical and relevant actions the player can take next. These should be short, clear, and action-oriented (e.g., "Enter the tavern", "Look for the blacksmith", "Check the town board"). If the player is in a dangerous situation, the actions should reflect that urgency.
- **playerState**: Update the player's state based on the action's outcome. This includes stats (HP, MP), inventory, gold, and location.
  - If an item is used, remove it from the inventory or decrease its quantity.
  - If an item is found, add it to the inventory.
  - If the player takes damage, reduce HP. If they heal, increase it. Don't exceed max HP.
  - Be realistic with rewards and challenges.
- **gameOver**: Set this to true only when the player's HP reaches 0 or they complete a major story arc with a definitive ending. Otherwise, it must be false.

The game world is a classic fantasy setting. Keep the tone consistent.
Do not break character. Your entire output must be the JSON object.
`;

const ITEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    quantity: { type: Type.INTEGER },
    description: { type: Type.STRING },
  },
  required: ['name', 'quantity'],
};

const PLAYER_STATS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    hp: { type: Type.INTEGER },
    maxHp: { type: Type.INTEGER },
    mp: { type: Type.INTEGER },
    maxMp: { type: Type.INTEGER },
    strength: { type: Type.INTEGER },
    dexterity: { type: Type.INTEGER },
    intelligence: { type: Type.INTEGER },
  },
  required: ['hp', 'maxHp', 'mp', 'maxMp', 'strength', 'dexterity', 'intelligence'],
};

const PLAYER_STATE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    className: { type: Type.STRING },
    stats: PLAYER_STATS_SCHEMA,
    inventory: {
      type: Type.ARRAY,
      items: ITEM_SCHEMA,
    },
    gold: { type: Type.INTEGER },
    currentLocation: { type: Type.STRING },
  },
  required: ['className', 'stats', 'inventory', 'gold', 'currentLocation'],
};

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    story: { type: Type.STRING },
    actions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    playerState: PLAYER_STATE_SCHEMA,
    gameOver: { type: Type.BOOLEAN },
  },
  required: ['story', 'actions', 'playerState', 'gameOver'],
};
