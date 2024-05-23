import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTailwind } from 'tailwind-rn';
import { useFontSize } from '../contexts/FontSizeContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { Picker } from '@react-native-picker/picker';

const TaskManager = ({ route, navigation }) => {
  const tailwind = useTailwind();
  const { fontSize } = useFontSize();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('00:00');
  const [editTaskId, setEditTaskId] = useState(null);
  const { token } = route.params;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(token);
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!title || !description || !dueDate || !time) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      const newTask = await createTask({ title, description, dueDate: `${dueDate.toISOString().split('T')[0]} ${time}` }, token);
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setTime('00:00');
      Alert.alert('Task created successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(new Date(task.dueDate));
    setTime(task.dueDate.split(' ')[1]);
  };

  const handleUpdateTask = async () => {
    try {
      await updateTask(editTaskId, { title, description, dueDate: `${dueDate.toISOString().split('T')[0]} ${time}` }, token);
      setTasks(tasks.map(task => (task.id === editTaskId ? { ...task, title, description, dueDate: `${dueDate.toISOString().split('T')[0]} ${time}` } : task)));
      setEditTaskId(null);
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setTime('00:00');
      Alert.alert('Task updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await updateTask(id, { status: 'Completed' }, token);
      setTasks(tasks.map(task => (task.id === id ? { ...task, status: 'Completed' } : task)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id, token);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const renderTimePicker = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i < 10 ? `0${i}:00` : `${i}:00`);
    }

    return (
      <Picker
        selectedValue={time}
        style={[styles.input, { fontSize: parseInt(fontSize) }]}
        onValueChange={(itemValue) => setTime(itemValue)}
      >
        {hours.map((hour) => (
          <Picker.Item key={hour} label={hour} value={hour} />
        ))}
      </Picker>
    );
  };

  return (
    <View style={tailwind('flex-1 bg-gray-100')}>
      <View style={styles.header}>
        <Text style={[tailwind('text-4xl font-bold text-center'), { fontSize: parseInt(fontSize) }]}>
          Task Manager
        </Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, { fontSize: parseInt(fontSize) }]}
          placeholder="Add title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { fontSize: parseInt(fontSize) }]}
          placeholder="Add description"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={[styles.input, { fontSize: parseInt(fontSize) }]}
            placeholder="Due Date"
            value={dueDate.toISOString().split('T')[0]}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {renderTimePicker()}
        {editTaskId ? (
          <TouchableOpacity onPress={handleUpdateTask} style={styles.saveButton}>
            <Text style={styles.buttonText}>Update Task</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleCreateTask} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View>
              <Text style={{ fontSize: parseInt(fontSize) }}>{item.title}</Text>
              <Text style={{ fontSize: parseInt(fontSize) }}>{item.description}</Text>
              <Text style={{ fontSize: parseInt(fontSize) }}>{item.dueDate}</Text>
            </View>
            <View style={styles.taskActions}>
              <TouchableOpacity onPress={() => handleCompleteTask(item.id)} style={[styles.taskButton, styles.doneButton]}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={[styles.taskButton, styles.deleteButton]}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditTask(item)} style={[styles.taskButton, styles.editButton]}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    fontSize: 16,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: '#FFF',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskActions: {
    flexDirection: 'row',
  },
  taskButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 4,
  },
  doneButton: {
    backgroundColor: '#28A745',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
  },
  editButton: {
    backgroundColor: '#FFC107',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default TaskManager;
