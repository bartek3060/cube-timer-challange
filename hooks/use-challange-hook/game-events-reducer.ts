import { generateScramble } from "@/utils/generate-scramble";
import { GameEvents } from "../../enums/game-events.enum";
import { Player } from "../../models/player.interface";
import { GameAction } from "./game-events.type";
import { GameState } from "./game-state";

export const reducer = (state: GameState, action: GameAction): GameState => {
  const playersState = state.game.players;
  switch (action.type) {
    case GameEvents.PlayerReadyChange:
      return {
        ...state,
        game: {
          ...state.game,
          players: playersState.map((player) =>
            player.name === action.playerName
              ? { ...player, isReady: action.isReady }
              : player
          ),
        },
      };
    case GameEvents.ButtonReleased:
      return {
        ...state,
        game: {
          ...state.game,
          players: playersState.map((player) =>
            player.name === action.playerName
              ? { ...player, buttonIsRealeased: action.isRealeased }
              : player
          ),
        },
      };
    case GameEvents.BeginGameEvent:
      return {
        ...state,
        game: {
          ...state.game,
          gameStatus: "ON",
          players: state.game.players.map((player) => ({ ...player, time: 0 })),
        },
      };
    case GameEvents.UpdateTimeEvent:
      return {
        ...state,
        game: {
          ...state.game,
          players: playersState.map((player) =>
            player.name === action.playerName
              ? { ...player, time: action.time }
              : player
          ),
        },
      };
    case GameEvents.SolveCompleted:
      return {
        ...state,
        game: {
          ...state.game,
          players: playersState.map((player) =>
            player.name === action.playerName
              ? { ...player, time: action.time }
              : player
          ),
        },
      };
    case GameEvents.GameCompleted:
      return {
        ...state,
        game: {
          ...state.game,
          gameStatus: "OFF",
          scrumble: generateScramble(state.game.selectedCube),
          players: playersState.reduce((acc: Player[], player) => {
            acc.push({ ...player, isReady: false });
            if (acc.length === 2) {
              const firstUser = acc[0];
              const secondUser = acc[1];

              if (firstUser.time > secondUser.time) {
                secondUser.wins++;
              } else {
                firstUser.wins++;
              }
            }
            return acc;
          }, []),
        },
      };
    case GameEvents.CubeChanged:
      return {
        ...state,
        game: {
          ...state.game,
          selectedCube: action.cubeType,
          scrumble: generateScramble(action.cubeType),
        },
      };
    default:
      return state;
  }
};
