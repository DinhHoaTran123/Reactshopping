import { HTTP_METHODS } from 'utils/constants';

const { default: axiosClient } = require('./axios-client');

const myCart = (context) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/cart/my-carts',
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data?.data?.carts?.result?.[0] || null);
};

const getById = (context, id) => {
  const { signal } = context;
  return axiosClient({
    url: `/v1/cart/${id}`,
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data?.data);
};

const create = (data) =>
  axiosClient({
    url: '/v1/cart',
    method: HTTP_METHODS.POST,
    data,
  }).then((resp) => resp.data);

const createItem = (data) =>
  axiosClient({
    url: '/v1/cart/create-item',
    method: HTTP_METHODS.POST,
    data,
  }).then((resp) => resp.data);

const update = ({ data, id }) =>
  axiosClient({
    url: `/v1/cart/${id}`,
    method: HTTP_METHODS.PATCH,
    data,
  }).then((resp) => resp.data);

const updateItem = ({ quantity, id, total }) =>
  axiosClient({
    url: `/v1/cart/manage-item/${id}`,
    method: HTTP_METHODS.PATCH,
    data: {
      quantity,
      total,
    },
  }).then((resp) => resp.data);

const remove = (id) =>
  axiosClient({
    url: `/v1/cart/${id}`,
    method: HTTP_METHODS.DELETE,
  }).then((resp) => resp.data);

const removeItem = (id) =>
  axiosClient({
    url: `/v1/cart/manage-item/${id}`,
    method: HTTP_METHODS.DELETE,
  }).then((resp) => resp.data);

export const cartApi = {
  myCart,
  myCartKey: 'myCart',
  getById,
  getByIdKey: 'getCartById',
  create,
  createKey: 'createCart',
  createItem,
  createItemKey: 'createCartItem',
  update,
  updateKey: 'updateCart',
  updateItem,
  updateItemKey: 'updateCartItem',
  remove,
  removeKey: 'removeCart',
  removeItem,
  removeItemKey: 'removeCartItem',
};
