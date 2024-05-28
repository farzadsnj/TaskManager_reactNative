import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.select({
  ios: 'http://localhost:5000/api',
  android: 'http://10.0.2.2:5000/api',
  default: 'http://localhost:5000/api'
});

const api = axios.create({
  baseURL
});

const handleResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(`HTTP status ${response.status}`);
  }
};

const handleError = (error) => {
  if (error.response) {
    console.error('Backend returned status code:', error.response.status);
    console.error('Response data:', error.response.data);
    console.error('Response headers:', error.response.headers);
    throw new Error(error.response.data.error || 'Server Error');
  } else if (error.request) {
    console.error('No response received:', error.request);
    throw new Error('No response received from server');
  } else {
    console.error('Error', error.message);
    throw new Error(error.message);
  }
};

export const getTasks = async (token) => {
  try {
    const response = await api.get('/tasks', {
      headers: {
        'x-auth-token': token,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const createTask = async (task, token) => {
  try {
    const response = await api.post('/tasks', task, {
      headers: {
        'x-auth-token': token,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updateTask = async (id, task, token) => {
  try {
    const response = await api.put(`/tasks/${id}`, task, {
      headers: {
        'x-auth-token': token,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deleteTask = async (id, token) => {
  try {
    const response = await api.delete(`/tasks/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
