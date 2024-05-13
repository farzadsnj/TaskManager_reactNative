import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('16');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedFontSize = await AsyncStorage.getItem('fontSize');
        if (savedFontSize !== null) {
          setFontSize(savedFontSize);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadSettings();
  }, []);

  const saveFontSize = async (size) => {
    try {
      await AsyncStorage.setItem('fontSize', size);
      setFontSize(size); // Update the state after saving asynchronously
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, saveFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
