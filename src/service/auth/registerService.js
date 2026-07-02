import api from '../../config/axiosconfig';

export const register = async ({ username, password, security_question, security_answer }) => {
  const response = await api.post('/users/register', {
    username,
    password,
    security_question,
    security_answer,
  });
  return response.data;
};
