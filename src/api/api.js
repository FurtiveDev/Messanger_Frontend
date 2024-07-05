import axios from 'axios';

const toFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => formData.append(key, data[key]));
  return formData;
};

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('session_id');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const register = (data) => api.post('/auth/register', toFormData(data), {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const login = async (data) => {
  const response = await api.post('/auth/login', toFormData(data), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const setCookieHeader = response.headers['set-cookie'];
  if (setCookieHeader) {
    document.cookie = setCookieHeader;
  }

  return response;
};

export const logout = () => api.post('/auth/logout');

// Chats API
export const fetchChats = () => api.get('/chats');
export const createChat = (data) => api.post('/chats', data);
export const fetchChatHistory = (chat_id) => api.get(`/chats/${chat_id}`);
export const deleteChat = (chat_id) => api.delete(`/chats/${chat_id}`);
export const sendMessage = (chat_id, text) => api.post(`/chats/${chat_id}/messages`, { text });
export const deleteMessage = (chat_id, message_id) => api.delete(`/chats/${chat_id}/messages/${message_id}`);
export const updateMessage = (chat_id, message_id, data) => api.patch(`/chats/${chat_id}/messages/${message_id}`, data);

// Profiles API
export const fetchProfile = (profile_id) => api.get(`/profiles/${profile_id}`);
export const fetchSelfProfile = () => api.get('/profiles/self');
export const updateProfile = (data) => api.post('/profiles/self', data);
export const deleteAccount = () => api.delete('/profiles/self');
export const searchProfiles = (query) => api.get(`/profiles/search`, { params: { q: query } });

// Chat Members API
export const fetchChatMembers = (chat_id) => api.get(`/chats/${chat_id}/members`);
export const fetchMessageDetail = (chat_id, message_id) => api.get(`/chats/${chat_id}/messages/${message_id}`);
export const deleteChatMember = (chat_id, username) => api.delete(`/chats/${chat_id}/members`, { params: { username } });
export const addChatMember = (chat_id, data) => api.post(`/chats/${chat_id}/members`, data);

export default api;
