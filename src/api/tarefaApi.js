import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  getAll() {
    return axios.get(API_BASE_URL);
  },

  getById(id) {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  create(tarefa) {
    return axios.post(API_BASE_URL, tarefa);
  },

  update(id, tarefa) {
    return axios.put(`${API_BASE_URL}/${id}`, tarefa);
  },

  delete(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
