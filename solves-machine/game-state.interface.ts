import { CubeType } from "@/enums/cube-time.enum";
import { PressState } from "@/enums/press-state.enum";

export interface Solve {
  time: number;
  scrumble: string;
  cubeType: CubeType;
}

interface Player {
  name: string;
  wins: number;
  pressState: PressState;
  solves: Solve[];
}

export interface SolvesState {
  scrumble: string;
  cubeType: CubeType;
  time: number;
  players: Player[];
}
