import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CustomAlert = (title, body) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={handleClose}
    >
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          width: '80%',
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>{title}</Text>
        <Text>{body}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomAlert;
