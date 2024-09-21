import { CubeType } from "@/enums/cube-time.enum";

const Scrambow = require("scrambow").Scrambow;

export const generateScramble = (cubeType: CubeType): string => {
  return new Scrambow().setType(cubeType).get()[0]["scramble_string"];
};
