 import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const login = async (email: string, password: string) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string, role: string) => {
  const response = await api.post('/users/register', { name, email, password, role });
  return response.data;
};

// Project API calls
export const createProject = async (projectData: any) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const getUserProjects = async () => {
  const response = await api.get('/projects/myprojects');
  return response.data;
};

export const getProjectById = async (id: string) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (id: string, projectData: any) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const addMilestone = async (projectId: string, milestoneData: any) => {
  const response = await api.post(`/projects/${projectId}/milestones`, milestoneData);
  return response.data;
};

export const addJournalEntry = async (projectId: string, entryData: any) => {
  const response = await api.post(`/projects/${projectId}/journal`, entryData);
  return response.data;
};

export default api;
