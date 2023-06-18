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
  axiosClient({
    url: '/v1/users',
    method: HTTP_METHODS.GET,
    signal,
    params,
  });
};

const getById = (context, id) => {
  const { signal } = context;
  axiosClient({
    url: `/v1/users/${id}`,
    method: HTTP_METHODS.GET,
    signal,
  });
};

const create = (data) => {
  axiosClient({
    url: '/v1/users/my-profile',
    method: HTTP_METHODS.POST,
    data,
  });
};
const update = (data) => {
  axiosClient({
    url: `/v1/users/${data.id}`,
    method: HTTP_METHODS.PATCH,
    data,
  });
};

const remove = (id) => {
  axiosClient({
    url: `/v1/users/${id}`,
    method: HTTP_METHODS.DELETE,
  });
};

export const userApi = {
  myProfile,
  myProfileKey: 'myProfile',
  get,
  getKey: 'get',
  getById,
  getByIdKey: 'getById',
  create,
  createKey: 'create',
  update,
  updateKey: 'update',
  remove,
  removeKey: 'remove',
};
