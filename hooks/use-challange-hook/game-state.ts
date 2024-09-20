import { Player } from "../../models/player.interface";

const Scrambo = require("scrambo");
const scrambleGenerator = new Scrambo();

export interface GameState {
  game: {
    scrumble: string;
    gameStatus: "OFF" | "ON";
    players: Player[];
  };
}

export const initialState: GameState = {
  game: {
    scrumble: scrambleGenerator.get(),
    gameStatus: "OFF",
    players: [
      {
        name: "Player 1",
        wins: 0,
        time: 0,
        isReady: false,
        buttonIsRealeased: true,
      },
      {
        name: "Player 2",
        wins: 0,
        time: 0,
        isReady: false,
        buttonIsRealeased: true,
      },
    ],
  },
};
