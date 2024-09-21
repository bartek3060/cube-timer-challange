import { useEffect, useReducer, useRef } from "react";
import { GameEvents } from "../../enums/game-events.enum";
import { reducer } from "./game-events-reducer";
import { initialState } from "./game-state";
import { CubeType } from "@/enums/cube-time.enum";

export function useChallenge() {
  const [
    {
      game: { gameStatus, players, scrumble, selectedCube },
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  let startGameOnNextRelease = useRef(false);
  let firstPlayerTimerRef = useRef<NodeJS.Timeout>();
  let secondPlayerTimerRef = useRef<NodeJS.Timeout>();
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
      !firstPlayerTimerRef.current &&
      !secondPlayerTimerRef.current &&
      startGameOnNextRelease.current
    ) {
      console.log("start game");
      startTime.current = Date.now();
      firstPlayerTimerRef.current = setInterval(() => {
        dispatch({
          type: GameEvents.UpdateTimeEvent,
          playerName: players[0].name,
          time: Date.now() - startTime.current!,
        });
      }, 75);

      secondPlayerTimerRef.current = setInterval(() => {
        dispatch({
          type: GameEvents.UpdateTimeEvent,
          playerName: players[1].name,
          time: Date.now() - startTime.current!,
        });
      }, 75);
      setTimeout(() => (startGameOnNextRelease.current = false), 0);
    }
  }, [gameStatus, players]);

  useEffect(() => {
    if (
      !firstPlayerTimerRef.current &&
      !secondPlayerTimerRef.current &&
      gameStatus === "ON"
    ) {
      dispatch({ type: GameEvents.GameCompleted });
    }
  }, [gameStatus, firstPlayerTimerRef, secondPlayerTimerRef]);

  const setPlayerIsReady = (playerName: string, isReady: boolean) => {
    dispatch({ type: GameEvents.PlayerReadyChange, playerName, isReady });
  };

  const finishSolve = (playerName: string) => {
    if (playerName === players[0].name) {
      clearInterval(firstPlayerTimerRef.current);
      firstPlayerTimerRef.current = undefined;
    } else {
      clearInterval(secondPlayerTimerRef.current);
      secondPlayerTimerRef.current = undefined;
    }

    dispatch({
      type: GameEvents.SolveCompleted,
      playerName,
      time: Date.now() - startTime.current!,
    });

    if (!firstPlayerTimerRef.current && !secondPlayerTimerRef.current) {
      dispatch({ type: GameEvents.GameCompleted });
    }
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

  return {
    setPlayerIsReady,
    setReleaseButton,
    finishSolve,
    getPlayerData,
    changeSelectedCube,
    selectedCube,
    shouldResetChallenge: players.every(({ time }) => !time),
    scrumble,
    anyPlayersIsReady: players.some(({ isReady }) => isReady),
    isGameInProgress: gameStatus === "ON",
  };
}
