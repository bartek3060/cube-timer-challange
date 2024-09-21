import { FC, memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { scrumbleFontSizeByCubeType } from "./scrumble-font-size-by-cube-type";
import { CubeType } from "@/enums/cube-time.enum";

interface Props {
  playerName: string;
  playerWins: number;
  scrumble: string;
  selectedCube: CubeType;
}

export const ResultsWidget: FC<Props> = memo(
  ({ playerName, playerWins, scrumble, selectedCube }) => {
    return (
      <View style={styles.contentContainer}>
        <Text style={[styles.text, styles.resultsInfo]}>
          {playerName} Wins: {playerWins}
        </Text>
        <Text
          style={[
            styles.text,
            { fontSize: scrumbleFontSizeByCubeType(selectedCube) },
          ]}
        >
          {scrumble}
        </Text>
      </View>
    );
  }
);

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
