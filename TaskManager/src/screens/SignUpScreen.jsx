import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useFontSize } from '../contexts/FontSizeContext';
import { registerUser } from '../services/api';

const SignUpScreen = ({ navigation }) => {
  const { fontSize } = useFontSize();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Example of password validation rules
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) && // at least one uppercase letter
      /[a-z]/.test(password) && // at least one lowercase letter
      /[0-9]/.test(password) && // at least one digit
      /[^A-Za-z0-9]/.test(password) // at least one special character
    );
  };

  const handleSignUp = async () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'The email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const data = await registerUser(username, email, password);
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('Login');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.msg) {
          setErrors({ server: error.response.data.msg });
        } else {
          console.error(error);
          Alert.alert('Error', 'Failed to register user');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: parseInt(fontSize) }]}>Sign Up</Text>
      <TextInput
        style={[styles.input, { fontSize: parseInt(fontSize) }]}
        placeholder="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrors({ ...errors, username: '' });
        }}
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}
      <TextInput
        style={[styles.input, { fontSize: parseInt(fontSize) }]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors({ ...errors, email: '' });
        }}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      <TextInput
        style={[styles.input, { fontSize: parseInt(fontSize) }]}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text);
          setErrors({ ...errors, password: '' });
        }}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}
      <Button title="Sign Up" onPress={handleSignUp} />
      {errors.server && <Text style={styles.error}>{errors.server}</Text>}
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignUpScreen;
