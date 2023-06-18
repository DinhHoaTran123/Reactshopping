import { HTTP_METHODS } from 'utils/constants';

const { default: axiosClient } = require('./axios-client');

const get = (context, params) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/products',
    method: HTTP_METHODS.GET,
    signal,
    params,
  }).then((resp) => resp.data?.data || []);
};

const getCategories = (context) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/products/get-all-categories',
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data?.data || []);
};

export const productApi = {
  get,
  getKey: 'get',
  getCategories,
  getCategoriesKey: 'getCategories',
};
