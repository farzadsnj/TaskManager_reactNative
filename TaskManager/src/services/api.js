import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this is the correct URL to your backend
});

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTasks = async (token) => {
  try {
    const response = await api.get('/tasks', {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (task, token) => {
  try {
    const response = await api.post('/tasks', task, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (id, task, token) => {
  try {
    const response = await api.put(`/tasks/${id}`, task, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id, token) => {
  try {
    const response = await api.delete(`/tasks/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
