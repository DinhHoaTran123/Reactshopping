import { useQuery } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { AuthContext } from 'context/Auth';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routePaths } from 'routers';
import { DashboardLayout, UserLayout } from './components';
import viVN from 'antd/locale/vi_VN';
import { userApi } from 'utils/api/user';
import Login from 'features/Login';
import Register from 'features/Register';
// admin
import Dashboard from 'features/Dashboard';
import User from 'features/User';
// user
import Home from 'features/Home';
import { checkTokenValid } from 'utils/common';
import Product from 'features/Product';
import ProductDetail from 'features/Product/detail';

function PageContainer({ Component, title, roles = [], ...props }) {
  useEffect(() => {
    document.title = `Smatyx - ${title}`;
  }, [title]);

  return <Component {...props} />;
}

function App() {
  const [authenticate, setAuthenticate] = useState({
    isAuthenticated: false,
    userInfo: null,
  });

  useEffect(() => {
    const isTokenValid = checkTokenValid();
    setAuthenticate({ isAuthenticated: isTokenValid });
  }, []);

  const { data: profile } = useQuery({
    queryFn: userApi.myProfile,
    queryKey: [userApi.myProfileKey],
    enabled: authenticate.isAuthenticated,
  });

  useEffect(() => {
    if (profile) {
      setAuthenticate({
        isAuthenticated: true,
        userInfo: profile,
      });
    }
  }, [profile]);

  return (
    <ConfigProvider locale={viVN}>
      <AuthContext.Provider value={{ ...authenticate, setAuthenticate }}>
        <BrowserRouter>
          <Routes>
            <Route path='/admin' element={<DashboardLayout />}>
              <Route index element={<PageContainer Component={Dashboard} title='Dashboard' />} />
              <Route
                path={routePaths.admin.user}
                element={<PageContainer Component={User} title='Admin - Người dùng' />}
              />
              <Route
                path={routePaths.admin.product}
                element={<PageContainer Component={User} title='Admin - Sản phẩm' />}
              />
            </Route>
            <Route path='/' element={<UserLayout />}>
              <Route index element={<PageContainer Component={Home} title='Trang chủ' />} />
              <Route
                path={routePaths.product}
                element={<PageContainer Component={Product} title='Sản phẩm' />}
              />
              <Route
                path={routePaths.productDetail}
                element={<PageContainer Component={ProductDetail} title='Chi tiết sản phẩm' />}
              />
            </Route>
            <Route
              path={routePaths.login}
              element={<PageContainer requireAuth={false} Component={Login} title='Đăng nhập' />}
            />
            <Route
              path={routePaths.register}
              element={<PageContainer requireAuth={false} Component={Register} title='Đăng ký' />}
            />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ConfigProvider>
  );
}

export default App;
