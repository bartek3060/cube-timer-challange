import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View, StyleSheet } from "react-native";
import { CubeType } from "@/enums/cube-time.enum";
import { FC, useState } from "react";

interface Props {
  cubeChanged: (cubeType: CubeType) => void;
}

const availableCubesDisplayData = [
  { value: CubeType.twoXTwo, displayText: "2x2" },
  { value: CubeType.threeXThree, displayText: "3x3" },
  { value: CubeType.fourXFour, displayText: "4x4" },
  { value: CubeType.fiveXFive, displayText: "5x5" },
  { value: CubeType.pyraminx, displayText: "Pyraminx" },
  { value: CubeType.skewb, displayText: "Skewb" },
  { value: CubeType.square1, displayText: "Square 1" },
];

export const CubeSelector: FC<Props> = ({ cubeChanged }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const onCubeSelect = (cubeType: CubeType) => {
    cubeChanged(cubeType);
    setModalVisible(!modalVisible);
  };

  const availableOptions = availableCubesDisplayData.map(
    ({ value, displayText }) => (
      <Pressable
        style={{ flex: 1 }}
        key={value}
        onPress={() => onCubeSelect(value)}
      >
        <View
          style={{
            padding: 10,
            backgroundColor: "#111",
            borderBottomColor: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            flex: 1,
          }}
        >
          <Text style={styles.textStyle}>{displayText}</Text>
        </View>
      </Pressable>
    )
  );

  return (
    <View>
      <Modal
        style={{
          margin: 0,
          alignItems: undefined,
          justifyContent: undefined,
        }}
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={{ width: "100%" }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <View
                style={{
                  backgroundColor: "#666",
                  width: "100%",
                  padding: 20,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: "50%",
                    marginLeft: "auto",
                    flex: 1,
                    transform: [{ translateX: 7 }],
                  }}
                >
                  <Text style={styles.textStyle}>Select Cube</Text>
                </View>
                <Ionicons
                  name="close"
                  size={24}
                  color="white"
                  style={{ alignSelf: "flex-end" }}
                />
              </View>
            </Pressable>

            <View
              style={{
                flex: 1,
                width: "100%",
              }}
            >
              {availableOptions}
            </View>
          </View>
        </View>
      </Modal>

      <Pressable onPress={() => setModalVisible(true)}>
        <FontAwesome name="cubes" size={36} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 36,
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    alignSelf: "stretch",
    borderRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
  },
});
