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
        <Button
          style={{ right: 25, bottom: 25 }}
          className='layout-fixed bg-facebook'
          shape='circle'
          size='large'
          icon={<FacebookOutlined />}
        />
        <Button
          style={{ right: 25, bottom: 25 }}
          className='layout-fixed bg-orange-gradient'
          shape='circle'
          size='large'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUpOutlined />
        </Button>
        <Button
          style={{ right: 25, bottom: '70%' }}
          className='layout-fixed bg-facebook'
          shape='circle'
          size='large'
          icon={<FacebookOutlined />}
        />
      </Layout>
    </Layout>
  );
}

export default UserLayout;
