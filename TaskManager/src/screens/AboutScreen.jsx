import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFontSize } from "../contexts/FontSizeContext";

const AboutScreen = () => {
  const { fontSize } = useFontSize();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { fontSize: parseInt(fontSize) }]}>
        About Task Manager
      </Text>
      <Text style={[styles.text, { fontSize: parseInt(fontSize) }]}>
        Task Manager is a productivity app designed to help you manage your
        tasks efficiently. You can create, update, and delete tasks, as well as
        track your progress.
      </Text>
      <Text style={[styles.text, { fontSize: parseInt(fontSize) }]}>
        <Text style={styles.bold}>Version:</Text> 1.0.0
      </Text>
      <Text style={[styles.text, { fontSize: parseInt(fontSize) }]}>
        <Text style={styles.bold}>Developer:</Text> Your Name
      </Text>
      <Text style={[styles.text, { fontSize: parseInt(fontSize) }]}>
        <Text style={styles.bold}>Email:</Text> your.email@example.com
      </Text>
      <Text style={[styles.text, { fontSize: parseInt(fontSize) }]}>
        <Text style={styles.bold}>License:</Text> This app is licensed under the
        MIT License.
      </Text>
      <Text style={[styles.text, { fontSize: parseInt(fontSize) }]}>
        <Text style={styles.bold}>Open Source Licenses:</Text>
        {"\n"}- React Native
        {"\n"}- Expo
        {"\n"}- Axios
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default AboutScreen;
