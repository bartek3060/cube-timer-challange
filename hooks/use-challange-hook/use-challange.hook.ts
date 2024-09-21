import { useEffect, useReducer, useRef } from "react";
import { GameEvents } from "../../enums/game-events.enum";
import { reducer } from "./game-events-reducer";
import { initialState } from "./game-state";
import { CubeType } from "@/enums/cube-time.enum";
import { Player } from "@/models/player.interface";

export function useChallenge() {
  const [
    {
      game: { gameStatus, players, scrumble, selectedCube },
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  let startGameOnNextRelease = useRef(false);
  let timerRef = useRef<NodeJS.Timeout>();
  let solveCompleted1 = useRef(false);
  let solveCompleted2 = useRef(false);
  let startTime = useRef<number>();

  useEffect(() => {
    if (players.every(({ isReady }) => isReady) && gameStatus === "OFF") {
      setTimeout(() => (startGameOnNextRelease.current = true), 0);
    }
  }, [players, gameStatus]);

  useEffect(() => {
    if (
      startGameOnNextRelease.current &&
      gameStatus === "OFF" &&
      players.some(({ buttonIsRealeased }) => buttonIsRealeased)
    ) {
      dispatch({ type: GameEvents.BeginGameEvent });
    }
  }, [startGameOnNextRelease, players, gameStatus, dispatch]);

  useEffect(() => {
    if (
      gameStatus === "ON" &&
      !timerRef.current &&
      startGameOnNextRelease.current
    ) {
      startTime.current = Date.now();
      solveCompleted1.current = false;
      solveCompleted2.current = false;
      timerRef.current = setInterval(() => {
        const playersToUpdate: { playerName: string; time: number }[] = [];
        const timeToUpdate = Date.now() - startTime.current!;
        if (!solveCompleted1.current) {
          playersToUpdate.push({
            playerName: players[0].name,
            time: timeToUpdate,
          });
        }
        if (!solveCompleted2.current) {
          playersToUpdate.push({
            playerName: players[1].name,
            time: timeToUpdate,
          });
        }
        dispatch({
          type: GameEvents.UpdateTimeEvent,
          players: playersToUpdate,
        });
      }, 10);
      setTimeout(() => (startGameOnNextRelease.current = false), 0);
    }
    () => {
      clearInterval(timerRef.current);
    };
  }, [gameStatus, players]);

  useEffect(() => {
    if (players.every(({ isSolved }) => isSolved) && gameStatus === "ON") {
      dispatch({ type: GameEvents.GameCompleted });
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, [gameStatus, players]);

  const setPlayerIsReady = (playerName: string, isReady: boolean) => {
    dispatch({ type: GameEvents.PlayerReadyChange, playerName, isReady });
  };

  const finishSolve = (playerName: string) => {
    if (playerName === players[0].name) {
      solveCompleted1.current = true;
    } else {
      solveCompleted2.current = true;
    }

    dispatch({
      type: GameEvents.SolveCompleted,
      playerName,
    });
  };

  const getPlayerData = (playerName: string) => {
    return players.find((player) => player.name === playerName);
  };

  const setReleaseButton = (playerName: string, isRealeased: boolean) => {
    dispatch({ type: GameEvents.ButtonReleased, playerName, isRealeased });
  };

  const changeSelectedCube = (cube: CubeType) => {
    dispatch({ type: GameEvents.CubeChanged, cubeType: cube });
  };

  const restartSession = () => {
    dispatch({ type: GameEvents.SessionResest });
  };

  return {
    setPlayerIsReady,
    setReleaseButton,
    finishSolve,
    getPlayerData,
    changeSelectedCube,
    restartSession,
    selectedCube,
    shouldResetChallenge: players.every(({ time }) => !time),
    scrumble,
    anyPlayersIsReady: players.some(({ isReady }) => isReady),
    isGameInProgress: gameStatus === "ON",
  };
}
