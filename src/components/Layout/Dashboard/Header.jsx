import React, { useContext } from 'react';
import { Avatar, Button, Dropdown, Layout, Space, Switch, theme, Typography } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from 'context/Auth';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({ siderCollapsed, setSiderCollapsed }) {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const KEY_ACTIONS = {
    SIGN_OUT: 'sign-out',
  };

  const { setAuthenticate, userInfo } = useContext(AuthContext);

  const onSignOut = () => {
    localStorage.removeItem('token');
    setAuthenticate({
      isAuthenticated: false,
      userInfo: null,
    });
    navigate('/login');
  };

  const onSelectAction = ({ key }) => {
    switch (key) {
      case KEY_ACTIONS.SIGN_OUT:
        onSignOut();
        break;
      default:
        break;
    }
  };

  const actions = [
    {
      key: KEY_ACTIONS.SIGN_OUT,
      label: 'Đăng xuất',
    },
  ];

  return (
    <>
      <Layout.Header className='!sticky top-0 pl-0 z-10'>
        <Space align='center' className='justify-between w-full'>
          <Space size='middle' align='center'>
            <Button
              size='large'
              type='text'
              icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setSiderCollapsed(!siderCollapsed)}
            />
          </Space>
          <Dropdown menu={{ items: actions, onClick: onSelectAction }}>
            <Space className='cursor-pointer' align='center'>
              <Typography.Text>
                Hello, <span className='font-semibold'>{userInfo?.name || 'User'}</span>
              </Typography.Text>
              <Avatar style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
            </Space>
          </Dropdown>
        </Space>
      </Layout.Header>
    </>
  );
}
