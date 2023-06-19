import { Alert, Button, Col, Divider, Input, PageHeader, Row, Table, Form, Radio } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlaceHolderImg from '../../assets/img/product-placeholder.png';
import { PlusOutlined, MinusOutlined, DeleteFilled, QuestionOutlined } from '@ant-design/icons';
import { changeProductQuantity, removeProduct, submitOrder } from '../../redux/slices/cart';
import { calcDiscountPrice, formatVietnameseCurrency } from '../../utils/common/common';
import { openModal as openLoginModal } from '../../redux/slices/login';
import produce from 'immer';
import { toast } from 'react-toastify';
import { getUserFromToken } from '../../utils/common/common';

function Cart(props) {
  const { products, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const user = getUserFromToken();

  const [infoForm] = Form.useForm();

  const initInfo = {
    name: user ? user['fullName'] : '',
    phone: user ? user['phone'] : '',
    address: user ? user['address'] : '',
    note: '',
    idUser: user ? user['id'] : null,
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const originalPrice = useMemo(() => {
    let price = 0;
    products.forEach((product) => {
      price += parseInt(product['price']) * parseInt(product['cartQuantity']);
    });
    return price;
  }, [products]);

  const discountPrice = useMemo(() => {
    let price = 0;
    products.forEach((product) => {
      price +=
        (product['isDiscount']
          ? calcDiscountPrice(product['price'], product['discountPercent'])
          : parseInt(product['price'])) * parseInt(product['cartQuantity']);
    });
    return price;
  }, [products]);

  useEffect(() => {
    infoForm.setFields([{ name: 'totalPrice', value: parseInt(discountPrice) }]);
  }, [discountPrice]);

  const plusQuantity = (product) => {
    const currentQuantity = parseInt(product['cartQuantity']);
    dispatch(changeProductQuantity(product, currentQuantity + 1));
  };

  const minusQuantity = (product) => {
    const currentQuantity = parseInt(product['cartQuantity']);
    if (currentQuantity > 1) {
      dispatch(changeProductQuantity(product, currentQuantity - 1));
    }
  };

  const removeProductCart = (product) => {
    dispatch(removeProduct(product));
  };

  const handleOpenLoginModal = (key) => {
    dispatch(openLoginModal(key));
  };

  const handlePhoneKeyPress = (e) => {
    if (isNaN(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmitCart = async () => {
    if (products.length > 0) {
      const values = await infoForm.validateFields();
      const orderData = {
        ...initInfo,
        ...values,
        totalPrice: discountPrice,
        products: products.map((p) => ({
          idProduct: p.id,
          quantity: p.cartQuantity,
          price:
            (p['isDiscount']
              ? calcDiscountPrice(p['price'], p['discountPercent'])
              : parseInt(p['price'])) * parseInt(p['cartQuantity']),
        })),
      };
      dispatch(submitOrder(orderData));
    } else {
      toast.error('Giỏ hàng trống.');
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      key: 'images',
      dataIndex: 'images',
      render: (images) => (
        <img
          alt='Product img'
          style={{ width: 100, height: 100 }}
          src={images.length > 0 ? images[0]['url'] : PlaceHolderImg}
        />
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (text, record, index) => (
        <>
          <h4>{record['name']}</h4>
          <p className='mt-15'>
            {Boolean(record['isDiscount']) && (
              <span>
                <span className='text-bold'>
                  {formatVietnameseCurrency(
                    calcDiscountPrice(record['price'], record['discountPercent'])
                  )}
                </span>
                {' - '}
              </span>
            )}
            <span className={`${record['isDiscount'] && 'original-price'} text-bold`}>
              {formatVietnameseCurrency(record['price'])}
            </span>
          </p>
          <p className='mt-10'>
            <label>Số lượng:</label>
            <Input
              prefix={<Button onClick={() => minusQuantity(record)} icon={<MinusOutlined />} />}
              suffix={<Button onClick={() => plusQuantity(record)} icon={<PlusOutlined />} />}
              min={1}
              className='text-center'
              style={{ width: 125 }}
              bordered={false}
              value={record['cartQuantity']}
            />
          </p>
          <p>
            <Button size='small' onClick={() => removeProductCart(record)} type='link'>
              Bỏ khỏi giỏ hàng
            </Button>
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col span={16} offset={4}>
          <Row>
            <Col span={24}>
              <PageHeader ghost={false} title='Giỏ hàng của bạn' />
              {!user && (
                <Alert
                  type='success'
                  message={
                    <span>
                      Đã có tài khoản?{' '}
                      <Button onClick={() => handleOpenLoginModal('login')} type='link'>
                        Đăng nhập
                      </Button>
                    </span>
                  }
                />
              )}
            </Col>
          </Row>
          <Row className='mt-25' gutter={25}>
            <Col span={14}>
              <Table rowKey='id' dataSource={products} columns={columns} />
            </Col>
            <Col span={10}>
              <Row style={{ borderBottom: '2px solid black' }}>
                <Col span={24}>
                  <h3>
                    <b>Thông tin giao hàng</b>
                  </h3>
                </Col>
              </Row>
              <Form form={infoForm} initialValues={initInfo}>
                <Row className='mt-10' gutter={10}>
                  <Col span={12}>
                    <Form.Item
                      name='name'
                      rules={[
                        {
                          required: true,
                          message: 'Xin vui lòng cho biết tên của bạn',
                        },
                      ]}
                      label='Họ tên'
                      labelCol={{ span: 24 }}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='phone'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng không để trống số điện thoại',
                        },
                      ]}
                      label='Số điện thoại'
                      labelCol={{ span: 24 }}
                    >
                      <Input onKeyPress={handlePhoneKeyPress} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col span={24}>
                    <Form.Item
                      name='address'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng không để trống địa chỉ giao hàng',
                        },
                      ]}
                      label='Địa chỉ'
                      labelCol={{ span: 24 }}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item name='note' label='Ghi chú' labelCol={{ span: 24 }}>
                      <Input.TextArea />
                    </Form.Item>
                  </Col>
                </Row>

                <Row className='mt-15' style={{ borderBottom: '2px solid black' }}>
                  <Col span={24}>
                    <h3>
                      <b>Thông tin thanh toán</b>
                    </h3>
                  </Col>
                </Row>
                <Row className='mt-25'>
                  <Col span={16}>
                    <h4>Tổng giá trị</h4>
                  </Col>
                  <Col span={8} className='text-red text-bold text-right'>
                    {formatVietnameseCurrency(originalPrice)}
                  </Col>
                </Row>
                <Row className='mt-10'>
                  <Col span={16}>
                    <h4>Khuyến mãi</h4>
                  </Col>
                  <Col span={8} className='text-red text-bold text-right'>
                    {formatVietnameseCurrency(originalPrice - discountPrice)}
                  </Col>
                </Row>
                <Row className='mt-10'>
                  <Col span={24}>
                    <h4>Phương thức thanh toán</h4>
                  </Col>
                  <Col span={24}>
                    <Radio defaultChecked={true}>Giao hàng COD (Nhận hàng trả tiền)</Radio>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={16}>
                    <h4>THÀNH TIỀN</h4>
                  </Col>
                  <Col span={8} className='text-red text-bold text-right'>
                    {formatVietnameseCurrency(parseInt(discountPrice))}
                  </Col>
                </Row>
                <Row className='mt-20'>
                  <Col span={24}>
                    <Button
                      loading={isLoading}
                      block
                      className='bg-green'
                      size='large'
                      onClick={handleSubmitCart}
                    >
                      XÁC NHẬN ĐƠN HÀNG
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Cart;
