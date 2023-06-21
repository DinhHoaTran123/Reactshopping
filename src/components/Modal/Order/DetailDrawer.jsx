import React from 'react';
import { Descriptions, Divider, Drawer, Image, Tag } from 'antd';
import { formatVietnameseCurrency } from 'utils/common';
import moment from 'moment';
import ProductPlaceholder from 'assets/images/product-placeholder-2.png';

export default function DetailDrawer({ open, onCancel, item }) {
  const { order, items } = item;
  const orderFields = [
    {
      key: 'contact',
      label: 'SĐT',
    },
    {
      key: 'address',
      label: 'Địa chỉ',
    },
    {
      key: 'totalPrice',
      label: 'Tổng tiền',
      render: (price) => formatVietnameseCurrency(price),
    },
    {
      key: 'paymentMethod',
      label: 'Phương thức thanh toán',
    },
    {
      key: 'isPaid',
      label: 'Trạng thái thanh toán',
      render: (isPaid) =>
        isPaid ? (
          <Tag color='success'>Đã thanh toán</Tag>
        ) : (
          <Tag color='warning'>Chưa thanh toán</Tag>
        ),
    },
    {
      key: 'createdAt',
      label: 'Thời gian đặt hàng',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      key: 'status',
      label: 'Trạng thái đơn hàng',
    },
  ];
  return (
    <Drawer open={open} title='Đơn hàng' onClose={onCancel} placement='right' size='large'>
      <Descriptions title='Chi tiết đơn hàng' size='small'>
        {orderFields.map((field) => (
          <Descriptions.Item key={field.key} label={field.label} span={24}>
            {field.render ? field.render(order[field.key]) : order[field.key]}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Divider orientation='left'>Danh sách mặt hàng</Divider>
      {items.map((item) => (
        <div
          key={item.id}
          className='flex gap-x-4 mb-4 last:mb-0 border-0 border-b border-solid border-gray-200 py-4'
        >
          <div>
            <Image
              src={item.itemInfo?.images?.[0]?.url || ProductPlaceholder}
              alt='Product image'
              width={120}
              height={160}
            />
          </div>
          <div>
            <Descriptions size='small'>
              <Descriptions.Item label='Tên sản phẩm' span={24}>
                {item.itemInfo.name}
              </Descriptions.Item>
              <Descriptions.Item label='Đơn giá' span={24}>
                {formatVietnameseCurrency(item.price)}
              </Descriptions.Item>
              <Descriptions.Item label='Số lượng' span={24}>
                {item.quantity}
              </Descriptions.Item>
              <Descriptions.Item label='Thành tiền' span={24}>
                {formatVietnameseCurrency(item.total)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      ))}
    </Drawer>
  );
}
