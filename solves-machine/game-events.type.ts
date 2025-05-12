import { GameEventsNames } from "@/solves-machine/game-event-names.enum";
import { CubeType } from "@/enums/cube-time.enum";
import { Solve } from "@/solves-machine/game-state.interface";

export type GameEventsType =
  | { type: GameEventsNames.PlayerQuickPressNotInProgress; playerName: string }
  | { type: GameEventsNames.PlayerQuickPressInProgress; playerName: string; solve: Solve }
  | { type: GameEventsNames.PlayerLongPress; playerName: string }
  | { type: GameEventsNames.PlayerReleaseQuickPress; playerName: string }
  | { type: GameEventsNames.PlayerReleaseLongPress; playerName: string }
  | { type: GameEventsNames.CubeTypeChanged; cubeType: CubeType }
  | { type: GameEventsNames.Tick }
  | { type: GameEventsNames.SessionReset };
