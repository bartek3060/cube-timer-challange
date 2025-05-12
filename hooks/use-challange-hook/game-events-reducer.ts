import { generateScramble } from "@/utils/generate-scramble";
import { GameEventsNames } from "../../solves-machine/game-event-names.enum";
import { Player } from "../../models/player.interface";
import { GameAction } from "./game-events.type";
import { initialState } from "./game-state";
import {GameState} from "@/solves-machine/solves-machine";

export const reducer = (state: GameState, action: GameAction): GameState['game'] => {
  const playersState = state.game.players;
  switch (action.type) {
    case GameEventsNames.PlayerReadyChange:
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
    case GameEventsNames.ButtonReleased:
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
    case GameEventsNames.BeginGameEvent:
      return {
        ...state,
        game: {
          ...state.game,
          gameStatus: "ON",
          players: state.game.players.map((player) => ({
            ...player,
            time: 0,
          })),
        },
      };
    case GameEventsNames.UpdateTimeEvent:
      return {
        ...state,
        game: {
          ...state.game,
          players: playersState.map((player) => {
            const playerToUpdate = action.players?.find(
              (p) => p.playerName === player.name
            );
            return player.name === playerToUpdate?.playerName &&
              !player.isSolved
              ? { ...player, time: playerToUpdate.time }
              : player;
          }),
        },
      };
    case GameEventsNames.SolveCompleted:
      return {
        ...state,
        game: {
          ...state.game,
          players: playersState.map((player) =>
            player.name === action.playerName
              ? { ...player, isSolved: true }
              : player
          ),
        },
      };
    case GameEventsNames.GameCompleted:
      return {
        ...state,
        game: {
          ...state.game,
          gameStatus: "OFF",
          scrumble: generateScramble(state.game.selectedCube),
          players: state.game.players.reduce((acc: Player[], player) => {
            acc.push({ ...{ ...player, isSolved: false }, isReady: false });
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
    case GameEventsNames.CubeChanged:
      return {
        ...state,
        game: {
          ...state.game,
          selectedCube: action.cubeType,
          scrumble: generateScramble(action.cubeType),
        },
      };
    case GameEventsNames.SessionReset:
      return {
        ...initialState,
        game: {
          ...initialState.game,
          scrumble: generateScramble(state.game.selectedCube),
          selectedCube: state.game.selectedCube,
        },
      };
    default:
      return state;
  }
};
