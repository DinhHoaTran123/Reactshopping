// eslint-disable-next-line no-undef
export const API_PATH = process.env.REACT_APP_API_URL;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const formItemLayoutHorizontal = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export const formItemLayoutVertical = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

export const DEFAULT_PER_PAGE = 20;

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const DEFAULT_PAGINATION_DATA = {
  result: [],
  total: 0,
  totalPages: 0,
  currentPage: 0,
};
