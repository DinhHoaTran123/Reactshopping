import React, { useEffect, useState } from 'react';
import { routePaths } from 'routers';
import { Image, Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  DropboxOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import BrandFullOrangeTransparent from 'assets/images/brand-full-orange-transparent.png';
import BrandIconOrangeTransparent from 'assets/images/brand-icon-orange-transparent.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { makePath } from 'utils/common';

export default function DashboardSider({ isCollapsed }) {
  const items = [
    {
      label: 'Dashboard',
      key: [routePaths.admin.index, routePaths.admin.dashboard].join('/'),
      icon: <DashboardOutlined />,
    },
    {
      label: 'Người dùng',
      key: [routePaths.admin.index, routePaths.admin.user].join('/'),
      icon: <UserOutlined />,
    },
    {
      label: 'Sản phẩm',
      key: [routePaths.admin.index, routePaths.admin.product].join('/'),
      icon: <DropboxOutlined />,
    },
    {
      label: 'Đơn hàng',
      key: [routePaths.admin.index, routePaths.admin.order].join('/'),
      icon: <ShoppingCartOutlined />,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    const keys = location.pathname.slice(1);
    setOpenKeys(keys);
    setSelectedKeys(keys);
  }, [location.pathname]);

  const onClickMenuItem = ({ keyPath }) => {
    navigate(makePath([...keyPath].reverse()));
  };

  const onOpenSubMenu = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <>
      <Layout.Sider
        collapsible
        trigger={null}
        collapsed={isCollapsed}
        className='!fixed top-0 left-0 bottom-0 overflow-auto h-screen'
      >
        <div className='m-4 cursor-pointer' onClick={() => navigate('/')}>
          {isCollapsed ? (
            <Image preview={false} src={BrandIconOrangeTransparent} alt='Logo' height={32} />
          ) : (
            <Image preview={false} src={BrandFullOrangeTransparent} alt='Logo' height={32} />
          )}
        </div>
        <Menu
          theme='dark'
          mode='inline'
          items={items}
          onClick={onClickMenuItem}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={onOpenSubMenu}
        />
      </Layout.Sider>
    </>
  );
}
