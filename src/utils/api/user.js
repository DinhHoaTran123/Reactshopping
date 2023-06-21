import { HTTP_METHODS } from 'utils/constants';

const { default: axiosClient } = require('./axios-client');

const myProfile = (context) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/users/my-profile',
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data?.data || null);
};

const get = (context, params) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/users',
    method: HTTP_METHODS.GET,
    signal,
    params,
  }).then((resp) => resp.data?.data);
};

const getById = (context, id) => {
  const { signal } = context;
  return axiosClient({
    url: `/v1/users/${id}`,
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data?.data);
};

const create = (data) =>
  axiosClient({
    url: '/v1/users',
    method: HTTP_METHODS.POST,
    data,
  }).then((resp) => resp.data);

const update = ({ data, id }) =>
  axiosClient({
    url: `/v1/users/${id}`,
    method: HTTP_METHODS.PATCH,
    data,
  }).then((resp) => resp.data);

const remove = (id) =>
  axiosClient({
    url: `/v1/users/${id}`,
    method: HTTP_METHODS.DELETE,
  }).then((resp) => resp.data);

export const userApi = {
  myProfile,
  myProfileKey: 'myProfile',
  get,
  getKey: 'getUser',
  getById,
  getByIdKey: 'getUserById',
  create,
  createKey: 'createUser',
  update,
  updateKey: 'updateUser',
  remove,
  removeKey: 'removeUser',
};
