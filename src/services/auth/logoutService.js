import api from '../../config/axios/axiosConfig';

export const logout = async () => {
  const response = await api.post('/users/logout');
  return response.data;
};
