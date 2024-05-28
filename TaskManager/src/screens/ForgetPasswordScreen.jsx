import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { sendPasswordResetEmail } from '../services/api';

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address!');
      return;
    }

    try {
      const response = await sendPasswordResetEmail(email);
      Alert.alert('Success', 'Email is valid. Proceed to reset password.');
      navigation.navigate('ResetPassword', { token: response.token });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Email not found');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button title="Proceed" onPress={handleSendEmail} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default ForgetPasswordScreen;
