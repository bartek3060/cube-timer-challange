import { PressState } from "@/enums/press-state.enum";

export const textButtonColorByState = (buttonPressState: PressState) => {
  switch (buttonPressState) {
    case PressState.NOT_PRESSED:
      return "white";
    case PressState.PRESSED:
      return "yellow";
    case PressState.LONG_PRESSED:
      return "green";
  }
};
