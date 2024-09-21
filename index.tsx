import { registerRootComponent } from "expo";
import { PlayerScreen } from "./components/player-screen/player-screen";
import { useChallenge } from "./hooks/use-challange-hook/use-challange.hook";
import React from "react";
import { StatusBar, Text, View } from "react-native";
import DashedLine from "react-native-dashed-line";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { Toolbar } from "./components/toolbar/toolbar";
import { MenuProvider } from "react-native-popup-menu";
import { CubeType } from "./enums/cube-time.enum";
const AppComponent = gestureHandlerRootHOC(() => {
  const {
    getPlayerData,
    setReleaseButton,
    setPlayerIsReady,
    finishSolve,
    changeSelectedCube,
    restartSession,
    selectedCube,
    isGameInProgress,
    scrumble,
  } = useChallenge();

  const firstPlayerData = getPlayerData("Player 1")!;
  const secondPlayerData = getPlayerData("Player 2")!;

  const onScreenPressed = (playerName: string) => {
    isGameInProgress && finishSolve(playerName);
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

  const onSelectedCubeChanged = (cube: CubeType) => {
    changeSelectedCube(cube);
  };

  return (
    <>
      <MenuProvider>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          {!isGameInProgress && (
            <Toolbar
              cubeChanged={onSelectedCubeChanged}
              restartSession={restartSession}
            />
          )}
          <PlayerScreen
            rotated={true}
            scrumble={scrumble}
            playerName={firstPlayerData.name}
            playerWins={firstPlayerData.wins}
            solveMappedTime={firstPlayerData.time}
            selectedCube={selectedCube}
            screenPressed={() => {
              onScreenPressed(firstPlayerData.name);
            }}
            screenLongPressed={() => {
              onScreenLongPressed(firstPlayerData.name);
            }}
            screenReleased={() => {
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
            selectedCube={selectedCube}
            screenPressed={() => {
              onScreenPressed(secondPlayerData.name);
            }}
            screenLongPressed={() => {
              onScreenLongPressed(secondPlayerData.name);
            }}
            screenReleased={() => {
              onScreenReleased(secondPlayerData.name);
            }}
          />
        </View>
      </MenuProvider>
    </>
  );
});
export default registerRootComponent(AppComponent);
