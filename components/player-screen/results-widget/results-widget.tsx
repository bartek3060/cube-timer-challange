import { FC, memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { scrumbleFontSizeByCubeType } from "./scrumble-font-size-by-cube-type";
import { SolvesMachineContext } from "@/index";

interface Props {
  playerName: string;
}

export const ResultsWidget: FC<Props> = memo(({ playerName }) => {
  const playerWins =
    SolvesMachineContext.useSelector(
      ({ context }) => context.players.find((player) => player.name === playerName)?.wins,
    ) ?? 0;
  const selectedCube = SolvesMachineContext.useSelector(({ context }) => context.cubeType);
  const scrumble = SolvesMachineContext.useSelector(({ context }) => context.scrumble);

  return (
    <View style={styles.contentContainer}>
      <Text style={[styles.text, styles.resultsInfo]}>
        {playerName} Wins: {playerWins}
      </Text>
      <Text style={[styles.text, { fontSize: scrumbleFontSizeByCubeType(selectedCube) }]}>{scrumble}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    display: "flex",
  },

  text: {
    color: "white",
    textAlign: "center",
  },
  resultsInfo: {
    fontSize: 20,
  },
  scrumble: {
    fontSize: 24,
  },
});
