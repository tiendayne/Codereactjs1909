import api from '../../config/axiosconfig';

export const logout = async () => {
  const response = await api.post('/users/logout');
  return response.data;
};
