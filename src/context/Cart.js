import React from 'react';

export const CartContext = React.createContext({
  cartInfo: undefined,
  refetchCartInfo: () => {},
  cartDetail: undefined,
  refetchCartDetail: () => {},
});
