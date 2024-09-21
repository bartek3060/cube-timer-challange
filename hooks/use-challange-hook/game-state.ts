import { CubeType } from "@/enums/cube-time.enum";
import { Player } from "../../models/player.interface";
import { generateScramble } from "@/utils/generate-scramble";

export interface GameState {
  game: {
    scrumble: string;
    selectedCube: CubeType;
    gameStatus: "OFF" | "ON";
    players: Player[];
  };
}
export const initialState: GameState = {
  game: {
    scrumble: generateScramble(CubeType.threeXThree),
    selectedCube: CubeType.threeXThree,
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
