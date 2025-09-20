// src/services/geminiService.ts
import type { PlayerState } from '../types';

export type GameUpdate = {
  story: string | null;
  playerState: PlayerState;
  actions: string[];
  gameOver: boolean;
};

// ---- Replace this later with the real Gemini call.
// For now we keep economy logic deterministic on our side
// and let this function "pretty print" the result.
async function callGeminiNarrator(text: string): Promise<string> {
  // If you already wired an API key, you can swap this stub with a fetch call.
  // For now we return the text as-is so the app compiles and runs.
  return text;
}

// Utility
function addItem(state: PlayerState, item: string, qty = 1) {
  state.inventory[item] = (state.inventory[item] || 0) + qty;
}

function hasItems(state: PlayerState, req: Record<string, number>) {
  return Object.entries(req).every(([k, v]) => (state.inventory[k] || 0) >= v);
}

function consumeItems(state: PlayerState, req: Record<string, number>) {
  Object.entries(req).forEach(([k, v]) => {
    state.inventory[k] = Math.max(0, (state.inventory[k] || 0) - v);
  });
}

function nextTownActions(): string[] {
  return [
    'Go to Forest',
    'Go to Mine',
    'Go to Lake',
    'Go to Farm',
    'Visit Blacksmith',
    'Visit Market',
  ];
}

export async function getGameUpdate(
  action: string,
  playerState: PlayerState | null
): Promise<GameUpdate> {
  // ---- Initial boot (null state from App.tsx on "Start")
  if (!playerState) {
    const startState: PlayerState = {
      name: 'Hero',
      classType: 'Warrior', // can be changed later by a class-select screen
      hp: 100,
      mana: 50,
      attack: 10,
      defense: 5,
      crit: 5,           // you prefer crit over speed
      gold: 10,
      inventory: {},
      professionLevels: { Fisherman: 0, Miner: 0, Logger: 0, Farmer: 0 },
      currentLocation: 'Town',
    };

    const story =
      'You arrive at Town square—stalls clatter, anvils ring, and fresh crops perfume the air.';
    return {
      story: await callGeminiNarrator(story),
      playerState: startState,
      actions: nextTownActions(),
      gameOver: false,
    };
  }

  // ---- From here on we mutate a copy and return it
  const state: PlayerState = JSON.parse(JSON.stringify(playerState));
  let story: string | null = null;
  let actions: string[] = [];
  let gameOver = false;

  // Normalize input
  const a = action.trim().toLowerCase();

  // ---- Navigation (Town + nodes)
  if (a === 'return to town' || a === 'go to town') {
    state.currentLocation = 'Town';
    story = 'You head back to Town.';
    actions = nextTownActions();
  } else if (a === 'go to forest') {
    state.currentLocation = 'Forest';
    story = 'You enter the Forest. Tall pines sway; the smell of sap and sawdust hangs in the air.';
    actions = ['Chop Wood', 'Return to Town'];
  } else if (a === 'go to mine' || a === 'explore mine') {
    state.currentLocation = 'Mine';
    story = 'You descend into the Mine. Pickaxes echo. Lanterns paint flickering shadows.';
    actions = ['Mine Ore', 'Return to Town'];
  } else if (a === 'go to lake') {
    state.currentLocation = 'Lake';
    story = 'You reach the Lake. Water laps at the shore; fish break the surface in silver arcs.';
    actions = ['Fish', 'Return to Town'];
  } else if (a === 'go to farm') {
    state.currentLocation = 'Farm';
    story = 'You arrive at the Farm. Furrows run long; scarecrows keep lazy watch.';
    actions = ['Harvest Crops', 'Return to Town'];
  } else if (a === 'visit blacksmith') {
    state.currentLocation = 'Blacksmith';
    story = 'The Blacksmith eyes your materials with a practiced grin.';
    actions = ['Craft Sword', 'Craft Pickaxe', 'Return to Town'];
  } else if (a === 'visit market') {
    state.currentLocation = 'Market';
    story = 'You step into the Market. Prices shift with supply and demand.';
    actions = ['Sell Materials', 'Buy Meal', 'Return to Town'];
  }

  // ---- Life actions
  else if (a === 'chop wood') {
    addItem(state, 'Wood', 1);
    state.professionLevels.Logger += 1;
    story = 'You fell a small tree and gather Wood.';
    actions = ['Chop Wood', 'Return to Town'];
  } else if (a === 'mine ore') {
    addItem(state, 'Ore', 1);
    state.professionLevels.Miner += 1;
    story = 'You chip free a chunk of Ore.';
    actions = ['Mine Ore', 'Return to Town'];
  } else if (a === 'fish') {
    addItem(state, 'Fish', 1);
    state.professionLevels.Fisherman += 1;
    story = 'You reel in a wriggling Fish.';
    actions = ['Fish', 'Return to Town'];
  } else if (a === 'harvest crops') {
    addItem(state, 'Crops', 1);
    state.professionLevels.Farmer += 1;
    story = 'You gather a basket of fresh Crops.';
    actions = ['Harvest Crops', 'Return to Town'];
  }

  // ---- Crafting
  else if (a === 'craft sword') {
    const need = { Ore: 1, Wood: 1 };
    if (hasItems(state, need)) {
      consumeItems(state, need);
      addItem(state, 'Sword', 1);
      story = 'You smelt Ore and fit it with a Wood hilt—Sword crafted.';
    } else {
      story = 'Missing materials: need 1 Ore and 1 Wood.';
    }
    actions = ['Return to Town'];
  } else if (a === 'craft pickaxe') {
    const need = { Ore: 1, Wood: 2 };
    if (hasItems(state, need)) {
      consumeItems(state, need);
      addItem(state, 'Pickaxe', 1);
      story = 'You forge a sturdy Pickaxe.';
    } else {
      story = 'Missing materials: need 1 Ore and 2 Wood.';
    }
    actions = ['Return to Town'];
  }

  // ---- Market (very simple starter economy)
  else if (a === 'sell materials') {
    const sellables: Array<[string, number]> = [
      ['Ore', 4],
      ['Wood', 3],
      ['Fish', 3],
      ['Crops', 3],
      ['Sword', 15],
      ['Pickaxe', 10],
    ];
    let earned = 0;
    for (const [item, price] of sellables) {
      const qty = state.inventory[item] || 0;
      if (qty > 0) {
        earned += qty * price;
        state.inventory[item] = 0;
      }
    }
    state.gold += earned;
    story = earned > 0 ? `You sell your goods for ${earned} gold.` : 'You have nothing worth selling.';
    actions = ['Buy Meal', 'Return to Town'];
  } else if (a === 'buy meal') {
    const cost = 5;
    if (state.gold >= cost) {
      state.gold -= cost;
      state.hp = Math.min(100, state.hp + 20);
      story = 'You buy a hot meal. HP restored by 20.';
    } else {
      story = 'Not enough gold.';
    }
    actions = ['Return to Town'];
  }

  // ---- Combat example
  else if (a === 'fight goblin' || a === 'fight goblin again') {
    const base = state.attack;
    const critBonus = Math.random() < state.crit / 100 ? base : 0;
    const dmg = Math.max(1, base + critBonus - 2);
    state.gold += 5;
    story = `You strike the goblin for ${dmg} damage and loot 5 gold.`;
    actions = ['Fight Goblin Again', 'Return to Town'];
  }

  // ---- Fallback
  else {
    story = 'You hesitate, unsure what to do.';
    actions = ['Return to Town'];
  }

  const narrated = await callGeminiNarrator(story || '');
  return { story: narrated, playerState: state, actions, gameOver };
}
