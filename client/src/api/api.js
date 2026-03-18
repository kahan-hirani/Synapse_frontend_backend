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

  updateProfile: async (payload, token) => {
    try {
      const { data } = await apiClient.patch('/users/profile', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  updatePassword: async (payload, token) => {
    try {
      const { data } = await apiClient.patch('/users/profile/password', payload, {
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

  listNotebooks: async (token) => {
    try {
      const { data } = await apiClient.get('/notebooks', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  createNotebook: async (payload, token) => {
    try {
      const { data } = await apiClient.post('/notebooks', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  updateNotebook: async (id, payload, token) => {
    try {
      const { data } = await apiClient.patch(`/notebooks/${id}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  deleteNotebook: async (id, token) => {
    try {
      const { data } = await apiClient.delete(`/notebooks/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  deleteNotebookSource: async (notebookId, sourceId, token) => {
    try {
      const { data } = await apiClient.delete(`/notebooks/${notebookId}/sources/${sourceId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  duplicateNotebook: async (id, token) => {
    try {
      const { data } = await apiClient.post(
        `/notebooks/${id}/duplicate`,
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

  uploadPdf: async (file, token, notebookId) => {
    const formData = new FormData();
    formData.append('pdf', file);
    if (notebookId) {
      formData.append('notebookId', notebookId);
    }

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

  getNotebookChatHistory: async (notebookId, token) => {
    try {
      const { data } = await apiClient.get(`/chat/history/${notebookId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};

export default apiClient;
