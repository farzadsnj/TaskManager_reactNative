import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useFontSize } from '../contexts/FontSizeContext';
import { loginUser } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const { fontSize } = useFontSize();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      // Store token securely
      Alert.alert('Success', 'Logged in successfully');
      navigation.navigate('Tasks', { token: data.token });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: parseInt(fontSize) }]}>Login</Text>
      <TextInput
        style={[styles.input, { fontSize: parseInt(fontSize) }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { fontSize: parseInt(fontSize) }]}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Go to Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
      <Button
        title="About"
        onPress={() => navigation.navigate('About')}
      />
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default LoginScreen;
