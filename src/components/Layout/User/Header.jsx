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
import { Layout, Menu, Avatar, Tooltip, Badge, Input, Image, Button, Alert } from 'antd';
import './Header.scss';
import { Link, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import UserModal from '../../Modal/UserInfo';
import BrandIconBlueTransparent from 'assets/images/brand-icon-blue-transparent.png';
import { routePaths } from 'routers';
import { AuthContext } from 'context/Auth';
import { useQuery } from '@tanstack/react-query';
import { productApi } from 'utils/api/product';
import ListOrderModal from '../../Modal/Order';
import { classNames, formatVietnameseCurrency } from 'utils/common';
import ProductMenu from 'components/Product/product-menu';

export default function Header() {
  const navigate = useNavigate();

  const [orderModal, setOrderModal] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [mouseEnterSearch, setMouseEnterSearch] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [mouseEnterCart, setMouseEnterCart] = useState(false);

  const { data: categories } = useQuery({
    queryKey: [productApi.getCategoriesKey],
    queryFn: productApi.getCategories,
    placeholderData: [],
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticate({
      isAuthenticated: false,
      userInfo: null,
    });
  };

  const handleSearch = (e) => {
    let newProducts = [];
    const text = e.target.value;
    // if (text && text.length >= 3) {
    // newProducts = products.filter((product) => product['slug'].includes(getSlug(text)));
    // }
    // dispatch(setSearchResults({ result: newProducts, text }));
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
        <Menu key='menu' id='header-menu' mode='horizontal' selectable={false}>
          <Menu.SubMenu
            className='padding-menu padding-menu__bg--green'
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

          <Menu.Item className='padding-menu' style={{ width: '20%' }}>
            <Input
              placeholder='Tìm kiếm...'
              suffix={<SearchOutlined />}
              defaultValue=''
              onChange={_.debounce(handleSearch, 500)}
              onFocus={() => setOpenSearch(true)}
              onBlur={() => setOpenSearch(false)}
            />
          </Menu.Item>
          {userInfo ? (
            <Menu.SubMenu
              className='float-right padding-menu'
              title={
                <>
                  <span style={{ marginRight: 4 }}>Xin chào</span>
                  <span className='username'>{userInfo['fullName']}</span>
                  <Avatar
                    style={{ marginLeft: 8 }}
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
            <Menu.SubMenu
              className='float-right padding-menu'
              icon={<UserOutlined className='icon--non-margin' />}
            >
              <Menu.Item key='Login' onClick={() => navigate(routePaths.login)}>
                Đăng nhập
              </Menu.Item>
              <Menu.Item key='Register' onClick={() => navigate(routePaths.register)}>
                Đăng ký
              </Menu.Item>
            </Menu.SubMenu>
          )}
          <Menu.Item
            // onMouseEnter={() => dispatch(setOpenCart(true))}
            // onMouseLeave={() => dispatch(setOpenCart(false))}
            className='float-right padding-menu'
            key='Cart'
          >
            <Link to='/cart'>
              <Tooltip title={`Giỏ hàng có 5 sản phẩm`}>
                <Badge count={5}>
                  <ShoppingTwoTone twoToneColor='#6da9f7' className='icon--non-margin' />
                </Badge>
              </Tooltip>
            </Link>
          </Menu.Item>
        </Menu>
        {orderModal && <ListOrderModal open={orderModal} onClose={() => setOrderModal(false)} />}
        <UserModal />
      </Layout.Header>
      <div
        className={classNames(
          'layout-fixed bg-white',
          !openSearch && !mouseEnterSearch && 'hidden'
        )}
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
        {/* {searchResults.length > 0 ? (
            searchResults.map((product) => <ProductMenu key={product['id']} product={product} />)
          ) : (
            <Alert
              type='warning'
              message={searchText ? 'Không có sản phẩm phù hợp' : 'Mời bạn nhập sản phẩm cần tìm'}
            />
          )} */}
      </div>
      <div
        style={{
          right: '12%',
          top: '8%',
          width: 600,
          maxHeight: 400,
          border: '1px solid #D9D9D9',
          overflowY: 'auto',
          padding: 25,
        }}
        className={classNames('layout-fixed bg-white', !openCart && !mouseEnterCart && 'hidden')}
        onMouseEnter={() => setMouseEnterCart(true)}
        onMouseLeave={() => setMouseEnterCart(false)}
      >
        <h2>Giỏ hàng</h2>
        {[].length > 0 ? (
          <>
            {[].map((product) => (
              <ProductMenu key={product['id']} product={product} cart />
            ))}
            <h3 style={{ float: 'right' }}>
              Tổng tiền: <b style={{ color: 'red' }}>{formatVietnameseCurrency(0)}</b>
            </h3>
            <Link to='/cart'>
              <Button block style={{ background: '#668866', color: 'white', fontWeight: 'bold' }}>
                THANH TOÁN
              </Button>
            </Link>
          </>
        ) : (
          <Alert type='info' message='Giỏ hàng chưa có sản phẩm' />
        )}
      </div>
    </>
  );
}
