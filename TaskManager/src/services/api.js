import axios from 'axios';
import { Platform } from 'react-native';

// Define base URLs for different platforms
const baseUrls = {
  ios: 'http://localhost:5000/api',
  android: 'http://10.0.2.2:5000/api',
  default: 'http://192.168.0.6:5000/api' // Replace '192.168.x.x' with your actual local IP
};

// Create an Axios instance with the baseURL
const api = axios.create({
  baseURL: baseUrls[Platform.OS] || baseUrls.default
});

// Unified function to handle responses
const handleResponse = (response) => response.data;

// Unified function to handle errors
const handleError = (error) => {
  if (error.response) {
    console.error('Backend returned status code:', error.response.status);
    console.error('Response data:', error.response.data);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Error', error.message);
  }
  throw new Error(error.response ? error.response.data.message : error.message);
};

// API functions to perform CRUD operations
export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getTasks = async (token) => {
  try {
    const response = await api.get('/tasks', {
      headers: { 'x-auth-token': token }
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const createTask = async (task, token) => {
  try {
    const response = await api.post('/tasks', task, {
      headers: { 'x-auth-token': token }
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const updateTask = async (id, task, token) => {
  try {
    const response = await api.put(`/tasks/${id}`, task, {
      headers: { 'x-auth-token': token }
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTask = async (id, token) => {
  try {
    const response = await api.delete(`/tasks/${id}`, {
      headers: { 'x-auth-token': token }
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
