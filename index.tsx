import { registerRootComponent } from "expo";
import { PlayerScreen } from "./components/player-screen/player-screen";
import { useChallenge } from "./hooks/use-challange-hook/use-challange.hook";
import { formatTimestamp } from "./utils/get-mapped-date";
import React from "react";
import { StatusBar, Text, View } from "react-native";
import DashedLine from "react-native-dashed-line";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
const AppComponent = gestureHandlerRootHOC(() => {
  const {
    setReleaseButton,
    getPlayerData,
    setPlayerIsReady,
    completeSolve,
    shouldResetChallenge,
    challengeIsInProgress,
    scrumble,
  } = useChallenge();

  const firstPlayerData = getPlayerData("Player 1")!;
  const secondPlayerData = getPlayerData("Player 2")!;

  const onScreenPressed = (playerName: string) => {
    challengeIsInProgress && completeSolve(playerName);
    setReleaseButton(playerName, false);
  };

  const onScreenLongPressed = (playerName: string) => {
    setPlayerIsReady(playerName, true);
    setReleaseButton(playerName, false);
  };

  const onScreenReleased = (playerName: string) => {
    setReleaseButton(playerName, true);
    setPlayerIsReady(playerName, false);
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <PlayerScreen
          rotated={true}
          scrumble={scrumble}
          playerName={firstPlayerData.name}
          playerWins={firstPlayerData.wins}
          solveMappedTime={firstPlayerData.time}
          screenPressed={() => {
            onScreenPressed(firstPlayerData.name);
          }}
          handleLongPress={() => {
            onScreenLongPressed(firstPlayerData.name);
          }}
          handlePressOut={() => {
            onScreenReleased(firstPlayerData.name);
          }}
        />

        <DashedLine
          dashLength={1}
          dashThickness={1}
          dashGap={10}
          dashColor="white"
        />
        <PlayerScreen
          scrumble={scrumble}
          playerName={secondPlayerData.name}
          playerWins={secondPlayerData.wins}
          solveMappedTime={secondPlayerData.time}
          screenPressed={() => {
            onScreenPressed(secondPlayerData.name);
          }}
          handleLongPress={() => {
            onScreenLongPressed(secondPlayerData.name);
          }}
          handlePressOut={() => {
            onScreenReleased(secondPlayerData.name);
          }}
        />
      </View>
    </>
  );
});
export default registerRootComponent(AppComponent);
