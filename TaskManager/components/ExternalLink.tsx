import React from 'react';
import { Linking, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const ExternalLink = ({ url, title }) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(url)} style={styles.linkContainer}>
      <Text style={styles.linkText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    marginBottom: 10,
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
