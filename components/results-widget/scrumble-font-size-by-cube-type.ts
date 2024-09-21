import { CubeType } from "@/enums/cube-time.enum";

export const scrumbleFontSizeByCubeType = (cubeType: CubeType): number => {
  switch (cubeType) {
    case CubeType.twoXTwo:
      return 24;
    case CubeType.threeXThree:
      return 24;
    case CubeType.fourXFour:
      return 24;
    case CubeType.fiveXFive:
      return 18;
    case CubeType.pyraminx:
      return 24;
    case CubeType.skewb:
      return 24;
    case CubeType.square1:
      return 20;
  }
};
