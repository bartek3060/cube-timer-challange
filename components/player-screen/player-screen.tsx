import React, { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ResultsWidget } from "./results-widget/results-widget";
import { formatTimestamp } from "../../utils/get-mapped-date";
import { PressState } from "@/enums/press-state.enum";
import { textButtonColorByState } from "./time-button-color-by-state";
import { SolvesMachineContext } from "@/index";
import { GameEventsNames } from "@/solves-machine/game-event-names.enum";
import { SolvesMachineStates } from "@/solves-machine/solves-machine-states.enum";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

interface FloatingActionProps {
  isExpanded: boolean;
  index: number;
  buttonLetter: string;
  handlePress: () => void;
}

const FloatingActionButton: FC<any> = ({ isExpanded, index, buttonLetter, handlePress }) => {
  const animatedStyles = useAnimatedStyle(() => {
    const moveValue = isExpanded.value ? OFFSET * index : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    const delay = index * 100;

    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });

  return (
    <AnimatedPressable onPress={handlePress} style={[animatedStyles, styles.shadow, styles.button]}>
      <Animated.Text style={styles.content}>{buttonLetter}</Animated.Text>
    </AnimatedPressable>
  );
};

interface Props {
  playerName: string;
  rotated?: boolean;
}

export const PlayerScreen: FC<Props> = ({
  // solveMappedTime,
  playerName,
  // playerWins,
  // scrumble,
  // selectedCube,
  rotated = false,
  // screenPressed,
  // screenLongPressed,
  // screenReleased,
}) => {
  const actorRef = SolvesMachineContext.useActorRef();
  const solveMappedTime = SolvesMachineContext.useSelector(({ context }) => context.time);
  const isGameInProgress = SolvesMachineContext.useSelector((state) =>
    state.matches(SolvesMachineStates.GameInProgress),
  );
  const cubeType = SolvesMachineContext.useSelector((state) => state.context.cubeType);
  const scrumble = SolvesMachineContext.useSelector((state) => state.context.scrumble);
  const buttonPressState =
    SolvesMachineContext.useSelector(
      ({ context }) => context.players.find((player) => player.name === playerName)?.pressState,
    ) ?? PressState.NOT_PRESSED;
  // const handleMenuPress = (item: ItemConfig, index: number) => {
  //   console.log(item);
  // };

  const onDNF = () => {
    console.log("DNF");
    handlePress();
  };

  const onPlusTwo = () => {
    console.log("+2");
    handlePress();
  };

  const playerLongPressGestures = Gesture.LongPress()
    .onBegin(() => {
      if (isGameInProgress) {
        actorRef.send({
          type: GameEventsNames.PlayerQuickPressInProgress,
          playerName,
          solve: { time: solveMappedTime, scrumble, cubeType },
        });
      } else {
        actorRef.send({ type: GameEventsNames.PlayerQuickPressNotInProgress, playerName });
      }
    })
    .maxDistance(1000)
    .onStart(() => {
      actorRef.send({ type: GameEventsNames.PlayerLongPress, playerName });
    })
    .onEnd(() => {
      actorRef.send({ type: GameEventsNames.PlayerReleaseLongPress, playerName });
    })
    .runOnJS(true);

  const playerPressGestures = Gesture.Tap()
    .onEnd(() => {
      actorRef.send({ type: GameEventsNames.PlayerReleaseQuickPress, playerName });
    })
    .runOnJS(true);

  const playerGestures = Gesture.Simultaneous(playerLongPressGestures, playerPressGestures);

  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? "45deg" : "0deg";

    return {
      transform: [{ translateX: translateValue }, { rotate: withTiming(rotateValue) }],
    };
  });

  return (
    <View style={[styles.mainContainer, { transform: [{ rotate: rotated ? "180deg" : "0deg" }] }]}>
      <GestureDetector gesture={playerGestures}>
        <View style={styles.contentContainer}>
          <ResultsWidget playerName={playerName} />
          <View style={styles.timeContainer}>
            <Text style={[styles.text, styles.time, { color: textButtonColorByState(buttonPressState) }]}>
              {formatTimestamp(solveMappedTime)}
            </Text>
          </View>
        </View>
      </GestureDetector>

      {/*<View style={styles.buttonContainer}>*/}
      {/*  <AnimatedPressable onPress={handlePress} style={[styles.shadow, mainButtonStyles.button]}>*/}
      {/*    <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>+</Animated.Text>*/}
      {/*  </AnimatedPressable>*/}
      {/*  <FloatingActionButton handlePress={onPlusTwo} isExpanded={isExpanded} index={1} buttonLetter={"+2"} />*/}
      {/*  <FloatingActionButton handlePress={onDNF} isExpanded={isExpanded} index={2} buttonLetter={"DNF"} />*/}
      {/*</View>*/}
    </View>
  );
};

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: "#007af5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 24,
    color: "#f8f9ff",
  },
});

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

  mainContainer2: {
    position: "relative",
    height: 260,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  button: {
    width: 40,
    height: 40,
    backgroundColor: "#82cab2",
    position: "absolute",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -2,
    flexDirection: "row",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 72,
    right: 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1,
  },

  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  content: {
    color: "#f8f9ff",
    fontWeight: 500,
  },
});
