import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTailwind } from "tailwind-rn";
import { useFontSize } from "../contexts/FontSizeContext";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarPicker from "react-native-calendar-picker";
import { format } from "date-fns";

const TaskScreen = ({ route, navigation }) => {
  const tailwind = useTailwind();
  const { fontSize } = useFontSize();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]); // State for completed/deleted tasks
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState("00:00");
  const [editTaskId, setEditTaskId] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [errors, setErrors] = useState({});
  const [showUpcomingTask, setShowUpcomingTask] = useState(true);
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
    let formErrors = {};

    if (!title) formErrors.title = "This field is required";
    if (!description) formErrors.description = "This field is required";
    if (!dueDate) formErrors.dueDate = "This field is required";
    if (!time) formErrors.time = "This field is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const newTask = await createTask(
        {
          title,
          description,
          dueDate: `${dueDate.toISOString().split("T")[0]} ${time}`,
        },
        token
      );
      setTasks([...tasks, newTask]);
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setTime("00:00");
      setErrors({});
      Alert.alert("Success", "Task created successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create task");
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(new Date(task.dueDate));
    setTime(task.dueDate.split(" ")[1]);
    setShowTaskForm(true);
  };

  const handleUpdateTask = async () => {
    let formErrors = {};

    if (!title) formErrors.title = "This field is required";
    if (!description) formErrors.description = "This field is required";
    if (!dueDate) formErrors.dueDate = "This field is required";
    if (!time) formErrors.time = "This field is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await updateTask(
        editTaskId,
        {
          title,
          description,
          dueDate: `${dueDate.toISOString().split("T")[0]} ${time}`,
        },
        token
      );
      setTasks(
        tasks.map((task) =>
          task.id === editTaskId
            ? {
                ...task,
                title,
                description,
                dueDate: `${dueDate.toISOString().split("T")[0]} ${time}`,
              }
            : task
        )
      );
      setEditTaskId(null);
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setTime("00:00");
      setErrors({});
      setShowTaskForm(false);
      Alert.alert("Success", "Task updated successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const taskToComplete = tasks.find((task) => task.id === id);
      await updateTask(id, { ...taskToComplete, status: "Completed" }, token);
      setTasks(tasks.filter((task) => task.id !== id));
      setCompletedTasks([
        ...completedTasks,
        { ...taskToComplete, status: "Completed" },
      ]);
      Alert.alert("Success", "Task marked as completed");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to mark task as completed");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskToDelete = tasks.find((task) => task.id === id);
      await deleteTask(id, token);
      setTasks(tasks.filter((task) => task.id !== id));
      setCompletedTasks([
        ...completedTasks,
        { ...taskToDelete, status: "Deleted" },
      ]);
      Alert.alert("Success", "Task deleted successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete task");
    }
  };

  const handleRestoreTask = async (id) => {
    try {
      const taskToRestore = completedTasks.find((task) => task.id === id);
      await updateTask(id, { ...taskToRestore, status: "Pending" }, token);
      setCompletedTasks(completedTasks.filter((task) => task.id !== id));
      setTasks([...tasks, { ...taskToRestore, status: "Pending" }]);
      Alert.alert("Success", "Task restored successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to restore task");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === "ios");
    setDueDate(currentDate);
  };

  const handleCalendarDateChange = (date) => {
    setDueDate(date);
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

  const renderTaskItem = ({ item }) => {
    const formattedDueDate = format(new Date(item.dueDate), "yyyy-MM-dd HH:mm");

    return (
      <View style={styles.taskItem} key={item.id}>
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, { fontSize: parseInt(fontSize) }]}>
            {item.title}
          </Text>
          <Text
            style={[styles.taskDescription, { fontSize: parseInt(fontSize) }]}
          >
            {item.description}
          </Text>
          <Text style={[styles.taskLabel, { fontSize: parseInt(fontSize) }]}>
            Date:{" "}
            <Text style={styles.taskDueDate}>
              {formattedDueDate.split(" ")[0]}
            </Text>
          </Text>
          <Text style={[styles.taskLabel, { fontSize: parseInt(fontSize) }]}>
            Time:{" "}
            <Text style={styles.taskDueTime}>
              {formattedDueDate.split(" ")[1]}
            </Text>
          </Text>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity
            onPress={() => handleCompleteTask(item.id)}
            style={[styles.taskButton, styles.doneButton]}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteTask(item.id)}
            style={[styles.taskButton, styles.deleteButton]}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEditTask(item)}
            style={[styles.taskButton, styles.editButton]}
          >
            <Ionicons name="pencil-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCompletedTaskItem = ({ item }) => {
    const formattedDueDate = format(new Date(item.dueDate), "yyyy-MM-dd HH:mm");
    const isRestorable = new Date(item.dueDate) > new Date();

    return (
      <View style={styles.taskItem} key={item.id}>
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, { fontSize: parseInt(fontSize) }]}>
            {item.title}
          </Text>
          <Text
            style={[styles.taskDescription, { fontSize: parseInt(fontSize) }]}
          >
            {item.description}
          </Text>
          <Text style={[styles.taskLabel, { fontSize: parseInt(fontSize) }]}>
            Date:{" "}
            <Text style={styles.taskDueDate}>
              {formattedDueDate.split(" ")[0]}
            </Text>
          </Text>
          <Text style={[styles.taskLabel, { fontSize: parseInt(fontSize) }]}>
            Time:{" "}
            <Text style={styles.taskDueTime}>
              {formattedDueDate.split(" ")[1]}
            </Text>
          </Text>
        </View>
        <View style={styles.taskActions}>
          {isRestorable && (
            <TouchableOpacity
              onPress={() => handleRestoreTask(item.id)}
              style={[styles.taskButton, styles.restoreButton]}
            >
              <Ionicons name="refresh-outline" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderNextUpcomingTask = () => {
    if (!showUpcomingTask) return null;

    const nextTask = tasks.reduce((closest, task) => {
      const taskDueDate = new Date(task.dueDate);
      return !closest || taskDueDate < new Date(closest.dueDate)
        ? task
        : closest;
    }, null);

    if (!nextTask) return null;

    return (
      <View style={styles.upcomingTaskContainer}>
        <View style={styles.upcomingTaskHeader}>
          <Text style={styles.upcomingTaskTitle}>Next Upcoming Task</Text>
          <TouchableOpacity onPress={() => setShowUpcomingTask(false)}>
            <Ionicons name="close-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.upcomingTaskText}>{nextTask.title}</Text>
        <Text style={styles.upcomingTaskText}>
          {format(new Date(nextTask.dueDate), "yyyy-MM-dd")}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={tailwind("flex-1 bg-gray-100")}>
        <View style={styles.header}>
          <Text
            style={[
              tailwind("text-8xl font-bold text-center"),
              { fontSize: parseInt(fontSize) },
            ]}
          >
            Task Manager
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Text
              style={[styles.calendarTitle, { fontSize: parseInt(fontSize) }]}
            >
              Calendar
            </Text>
            <CalendarPicker
              onDateChange={handleCalendarDateChange}
              selectedStartDate={dueDate}
              todayBackgroundColor="#e6ffe6"
              selectedDayColor="#66ff66"
              selectedDayTextColor="#000000"
            />
            <TouchableOpacity
              onPress={() => setShowCalendar(false)}
              style={styles.closeCalendarButton}
            >
              <Text style={styles.closeCalendarButtonText}>Close Calendar</Text>
            </TouchableOpacity>
          </View>
        )}
        {!showCalendar && (
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            style={styles.openCalendarButton}
          >
            <Text style={styles.openCalendarButtonText}>Open Calendar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setShowTaskForm(!showTaskForm)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {showTaskForm ? "Hide Task Form" : "Add Task"}
          </Text>
        </TouchableOpacity>
        {renderNextUpcomingTask()}
        {showTaskForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editTaskId ? "Edit Task" : "Add Task"}
            </Text>
            <View>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.title ? "red" : "gray",
                    fontSize: parseInt(fontSize),
                  },
                ]}
                placeholder="Add title"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}
            </View>
            <View>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.description ? "red" : "gray",
                    fontSize: parseInt(fontSize),
                  },
                ]}
                placeholder="Add description"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description)
                    setErrors({ ...errors, description: null });
                }}
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.dueDate ? "red" : "gray",
                    color: "black",
                    fontSize: parseInt(fontSize),
                  },
                ]}
                placeholder="Due Date"
                value={dueDate.toISOString().split("T")[0]}
                editable={false}
              />
              {errors.dueDate && (
                <Text style={styles.errorText}>{errors.dueDate}</Text>
              )}
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            <View>
              {renderTimePicker()}
              {errors.time && (
                <Text style={styles.errorText}>{errors.time}</Text>
              )}
            </View>
            {editTaskId ? (
              <TouchableOpacity
                onPress={handleUpdateTask}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Update Task</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleCreateTask}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles.taskListContainer}>
          {tasks.length > 0 ? (
            tasks.map((task) => renderTaskItem({ item: task }))
          ) : (
            <Text style={styles.noTasksText}>You have No tasks to do :)</Text>
          )}
        </View>
        {completedTasks.length > 0 && (
          <View style={styles.completedTasksContainer}>
            <Text style={styles.sectionTitle}>Completed/Deleted Tasks</Text>
            {completedTasks.map((task) =>
              renderCompletedTaskItem({ item: task })
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    textAlign: "center",
    fontWeight: "bold",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  calendarContainer: {
    padding: 15,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeCalendarButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  closeCalendarButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  openCalendarButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    margin: 10,
  },
  openCalendarButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  formContainer: {
    padding: 15,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    fontSize: 16,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  taskListContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  taskItem: {
    backgroundColor: "#FFF",
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
  },
  taskContent: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  taskDescription: {
    fontSize: 16,
    color: "#555",
  },
  taskLabel: {
    fontSize: 14,
    color: "#555",
  },
  taskDueDate: {
    fontSize: 14,
    color: "#000",
  },
  taskDueTime: {
    fontSize: 14,
    color: "#000",
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  doneButton: {
    backgroundColor: "#28A745",
  },
  deleteButton: {
    backgroundColor: "#DC3545",
  },
  editButton: {
    backgroundColor: "#FFC107",
  },
  restoreButton: {
    backgroundColor: "#007BFF",
  },
  toggleButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    margin: 10,
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noTasksText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
  upcomingTaskContainer: {
    padding: 15,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  upcomingTaskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upcomingTaskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  upcomingTaskText: {
    fontSize: 16,
    marginTop: 5,
  },
  completedTasksContainer: {
    padding: 15,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default TaskScreen;
