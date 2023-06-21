import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Table,
  Form,
  Radio,
  Typography,
  InputNumber,
} from 'antd';
import React, { useContext } from 'react';
import PlaceHolderImg from 'assets/images/product-placeholder.png';
import { formatVietnameseCurrency } from 'utils/common';
import { toast } from 'react-toastify';
import { CartContext } from 'context/Cart';
import useCartManagement from 'hooks/cart-management';
import { debounce } from 'lodash';
import { useMutation } from '@tanstack/react-query';
import { orderApi } from 'utils/api/order';
import { AuthContext } from 'context/Auth';

function Cart() {
  const [infoForm] = Form.useForm();

  const { cartDetail } = useContext(CartContext);
  const { onRemoveItem, onUpdateItem, onRemoveCart } = useCartManagement();
  const { userInfo } = useContext(AuthContext);

  const initInfo = {
    contact: userInfo.contact || '',
    address: '',
    paymentMethod: '',
  };

  const onChangeQuantity = (id, quantity) => {
    if (quantity) {
      onUpdateItem(id, quantity);
    }
  };

  const removeProductCart = (id) => {
    onRemoveItem(id);
  };

  const handlePhoneKeyPress = (e) => {
    if (isNaN(e.key)) {
      e.preventDefault();
    }
  };

  const { mutate: createOrder, isLoading: isCreatingOrder } = useMutation({
    mutationKey: [orderApi.createKey],
    mutationFn: orderApi.create,
    onSuccess: () => {
      toast.success('Tạo đơn hàng mới thành công');
      onRemoveCart(cartDetail.cart.id);
    },
    onError: () => {
      toast.error('Tạo đơn hàng thất bại, vui lòng thử lại sau');
    },
  });

  const handleSubmitCart = async () => {
    if (cartDetail.items.length > 0) {
      const values = await infoForm.validateFields();
      const orderData = {
        order: {
          ...initInfo,
          ...values,
          totalPrice: cartDetail.cart?.totalPrice,
          userId: cartDetail.cart?.userId,
        },
        itemArr: cartDetail.items.map((item) => ({
          productId: item.itemCartInfo.id,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
      };
      createOrder(orderData);
    } else {
      toast.error('Giỏ hàng trống.');
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      width: 1,
      dataIndex: ['itemCartInfo', 'images'],
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
      render: (text, record) => (
        <>
          <h4>{record.itemCartInfo.name}</h4>
          <div className='flex gap-x-4 items-center'>
            <label>Số lượng:</label>
            <InputNumber
              value={record.quantity}
              min={1}
              onChange={debounce((quantity) => onChangeQuantity(record.id, quantity), 2000)}
              controls={false}
            />
            <span>
              x <span className='font-semibold'>{formatVietnameseCurrency(record.price)}</span>
            </span>
            <span>
              {'='} {formatVietnameseCurrency(record.total)}
            </span>
          </div>
          <p>
            <Button size='small' onClick={() => removeProductCart(record.id)} type='link'>
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
              <Typography.Title>Giỏ hàng của bạn</Typography.Title>
            </Col>
          </Row>
          <Row className='mt-25' gutter={25}>
            <Col span={14}>
              <Table rowKey='id' dataSource={cartDetail.items} columns={columns} />
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
                  <Col span={24}>
                    <Form.Item
                      name='contact'
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
                <Row>
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
                      <Input.TextArea />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className='mt-15'>
                  <Col span={24}>
                    <h3>
                      <b>Thông tin thanh toán</b>
                    </h3>
                  </Col>
                </Row>
                <Divider className='border-2 border-black' />
                <Row>
                  <Col span={16}>
                    <h4>Tổng giá trị</h4>
                  </Col>
                  <Col span={8} className='text-red text-bold text-right'>
                    <p>{formatVietnameseCurrency(cartDetail.cart?.totalPrice || 0)}</p>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={24}>
                    <h4>Phương thức thanh toán</h4>
                  </Col>
                  <Col span={24}>
                    <Form.Item name='paymentMethod' rules={[{}]}>
                      <Radio.Group>
                        <div>
                          <Radio value='COD'>Giao hàng COD (Nhận hàng trả tiền)</Radio>
                        </div>
                        <div>
                          <Radio value='Online'>Paypal</Radio>
                        </div>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Row className='mt-20'>
                  <Col span={24}>
                    <Button
                      // loading={isLoading}
                      block
                      className='bg-green'
                      size='large'
                      onClick={handleSubmitCart}
                      loading={isCreatingOrder}
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
