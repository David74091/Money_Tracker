import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { Colors } from "../../constants/Colors";

const CustomTextInput = ({ textInputValue, handleTextChange }) => {
  const [showModal, setShowModal] = useState(false);

  const textInputRef = useRef(null);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [showModal]);

  const handlePress = () => {
    setShowModal(true);
  };

  const handleFinishPress = () => {
    setShowModal(false);
  };

  const handleFeedbackPress = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.inputContainer,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.inputTitle}>備註</Text>
        <Text style={styles.mainText} numberOfLines={1} ellipsizeMode="tail">
          {!showModal && textInputValue}
        </Text>
      </Pressable>
      {showModal && (
        <Modal animationType="fade" transparent={true} visible={showModal}>
          <TouchableWithoutFeedback onPress={handleFeedbackPress}>
            <View style={styles.modalContainer}>
              <View style={styles.ModalInputContainer}>
                <Text
                  style={{
                    fontWeight: "bold",

                    marginBottom: 20,
                    fontSize: 24,
                    color: Colors.gray100,
                  }}
                >
                  備註
                </Text>
                <TextInput
                  multiline={true}
                  value={textInputValue}
                  onChangeText={handleTextChange}
                  ref={textInputRef}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={handleFinishPress}
                  style={styles.finishButton}
                >
                  <Text style={styles.finishButtonText}>完成</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: 325,
    height: 70,
    borderRadius: 12,
    backgroundColor: "white",
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
    paddingHorizontal: 22,
  },
  mainText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray100,
    marginTop: 5,
  },
  input: {
    color: Colors.gray100,
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#e0e3da",
    borderRadius: 16,
    height: 250,
    width: 300,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputTitle: {
    fontWeight: "bold",
    color: Colors.gray100,
    opacity: 0.4,
    marginTop: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "rgba(39,69,85,0.5)",
    flex: 1,
  },
  finishButton: {
    width: "60%",
    height: "10%",
    backgroundColor: Colors.sucess,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  finishButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  ModalInputContainer: {
    marginTop: 80,
    backgroundColor: "white",
    height: 400,
    width: 350,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
});
