import { useQuery } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { AuthContext } from 'context/Auth';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { routePaths } from 'routers';
import { DashboardLayout, UserLayout } from './components';
import viVN from 'antd/locale/vi_VN';
import { userApi } from 'utils/api/user';
import Login from 'features/Login';
import Register from 'features/Register';
// admin
import AdminDashboard from 'features/Admin/Dashboard';
import AdminUser from 'features/Admin/User';
import AdminProduct from 'features/Admin/Product';
import AdminOrder from 'features/Admin/Order';
// user
import Home from 'features/Home';
import { checkTokenValid } from 'utils/common';
import Product from 'features/Product';
import ProductDetail from 'features/Product/detail';
import Cart from 'features/Cart';

function PageContainer({ Component, title, requireAuth = false, roles = [], ...props }) {
  useEffect(() => {
    document.title = `Smatyx - ${title}`;
  }, [title]);

  const { isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth) {
      if (!isAuthenticated) {
        const isTokenValid = checkTokenValid();
        if (!isTokenValid) {
          navigate('/login');
        }
      }
    }
  }, [navigate, isAuthenticated, requireAuth]);
  if (!requireAuth || (requireAuth && isAuthenticated)) {
    return <Component {...props} />;
  }
  return null;
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
    queryKey: [userApi.myProfileKey, authenticate.isAuthenticated],
    queryFn: userApi.myProfile,
    enabled: Boolean(authenticate.isAuthenticated),
  });

  useEffect(() => {
    if (profile) {
      setAuthenticate({ isAuthenticated: true, userInfo: profile });
    }
  }, [profile]);

  return (
    <ConfigProvider locale={viVN}>
      <AuthContext.Provider value={{ ...authenticate, setAuthenticate }}>
        <BrowserRouter>
          <Routes>
            <Route path='/admin' element={<DashboardLayout />}>
              <Route
                index
                element={<PageContainer Component={AdminDashboard} title='Dashboard' />}
              />
              <Route
                path={routePaths.admin.user}
                element={<PageContainer Component={AdminUser} title='Admin - Người dùng' />}
              />
              <Route
                path={routePaths.admin.product}
                element={<PageContainer Component={AdminProduct} title='Admin - Sản phẩm' />}
              />
              <Route
                path={routePaths.admin.order}
                element={<PageContainer Component={AdminOrder} title='Admin - Đơn hàng' />}
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
              <Route
                path={routePaths.cart}
                element={<PageContainer requireAuth={true} Component={Cart} title='Giỏ hàng' />}
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
