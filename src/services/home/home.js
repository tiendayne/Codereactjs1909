import api from '../../config/axios/axiosConfig';

export const getHomeData = async ({ token, username } = {}) => {
  const response = await api.get('/home', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    params: username ? { username } : undefined,
  });

  return response.data;
};
