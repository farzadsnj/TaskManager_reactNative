import React from "react";
import {
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ExploreScreen({ navigation }) {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Me</ThemedText>
      </ThemedView>
      <ThemedText>
        My name is Farzad Sanjarani. Software developer at Brisbane, Australia
      </ThemedText>
      <Collapsible title="About">
        <ThemedText>
          This app was developed using React Native, Node.js, and other modern
          web technologies.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Settings">
        <ThemedText>
          Customize your app settings to fit your preferences. You can change
          the font size.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Contact">
        <ExternalLink
          url="https://github.com/farzadsnj"
          title="GitHub: farzadsnj"
        />
        <ExternalLink
          url="https://www.linkedin.com/in/farzadsnj/"
          title="LinkedIn: farzadsnj"
        />
      </Collapsible>
      <Collapsible title="External Links">
        <ExternalLink url="https://reactnative.dev/" title="React Native" />
        <ExternalLink url="https://nodejs.org/" title="Node.js" />
        <ExternalLink url="https://expo.dev/" title="Expo" />
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerButton: {
    padding: 10,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
});
