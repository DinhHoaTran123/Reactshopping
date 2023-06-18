import jwtDecode from 'jwt-decode';

function classNames(...className) {
  return className.filter((name) => Boolean(name)).join(' ');
}

function makePath(keys) {
  return ['', ...keys].join('/');
}

const checkTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  const tokenInfo = jwtDecode(token);
  if (new Date() >= new Date(tokenInfo.exp * 1000)) {
    localStorage.removeItem('token');
    return false;
  }
  return true;
};

export const formatVietnameseCurrency = (money) => {
  return parseInt(money).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export { classNames, makePath, checkTokenValid };
