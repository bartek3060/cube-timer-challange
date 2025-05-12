import { StatusBar, View } from "react-native";
import { Toolbar } from "@/components/toolbar/toolbar";
import { PlayerScreen } from "@/components/player-screen/player-screen";
import DashedLine from "react-native-dashed-line";
import React, { useEffect } from "react";
import { SolvesMachineContext } from "@/index";
import { SolvesMachineStates } from "@/solves-machine/solves-machine-states.enum";

export const App = () => {
  const isGameInProgress = SolvesMachineContext.useSelector((snapshot) =>
    snapshot.matches(SolvesMachineStates.GameInProgress),
  );
  const actorRef = SolvesMachineContext.useActorRef();
  useEffect(() => {
    const subscription = actorRef.subscribe((snapshot) => {
      console.log(snapshot.value);
    });

    return subscription.unsubscribe;
  }, [actorRef]);

  // TODO implement
  const onSelectedCubeChanged = () => {
    // changeSelectedCube(cube);
  };

  // TODO implement
  const restartSession = () => {};

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {!isGameInProgress && <Toolbar cubeChanged={onSelectedCubeChanged} restartSession={restartSession} />}
      <PlayerScreen rotated={true} playerName={"Player 1"} />
      <DashedLine dashLength={1} dashThickness={1} dashGap={10} dashColor="white" />
      <PlayerScreen playerName={"Player 2"} />
    </View>
  );
};
