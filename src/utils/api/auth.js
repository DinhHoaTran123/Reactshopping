const { default: axiosClient } = require('./axios-client');

const login = (data) =>
  axiosClient({
    url: '/v1/auth/login',
    method: 'POST',
    data,
  });

const register = (data) =>
  axiosClient({
    url: '/v1/auth/register',
    method: 'POST',
    data,
  });

export const authApi = {
  login,
  loginKey: 'login',
  register,
  registerKey: 'register',
};
