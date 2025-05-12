import { assertEvent, assign, createMachine } from "xstate";
import { GameEventsNames } from "@/solves-machine/game-event-names.enum";
import { SolvesMachineStates } from "@/solves-machine/solves-machine-states.enum";
import { SolvesState } from "@/solves-machine/game-state.interface";
import { PressState } from "@/enums/press-state.enum";
import { GameEventsType } from "@/solves-machine/game-events.type";
import { generateScramble } from "@/utils/generate-scramble";
import { CubeType } from "@/enums/cube-time.enum";

export const initialState: SolvesState = {
  time: 0,
  scrumble: generateScramble(CubeType.threeXThree),
  cubeType: CubeType.threeXThree,
  players: [
    {
      name: "Player 1",
      wins: 0,
      pressState: PressState.NOT_PRESSED,
      solves: [],
    },
    {
      name: "Player 2",
      wins: 0,
      pressState: PressState.NOT_PRESSED,
      solves: [],
    },
  ],
};

export const SolvesMachine = createMachine({
  id: "solvesMachine",
  types: {
    context: {} as SolvesState,
    events: {} as GameEventsType,
  },
  context: initialState,
  initial: SolvesMachineStates.Inactive,
  states: {
    [SolvesMachineStates.Inactive]: {
      on: {
        [GameEventsNames.PlayerQuickPressNotInProgress]: [SolvesMachineStates.OnePlayerIsPreparing],
      },
      entry: assign(({ context }) => {
        return {
          players: context.players.map((player) => ({ ...player, pressState: PressState.NOT_PRESSED })),
        };
      }),
    },
    [SolvesMachineStates.OnePlayerIsPreparing]: {
      entry: assign(({ context, event }) => {
        assertEvent(event, [
          GameEventsNames.PlayerQuickPressNotInProgress,
          GameEventsNames.PlayerReleaseLongPress,
          GameEventsNames.PlayerReleaseQuickPress,
        ]);
        return {
          players: context.players.map((player) =>
            player.name === event.playerName ? { ...player, pressState: PressState.PRESSED } : player,
          ),
        };
      }),
      on: {
        [GameEventsNames.PlayerReleaseQuickPress]: [SolvesMachineStates.Inactive],
        [GameEventsNames.PlayerQuickPressNotInProgress]: [SolvesMachineStates.TwoPlayersArePreparing],
        [GameEventsNames.PlayerLongPress]: [SolvesMachineStates.OnePlayerIsPrepared],
      },
    },
    [SolvesMachineStates.TwoPlayersArePreparing]: {
      entry: assign(({ context }) => ({
        players: context.players.map((player) => ({
          ...player,
          pressState: PressState.PRESSED,
        })),
      })),
      on: {
        [GameEventsNames.PlayerReleaseQuickPress]: [SolvesMachineStates.OnePlayerIsPreparing],
        [GameEventsNames.PlayerLongPress]: [SolvesMachineStates.OnePlayerIsPreparingAndSecondIsPrepared],
      },
    },
    [SolvesMachineStates.OnePlayerIsPrepared]: {
      on: {
        [GameEventsNames.PlayerReleaseLongPress]: [SolvesMachineStates.Inactive],
        [GameEventsNames.PlayerQuickPressNotInProgress]: [SolvesMachineStates.OnePlayerIsPreparingAndSecondIsPrepared],
      },

      entry: assign(({ context, event }) => {
        assertEvent(event, [GameEventsNames.PlayerLongPress, GameEventsNames.PlayerReleaseQuickPress]);

        return {
          players: context.players.map((player) =>
            player.name === event.playerName ? { ...player, pressState: PressState.LONG_PRESSED } : player,
          ),
        };
      }),
    },
    [SolvesMachineStates.OnePlayerIsPreparingAndSecondIsPrepared]: {
      on: {
        [GameEventsNames.PlayerLongPress]: [SolvesMachineStates.TwoPlayersArePrepared],
        [GameEventsNames.PlayerReleaseLongPress]: [SolvesMachineStates.OnePlayerIsPreparing],
        [GameEventsNames.PlayerReleaseQuickPress]: [SolvesMachineStates.OnePlayerIsPrepared],
      },

      entry: assign(({ context, event }) => {
        assertEvent(event, [GameEventsNames.PlayerLongPress, GameEventsNames.PlayerQuickPressNotInProgress]);
        switch (event.type) {
          case GameEventsNames.PlayerLongPress:
            return {
              players: context.players.map((player) =>
                player.name === event.playerName ? { ...player, pressState: PressState.LONG_PRESSED } : player,
              ),
            };
          case GameEventsNames.PlayerQuickPressNotInProgress:
            return {
              players: context.players.map((player) =>
                player.name === event.playerName ? { ...player, pressState: PressState.PRESSED } : player,
              ),
            };
        }
      }),
    },
    [SolvesMachineStates.TwoPlayersArePrepared]: {
      on: {
        [GameEventsNames.PlayerReleaseLongPress]: [SolvesMachineStates.GameInProgress],
      },
      entry: assign(({ context }) => ({
        players: context.players.map((player) => ({
          ...player,
          pressState: PressState.LONG_PRESSED,
        })),
      })),
    },
    [SolvesMachineStates.GameInProgress]: {
      on: {
        [GameEventsNames.PlayerQuickPressInProgress]: SolvesMachineStates.OnePlayerFinished,
        [GameEventsNames.Tick]: { actions: assign({ time: ({ context }) => context.time + 10 }) },
      },
      // @ts-ignore
      invoke: {
        src: () => (cb: Function) => {
          const interval = setInterval(() => {
            cb(GameEventsNames.Tick);
          }, 10);
          return () => {
            clearInterval(interval);
          };
        },
      },
      entry: ({ context, event }) => {
        assign(() => {
          assertEvent(event, GameEventsNames.PlayerQuickPressInProgress);
          return {
            time: 0,
            players: context.players.map((player) => ({
              ...player,
              pressState: PressState.NOT_PRESSED,
            })),
          };
        });
      },
    },
    [SolvesMachineStates.OnePlayerFinished]: {
      on: {
        [GameEventsNames.PlayerQuickPressInProgress]: SolvesMachineStates.GameFinished,
      },
      entry: ({ context, event }) => {
        assertEvent(event, GameEventsNames.PlayerQuickPressInProgress);
        assign({
          players: () =>
            context.players.map((player) =>
              player.name === event.playerName
                ? {
                    ...player,
                    wins: player.wins + 1,
                    solves: [...player.solves, event.solve],
                  }
                : player,
            ),
        });
      },
    },
    [SolvesMachineStates.GameFinished]: {
      target: SolvesMachineStates.Inactive,
      entry: ({ context, event }) => {
        assertEvent(event, GameEventsNames.PlayerQuickPressInProgress);
        assign({
          players: () =>
            context.players.map((player) =>
              player.name === event.playerName ? { ...player, solves: [...player.solves, event.solve] } : player,
            ),
        });
      },
    },
  },
});
