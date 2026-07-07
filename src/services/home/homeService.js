import api from '../../config/axios/axiosConfig';

const authHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : undefined);

export const getHomeData = async ({ token, username } = {}) => {
  const response = await api.get('/home', {
    headers: authHeaders(token),
    params: username ? { username } : undefined,
  });

  return response.data;
};

export const getUsersForHome = async ({
  token,
  page = 1,
  limit = 10,
  username,
  security_answer,
} = {}) => {
  const params = { page, limit };

  if (username?.trim()) params.username = username.trim();
  if (security_answer?.trim()) params.security_answer = security_answer.trim();

  const response = await api.get('/home/users', {
    headers: authHeaders(token),
    params,
  });

  return response.data;
};

export const deleteUserForHome = async ({ token, id }) => {
  const response = await api.delete(`/home/users/${id}`, {
    headers: authHeaders(token),
  });

  return response.data;
};
