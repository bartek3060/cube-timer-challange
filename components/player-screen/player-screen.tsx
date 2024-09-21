import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ResultsWidget } from "../results-widget/results-widget";
import { formatTimestamp } from "../../utils/get-mapped-date";
import { CubeType } from "@/enums/cube-time.enum";
import { PressState } from "@/enums/press-state.enum";
import { textButtonColorByState } from "./time-button-color-by-state";

interface Props {
  solveMappedTime: number;
  playerName: string;
  playerWins: number;
  scrumble: string;
  selectedCube: CubeType;
  rotated?: boolean;
  screenPressed: () => void;
  screenLongPressed: () => void;
  screenReleased: () => void;
}

export const PlayerScreen: FC<Props> = ({
  solveMappedTime,
  playerName,
  playerWins,
  scrumble,
  selectedCube,
  rotated = false,
  screenPressed,
  screenLongPressed,
  screenReleased,
}) => {
  const [buttonPressState, setButtonPressState] = useState(
    PressState.NOT_PRESSED
  );

  const playerLongPressGestures = Gesture.LongPress()
    .onBegin(() => {
      setButtonPressState(PressState.PRESSED);
      screenPressed();
    })
    .maxDistance(1000)
    .onStart(() => {
      setButtonPressState(PressState.LONG_PRESSED);
      screenLongPressed();
    })
    .onEnd(() => {
      setButtonPressState(PressState.NOT_PRESSED);
      screenReleased();
    })
    .runOnJS(true);

  const playerPressGestures = Gesture.Tap()
    .onStart(() => {
      setButtonPressState(PressState.PRESSED);
      screenPressed();
    })
    .onEnd(() => {
      setButtonPressState(PressState.NOT_PRESSED);
      screenReleased();
    })
    .runOnJS(true);

  const playerGestures = Gesture.Simultaneous(
    playerLongPressGestures,
    playerPressGestures
  );

  return (
    <View
      style={[
        styles.mainContainer,
        { transform: [{ rotate: rotated ? "180deg" : "0deg" }] },
      ]}
    >
      <GestureDetector gesture={playerGestures}>
        <View style={styles.contentContainer}>
          <ResultsWidget
            playerName={playerName}
            playerWins={playerWins}
            scrumble={scrumble}
            selectedCube={selectedCube}
          />
          <View style={styles.timeContainer}>
            <Text
              style={[
                styles.text,
                styles.time,
                { color: textButtonColorByState(buttonPressState) },
              ]}
            >
              {formatTimestamp(solveMappedTime)}
            </Text>
          </View>
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    flex: 1,
    display: "flex",
    backgroundColor: "black",
  },
  contentContainer: {
    flex: 1,
    display: "flex",
    gap: 8,
  },

  text: {
    textAlign: "center",
  },
  resultsInfo: {
    fontSize: 20,
  },
  timeContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  time: {
    fontSize: 60,
  },
});
