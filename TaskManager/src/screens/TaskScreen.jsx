import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useFontSize } from '../contexts/FontSizeContext';
import { getTasks } from '../services/api';

const TaskScreen = ({ route, navigation }) => {
  const tailwind = useTailwind();
  const { fontSize } = useFontSize();
  const [tasks, setTasks] = useState([]);
  const { token } = route.params; // This token could be a dummy token for testing

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(token); // Adjust the API to handle the dummy token if necessary
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <View style={tailwind('flex-1 p-5 bg-gray-100')}>
      <Text style={[tailwind('text-4xl font-bold mb-5 text-center'), { fontSize: parseInt(fontSize) }]}>
        Task Screen
      </Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tailwind('mb-3 p-3 bg-white rounded-lg shadow-md')}>
            <Text style={{ fontSize: parseInt(fontSize) }}>{item.title}</Text>
          </View>
        )}
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

export default TaskScreen;
