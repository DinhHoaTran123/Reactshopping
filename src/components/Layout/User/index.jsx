import { Layout, Button, Alert } from 'antd';
import React, { useMemo } from 'react';
import UserHeader from './Header';
import UserFooter from './Footer';
import './Layout.scss';
import { FacebookOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ProductMenu from '../../Product/product-menu';
import { Link, Outlet } from 'react-router-dom';
import { formatVietnameseCurrency } from 'utils/common';

function UserLayout({ history }) {
  const products = [];
  const discountPrice = useMemo(() => {
    let price = 0;
    products.forEach((product) => {
      price += parseInt(product['price']) * parseInt(product['cartQuantity']);
    });
    return price;
  }, [products]);

  return (
    <Layout className='wrapper'>
      <Layout>
        <UserHeader history={history} />
        <Layout.Content className='wrapper-content bg-white'>
          <div id='main-container' className='main-content'>
            <Outlet />
          </div>
        </Layout.Content>
        <UserFooter />
      </Layout>
    </Layout>
  );
}

export default UserLayout;
