import React, { useContext, useState } from 'react';
import {
  ShoppingTwoTone,
  DownOutlined,
  UserOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  InboxOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Input, Image, Alert } from 'antd';
import './Header.scss';
import { Link, useNavigate } from 'react-router-dom';
import UserModal from '../../Modal/UserInfo';
import BrandIconBlueTransparent from 'assets/images/brand-icon-blue-transparent.png';
import { routePaths } from 'routers';
import { AuthContext } from 'context/Auth';
import { useQuery } from '@tanstack/react-query';
import { productApi } from 'utils/api/product';
import ListOrderModal from '../../Modal/Order';
import { classNames } from 'utils/common';
import ProductMenu from 'components/Product/product-menu';
import useDebounceValue from 'hooks/debounce-value';
import { DEFAULT_PAGINATION_DATA } from 'utils/constants';

export default function Header() {
  const navigate = useNavigate();

  const [orderModal, setOrderModal] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [mouseEnterSearch, setMouseEnterSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchKeywordDebounce = useDebounceValue(searchKeyword, 500);

  const { data: searchProducts } = useQuery({
    queryKey: [productApi.searchKey, searchKeywordDebounce],
    queryFn: (context) => productApi.search(context, { keyword: searchKeywordDebounce }),
    placeholderData: DEFAULT_PAGINATION_DATA,
    enabled: Boolean(searchKeywordDebounce),
  });

  const { data: categories } = useQuery({
    queryKey: [productApi.getCategoriesKey],
    queryFn: productApi.getCategories,
    placeholderData: [],
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAuthenticate({
      isAuthenticated: false,
      userInfo: null,
    });
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  const { setAuthenticate, userInfo } = useContext(AuthContext);

  return (
    <>
      <Layout.Header className='header fixed'>
        <div className='logo'>
          <Link to='/'>
            <Image src={BrandIconBlueTransparent} alt='Logo smatyx' height={30} preview={false} />
          </Link>
        </div>
        <Menu className='w-full' mode='horizontal' selectable={false}>
          <Menu.SubMenu
            key='Category'
            title={
              <>
                <span>
                  Danh mục sản phẩm <DownOutlined />
                </span>
              </>
            }
            icon={<UnorderedListOutlined />}
          >
            {categories.map((category, idx) => (
              <Menu.Item key={idx} onClick={() => navigate('/product')}>
                <Link
                  to={{
                    pathname: `/product`,
                  }}
                >
                  {category}
                </Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
          <Menu.Item className='padding-menu' key='HomePage' icon={<HomeOutlined />}>
            <Link to='/'>Trang chủ</Link>
          </Menu.Item>
          <Menu.Item className='padding-menu' key='Product' icon={<InboxOutlined />}>
            <Link to='/product'>Sản phẩm</Link>
          </Menu.Item>
          <Menu.Item className='padding-menu'>
            <Input
              placeholder='Tìm kiếm...'
              suffix={<SearchOutlined />}
              value={searchKeyword}
              onChange={handleSearch}
              onFocus={() => setOpenSearch(true)}
              onBlur={() => setOpenSearch(false)}
              className='w-80'
            />
          </Menu.Item>
        </Menu>
        <Menu mode='horizontal' selectable={false}>
          <Menu.Item key='Cart'>
            <Link to='/cart'>
              <ShoppingTwoTone twoToneColor='#6da9f7' className='icon--non-margin' />
            </Link>
          </Menu.Item>
          {userInfo ? (
            <Menu.SubMenu
              title={
                <>
                  <Avatar
                    src={`https://ui-avatars.com/api/?background=random&name=${userInfo['fullName']}`}
                  />
                </>
              }
            >
              <Menu.Item key='Profile'>Tài khoản của tôi</Menu.Item>
              <Menu.Item key='Orders' onClick={() => setOrderModal(true)}>
                Danh sách đơn hàng
              </Menu.Item>
              <Menu.Item key='SignOut' onClick={handleLogout}>
                Đăng xuất
              </Menu.Item>
            </Menu.SubMenu>
          ) : (
            <Menu.SubMenu icon={<UserOutlined className='icon--non-margin' />}>
              <Menu.Item key='Login' onClick={() => navigate(routePaths.login)}>
                Đăng nhập
              </Menu.Item>
              <Menu.Item key='Register' onClick={() => navigate(routePaths.register)}>
                Đăng ký
              </Menu.Item>
            </Menu.SubMenu>
          )}
        </Menu>
        {orderModal && <ListOrderModal open={orderModal} onClose={() => setOrderModal(false)} />}
        <UserModal />
      </Layout.Header>
      {(openSearch || mouseEnterSearch) && (
        <div
          className={classNames('fixed bg-white')}
          style={{
            right: '24%',
            top: '8%',
            width: 600,
            maxHeight: 400,
            border: '1px solid #D9D9D9',
            overflowY: 'auto',
            padding: 25,
          }}
          onMouseEnter={() => setMouseEnterSearch(true)}
          onMouseLeave={() => setMouseEnterSearch(false)}
        >
          <h2>Kết quả tìm kiếm</h2>
          {searchProducts.result.length > 0 ? (
            searchProducts.result.map((product) => (
              <ProductMenu key={product['id']} product={product} />
            ))
          ) : (
            <Alert
              type='warning'
              message={
                searchKeyword ? 'Không có sản phẩm phù hợp' : 'Mời bạn nhập sản phẩm cần tìm'
              }
            />
          )}
        </div>
      )}
    </>
  );
}
