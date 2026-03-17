import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

function normalizeError(error) {
  if (error?.response?.data?.errMessage) return error.response.data.errMessage;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Request failed';
}

export const api = {
  register: async (payload) => {
    try {
      const { data } = await apiClient.post('/users/register', payload);
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  login: async (payload) => {
    try {
      const { data } = await apiClient.post('/users/login', payload);
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  profile: async (token) => {
    try {
      const { data } = await apiClient.get('/users/profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  logout: async (token) => {
    try {
      const { data } = await apiClient.post(
        '/users/logout',
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  uploadPdf: async (file, token) => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const { data } = await apiClient.post('/pdf/upload', formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  askPdf: async (payload, token) => {
    try {
      const { data } = await apiClient.post('/chat', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};

export default apiClient;
