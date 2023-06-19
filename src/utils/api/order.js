import { HTTP_METHODS } from 'utils/constants';

const { default: axiosClient } = require('./axios-client');

const get = (context, params) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/orders',
    method: HTTP_METHODS.GET,
    signal,
    params,
  }).then((resp) => resp.data);
};

const getMyOrder = (context) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/orders/my-orders',
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data?.data?.orders);
};

const getById = (context, id) => {
  const { signal } = context;
  return axiosClient({
    url: `/v1/orders/${id}`,
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data);
};

export const orderApi = {
  get,
  getKey: 'get',
  getMyOrder,
  getMyOrderKey: 'getMyOrder',
  getById,
  getByIdKey: 'getById',
};
