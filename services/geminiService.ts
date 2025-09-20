import { PlayerState } from '../types';

// Fake Gemini call (replace with real API call later)
async function callGemini(prompt: string): Promise<string> {
  return `Narrator: ${prompt}`; // stub
}

export async function getGameUpdate(action: string, playerState: PlayerState | null) {
  let story = "";
  let newPlayerState: PlayerState;
  let actions: string[] = [];
  let gameOver = false;

  if (!playerState) {
    // Starting state
    newPlayerState = {
      name: "Hero",
      classType: "Warrior",
      hp: 100,
      mana: 50,
      attack: 10,
      defense: 5,
      crit: 5,
      gold: 10,
      inventory: {},
      professionLevels: { Miner: 0, Logger: 0, Fisherman: 0, Farmer: 0 },
      currentLocation: "Town",
    };
    story = "You arrive in the bustling Town square. Merchants haggle, adventurers sharpen blades, and farmers unload wagons.";
    actions = ["Visit Blacksmith", "Head to Forest", "Explore Mine"];
    return { story, playerState: newPlayerState, actions, gameOver };
  }

  newPlayerState = { ...playerState };

  // Economy logic
  switch (action.toLowerCase()) {
    case "mine ore":
      newPlayerState.inventory["Ore"] = (newPlayerState.inventory["Ore"] || 0) + 1;
      newPlayerState.professionLevels.Miner += 1;
      story = "You strike the rocks and collect a chunk of ore.";
      actions = ["Mine Ore", "Return to Town"];
      break;

    case "fish":
      newPlayerState.inventory["Fish"] = (newPlayerState.inventory["Fish"] || 0) + 1;
      newPlayerState.professionLevels.Fisherman += 1;
      story = "You cast your line and reel in a fish.";
      actions = ["Fish", "Return to Town"];
      break;

    case "craft sword":
      if ((newPlayerState.inventory["Ore"] || 0) >= 1 && (newPlayerState.inventory["Wood"] || 0) >= 1) {
        newPlayerState.inventory["Ore"] -= 1;
        newPlayerState.inventory["Wood"] -= 1;
        newPlayerState.inventory["Sword"] = (newPlayerState.inventory["Sword"] || 0) + 1;
        story = "You smelt the ore and shape the wood into a sturdy sword.";
      } else {
        story = "You lack the materials to craft a sword.";
      }
      actions = ["Return to Town"];
      break;

    case "fight goblin":
      const dmg = Math.max(0, newPlayerState.attack + Math.floor(Math.random() * newPlayerState.crit) - 2);
      story = `You slash at the goblin, dealing ${dmg} damage.`;
      newPlayerState.gold += 5;
      actions = ["Fight Goblin Again", "Return to Town"];
      break;

    case "return to town":
      newPlayerState.currentLocation = "Town";
      story = "You head back to the Town square.";
      actions = ["Visit Blacksmith", "Head to Forest", "Explore Mine"];
      break;

    default:
      story = "You hesitate, unsure what to do.";
      actions = ["Return to Town"];
  }

  // Gemini makes it pretty
  const narratedStory = await callGemini(story);

  return {
    story: narratedStory,
    playerState: newPlayerState,
    actions,
    gameOver,
  };
}
