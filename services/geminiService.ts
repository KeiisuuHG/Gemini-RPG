import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from '../constants';
import type { GameUpdate, PlayerState } from '../types';

// Per coding guidelines, API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function buildPrompt(action: string, playerState: PlayerState | null): string {
  let prompt = `Player action: "${action}"\n`;
  if (playerState) {
    prompt += `Current player state: ${JSON.stringify(playerState)}\n`;
  }
  prompt += "Generate the next game state based on this action.";
  return prompt;
}

export async function getGameUpdate(
  action: string,
  playerState: PlayerState | null
): Promise<GameUpdate> {
  try {
    const prompt = buildPrompt(action, playerState);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Empty response from API. The model may have returned an empty string.");
    }

    // The model may wrap the JSON in markdown, so we strip it.
    const cleanedJsonText = jsonText.replace(/^```json\s*/, '').replace(/```$/, '');

    const gameUpdate: GameUpdate = JSON.parse(cleanedJsonText);
    return gameUpdate;

  } catch (error) {
    console.error("Error getting game update from Gemini:", error);
    if (error instanceof SyntaxError) {
        console.error("Failed to parse JSON response from Gemini.");
    }
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}
