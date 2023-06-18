import React from 'react';

export const AuthContext = React.createContext({
  isAuthenticated: false,
  userInfo: null,
  setAuthenticate: () => {},
});
