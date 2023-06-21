import { Layout } from 'antd';
import React, { useContext } from 'react';
import UserHeader from './Header';
import UserFooter from './Footer';
import './Layout.scss';
import { Outlet } from 'react-router-dom';
import { CartContext } from 'context/Cart';
import { AuthContext } from 'context/Auth';
import { useQuery } from '@tanstack/react-query';
import { cartApi } from 'utils/api/cart';

function UserLayout() {
  const { userInfo, isAuthenticated } = useContext(AuthContext);

  const { data: cartInfo, refetch: refetchCartInfo } = useQuery({
    queryKey: [cartApi.myCartKey],
    queryFn: cartApi.myCart,
    enabled: Boolean(userInfo && isAuthenticated),
  });

  const { data: cartDetail, refetch: refetchCartDetail } = useQuery({
    queryKey: [cartApi.getByIdKey, cartInfo?.id],
    queryFn: (context) => cartApi.getById(context, cartInfo?.id),
    enabled: Boolean(cartInfo),
    placeholderData: {
      cart: null,
      items: [],
    },
  });

  return (
    <CartContext.Provider value={{ cartInfo, refetchCartInfo, cartDetail, refetchCartDetail }}>
      <Layout className='wrapper'>
        <Layout>
          <UserHeader />
          <Layout.Content className='wrapper-content bg-white'>
            <div id='main-container' className='main-content'>
              <Outlet />
            </div>
          </Layout.Content>
          <UserFooter />
        </Layout>
      </Layout>
    </CartContext.Provider>
  );
}

export default UserLayout;
