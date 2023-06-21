import { DEFAULT_PAGINATION_DATA, HTTP_METHODS } from 'utils/constants';

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

const getById = (context, id) => {
  const { signal } = context;
  return axiosClient({
    url: `/v1/products/${id}`,
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data?.data);
};

const review = (data) =>
  axiosClient({
    url: `/v1/products/${data.productId}/reviews`,
    method: HTTP_METHODS.POST,
    data,
  });

const search = (context, params) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/search',
    method: HTTP_METHODS.GET,
    signal,
    params,
  }).then((resp) => resp.data?.data?.products || DEFAULT_PAGINATION_DATA);
};

const getCategories = (context) => {
  const { signal } = context;
  return axiosClient({
    url: '/v1/products/get-all-categories',
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data?.data || []);
};

const create = (data) =>
  axiosClient({
    url: `/v1/products`,
    method: HTTP_METHODS.POST,
    data,
  }).then((resp) => resp.data);

const update = ({ data, id }) =>
  axiosClient({
    url: `/v1/products/${id}`,
    method: HTTP_METHODS.PATCH,
    data,
  }).then((resp) => resp.data);

const remove = (id) =>
  axiosClient({
    url: `/v1/products/${id}`,
    method: HTTP_METHODS.DELETE,
  }).then((resp) => resp.data);

export const productApi = {
  get,
  getKey: 'getProduct',
  getById,
  getByIdKey: 'getProductById',
  search,
  searchKey: 'searchProduct',
  getCategories,
  getCategoriesKey: 'getCategories',
  review,
  reviewKey: 'reviewProduct',
  create,
  createKey: 'createProduct',
  update,
  updateKey: 'updateProduct',
  remove,
  removeKey: 'removeProduct',
};
