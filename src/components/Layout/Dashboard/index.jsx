import React, { useContext, useEffect, useState } from 'react';
import { Layout } from 'antd';
import DashboardHeader from './Header';
import DashboardSider from './Sider';
import DashboardFooter from './Footer';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'context/Auth';
import { checkTokenValid } from 'utils/common';

export default function DashboardLayout() {
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      const isTokenValid = checkTokenValid();
      if (!isTokenValid) {
        navigate('/login');
      }
    }
  }, [location, navigate, isAuthenticated]);

  return (
    <Layout
      hasSider
      style={{
        minHeight: '100vh',
      }}
    >
      <DashboardSider isCollapsed={siderCollapsed} />
      <Layout style={{ marginLeft: 200 }}>
        <DashboardHeader siderCollapsed={siderCollapsed} setSiderCollapsed={setSiderCollapsed} />
        <Layout.Content
          style={{
            margin: 16,
          }}
        >
          <Outlet />
        </Layout.Content>
        <DashboardFooter />
      </Layout>
    </Layout>
  );
}
