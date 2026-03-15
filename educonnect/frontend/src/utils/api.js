import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ec_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

API.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ec_token');
      localStorage.removeItem('ec_user');
      localStorage.removeItem('ec_role');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// Admin
export const adminLogin = d => API.post('/admin/auth/login', d);
export const getStudents = p => API.get('/admin/students', { params: p });
export const getStudent = id => API.get(`/admin/students/${id}`);
export const createStudent = d => API.post('/admin/students', d);
export const updateStudent = (id, d) => API.put(`/admin/students/${id}`, d);
export const deleteStudent = id => API.delete(`/admin/students/${id}`);
export const toggleStudent = id => API.patch(`/admin/students/${id}/toggle`);
export const getStats = () => API.get('/admin/students/stats/overview');

// Parent
export const parentVerify = d => API.post('/parent/auth/verify', d);
export const parentVerifyOTP = d => API.post('/parent/auth/verify-otp', d);
export const sendChatMessage = msg => API.post('/parent/chat/message', { message: msg });
export const getMyProfile = () => API.get('/parent/student/profile');

export default API;
