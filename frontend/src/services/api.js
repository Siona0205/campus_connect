// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Backend server URL
});

export const loginUser = async (username, password, role) => {
  const response = await api.post('/login', { username, password, role });
  return response.data;
};

export const submitComplaint = async (complaintData) => {
  const response = await api.post('/complaints', complaintData);
  return response.data;
};

export const getComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await api.put(`/complaints/${id}`, { status });
  return response.data;
};
