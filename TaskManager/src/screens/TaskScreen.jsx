import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTailwind } from 'tailwind-rn';
import { useFontSize } from '../contexts/FontSizeContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const TaskScreen = ({ route, navigation }) => {
  const tailwind = useTailwind();
  const { fontSize } = useFontSize();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('00:00');
  const [editTaskId, setEditTaskId] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
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
  }, [token]);

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
    setShowTaskForm(true);
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
      setShowTaskForm(false);
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
    setShowDatePicker(Platform.OS === 'ios');
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

  const renderTaskItem = ({ item }) => (
    <View key={item.id} style={styles.taskItem}>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, { fontSize: parseInt(fontSize) }]}>{item.title}</Text>
        <Text style={[styles.taskDescription, { fontSize: parseInt(fontSize) }]}>{item.description}</Text>
        <Text style={[styles.taskLabel, { fontSize: parseInt(fontSize) }]}>Date: <Text style={styles.taskDueDate}>{item.dueDate.split('T')[0]}</Text></Text>
        <Text style={[styles.taskLabel, { fontSize: parseInt(fontSize) }]}>Time: <Text style={styles.taskDueTime}>{item.dueDate.split(' ')[1]}</Text></Text>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleCompleteTask(item.id)} style={[styles.taskButton, styles.doneButton]}>
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={[styles.taskButton, styles.deleteButton]}>
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditTask(item)} style={[styles.taskButton, styles.editButton]}>
          <Ionicons name="pencil-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={tailwind('flex-1 bg-gray-100')}>
      <View style={styles.header}>
        <Text style={[tailwind('text-4xl font-bold text-center'), { fontSize: parseInt(fontSize) }]}>
          Task Manager
        </Text>
      </View>
      <TouchableOpacity onPress={() => setShowTaskForm(!showTaskForm)} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>{showTaskForm ? 'Hide Task Form' : 'Add Task'}</Text>
      </TouchableOpacity>
      {showTaskForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{editTaskId ? 'Edit Task' : 'Add Task'}</Text>
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
      )}
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.taskList}
        ListEmptyComponent={<Text style={styles.noTasksText}>You have no tasks to do :)</Text>}
      />
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
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  taskContent: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 16,
    color: '#555',
  },
  taskLabel: {
    fontSize: 14,
    color: '#555',
  },
  taskDueDate: {
    fontSize: 14,
    color: '#000',
  },
  taskDueTime: {
    fontSize: 14,
    color: '#000',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
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
  toggleButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    margin: 10,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskList: {
    padding: 15,
    paddingBottom: 100,
  },
  noTasksText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});

export default TaskScreen;
