import { FontAwesome } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";

import { StyleSheet, View, Text } from "react-native";
import { CubeSelector } from "./cube-selector/cube-selector";
import { CubeType } from "@/enums/cube-time.enum";
import { FC } from "react";

interface Props {
  cubeChanged: (cubeType: CubeType) => void;
}

export const Toolbar: FC<Props> = ({ cubeChanged }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.iconsContainer}>
        <Entypo name="dots-three-vertical" size={36} color="white" />
        <CubeSelector cubeChanged={cubeChanged} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  iconsContainer: {
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
});
