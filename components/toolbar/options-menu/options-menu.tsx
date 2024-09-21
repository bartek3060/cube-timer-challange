import { Entypo } from "@expo/vector-icons";
import { FC, useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  restartSession: () => void;
}

export const OptionsMenu: FC<Props> = ({ restartSession }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const onRestartSessionClick = () => {
    setModalVisible(!modalVisible);
    restartSession();
  };

  const onSessionStatsClick = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)}>
        <Entypo name="dots-three-vertical" size={36} color="white" />
      </Pressable>
      <Modal
        // style={{ flex: 1 }}
        style={{}}
        onDismiss={() => setModalVisible(false)}
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
                  justifyContent: "space-between",
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
                  <Text style={[styles.textStyle]}>Options</Text>
                </View>
                <Ionicons name="close" size={24} color="white" />
              </View>
            </Pressable>
            <Pressable
              style={{ width: "100%" }}
              onPress={onRestartSessionClick}
            >
              <View
                style={{
                  //   width: "100%",
                  borderBottomColor: "#666",
                  borderWidth: 2,
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.textStyle}>Reset Session</Text>
              </View>
            </Pressable>

            <Pressable
              style={{ width: "100%" }}
              onPress={onRestartSessionClick}
            >
              <View
                style={{
                  //   width: "100%",
                  borderBottomColor: "#666",
                  borderWidth: 2,
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.textStyle}>Session Stats</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalView: {
    margin: 36,
    minHeight: 300,
    backgroundColor: "#111",
    display: "flex",
    alignSelf: "stretch",
    borderRadius: 20,
    // justifyContent: "space-between",
    alignItems: "center",
  },
});
