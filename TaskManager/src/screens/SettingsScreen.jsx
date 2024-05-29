import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import { useTailwind } from "tailwind-rn";
import { useFontSize } from "../contexts/FontSizeContext";

const SettingsScreen = () => {
  const tailwind = useTailwind();
  const { fontSize, saveFontSize } = useFontSize();
  const [inputFontSize, setInputFontSize] = useState(fontSize);

  useEffect(() => {
    setInputFontSize(fontSize);
  }, [fontSize]);

  const handleSave = async () => {
    await saveFontSize(inputFontSize);
    Alert.alert("Settings saved");
  };

  return (
    <View style={tailwind("flex-1 p-5 justify-center bg-gray-100")}>
      <Text
        style={[
          tailwind("text-4xl font-bold mb-5 text-center"),
          { fontSize: parseInt(fontSize) },
        ]}
      >
        Settings
      </Text>
      <Text
        style={[tailwind("text-lg mb-2"), { fontSize: parseInt(fontSize) }]}
      >
        Font Size
      </Text>
      <TextInput
        style={tailwind("border border-gray-300 p-3 mb-5 rounded-lg")}
        value={inputFontSize}
        onChangeText={setInputFontSize}
        keyboardType="numeric"
      />
      <Button title="Save Settings" onPress={handleSave} />
    </View>
  );
};

export default SettingsScreen;
