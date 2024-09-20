import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ResultsWidget } from "../results-widget/results-widget";
import { formatTimestamp } from "../../utils/get-mapped-date";

interface Props {
  rotated?: boolean;
  solveMappedTime: number;
  playerName: string;
  playerWins: number;
  scrumble: string;
  screenPressed: () => void;
  handleLongPress: () => void;
  handlePressOut: () => void;
}

enum PressState {
  NOT_PRESSED = 0,
  PRESSED = 1,
  LONG_PRESSED = 2,
}

export const PlayerScreen: FC<Props> = ({
  rotated = false,
  scrumble,
  solveMappedTime,
  playerName,
  playerWins,
  screenPressed,
  handleLongPress,
  handlePressOut,
}) => {
  const [pressState, setPressState] = useState(PressState.NOT_PRESSED);

  const playerLongPressGestures = Gesture.LongPress()
    .onBegin(() => {
      setPressState(PressState.PRESSED);
      screenPressed();
    })
    .maxDistance(1000)
    .onStart(() => {
      setPressState(PressState.LONG_PRESSED);
      handleLongPress();
    })
    .onEnd(() => {
      setPressState(PressState.NOT_PRESSED);
      handlePressOut();
    })
    .runOnJS(true);

  const playerPressGestures = Gesture.Tap()
    .onStart(() => {
      setPressState(PressState.PRESSED);
      screenPressed();
    })
    .onEnd(() => {
      setPressState(PressState.NOT_PRESSED);
      handlePressOut();
    })
    .runOnJS(true);

  const playerGestures = Gesture.Simultaneous(
    playerLongPressGestures,
    playerPressGestures
  );

  const textColor = () => {
    switch (pressState) {
      case PressState.NOT_PRESSED:
        return "white";
      case PressState.PRESSED:
        return "yellow";
      case PressState.LONG_PRESSED:
        return "green";
    }
  };

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
          />
          <View style={styles.timeContainer}>
            <Text style={[styles.text, styles.time, { color: textColor() }]}>
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
  scrumble: {
    fontSize: 24,
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
