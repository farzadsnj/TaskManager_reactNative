import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useFontSize } from '../contexts/FontSizeContext';
import { loginUser } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const { fontSize } = useFontSize();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password!');
      return;
    }

    try {
      const data = await loginUser(email, password);
      Alert.alert('Success', 'Logged in successfully');
      navigation.navigate('Tasks', { token: data.token });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to login');
    }
  };

  const handleDirectAccess = () => {
    navigation.navigate('Tasks', { token: 'dummy-token' });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { fontSize: parseInt(fontSize) }]}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <Button title="Login" onPress={handleLogin} />
        <View style={styles.buttonSpacing}>
          <Button
            title="Go to Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            color="#1DA1F2"
          />
          <Button
            title="Direct Access to Tasks"
            onPress={handleDirectAccess}
            color="red"
          />
        </View>
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
  buttonSpacing: {
    marginTop: 10,
  },
});

export default LoginScreen;
