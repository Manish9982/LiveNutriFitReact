import React, { useState, useRef, useEffect } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { colors } from '../../colorSchemes/ColorSchemes';

const InputModalBox = ({ initialValue = '', value, onSubmit, onChangeText, keyboardType = null, maxLength = null, width = null, ...props }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (modalVisible && inputRef.current) {
      inputRef.current.focus();
      //inputRef.current.select();
    }
  }, [modalVisible]);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleInputChange = (text) => {
    setInputValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleInputSubmit = () => {
    setModalVisible(false);
    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.box, { width: width }]} onPress={handleModalOpen}>
        <Text>{value || inputValue}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              activeUnderlineColor={colors.GREEN}
              ref={inputRef}
              style={styles.input}
              onChangeText={handleInputChange}
              value={inputValue}
              keyboardType={keyboardType}
              maxLength={maxLength}
              {...props}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleInputSubmit}>
              <Text style={{ color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.OFFWHITE,
    margin:4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: colors.OFFWHITE
  },
  submitButton: {
    backgroundColor: colors.GREEN,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default InputModalBox;
