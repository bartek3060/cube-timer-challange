import { CubeType } from "@/enums/cube-time.enum";
import { GameEvents } from "../../enums/game-events.enum";

export type GameAction =
  | { type: GameEvents.PlayerReadyChange; playerName: string; isReady: boolean }
  | { type: GameEvents.BeginGameEvent }
  | { type: GameEvents.UpdateTimeEvent; playerName: string; time: number }
  | { type: GameEvents.SolveCompleted; playerName: string; time: number }
  | {
      type: GameEvents.ButtonReleased;
      playerName: string;
      isRealeased: boolean;
    }
  | { type: GameEvents.GameCompleted }
  | { type: GameEvents.CubeChanged; cubeType: CubeType };
