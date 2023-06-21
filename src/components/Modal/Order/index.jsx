import React, { useEffect } from 'react';
import { Modal, Button, Alert, Table, Typography, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { formatVietnameseCurrency } from 'utils/common';
import moment from 'moment';
import { useContext } from 'react';
import { AuthContext } from 'context/Auth';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from 'utils/api/order';
import { useState } from 'react';
import DetailDrawer from './DetailDrawer';
import { DEFAULT_PAGINATION_DATA } from 'utils/constants';
import { toast } from 'react-toastify';

function ListOrderModal({ open, onClose }) {
  const { isAuthenticated } = useContext(AuthContext);

  const [openDetailDrawer, setOpenDetailDrawer] = useState(false);
  const [selectingItem, setSelectingItem] = useState(null);

  const { data: orders, isLoading: isFetchingOrders } = useQuery({
    queryKey: [orderApi.getMyOrderKey],
    queryFn: orderApi.getMyOrder,
    placeholderData: DEFAULT_PAGINATION_DATA,
  });

  const {
    data: orderDetail,
    isError: getDetailError,
    isFetching: isGettingDetail,
  } = useQuery({
    queryKey: [orderApi.getByIdKey, selectingItem?.id],
    queryFn: (context) => orderApi.getById(context, selectingItem?.id),
    enabled: Boolean(selectingItem?.id),
    placeholderData: {
      order: null,
      items: [],
    },
  });

  useEffect(() => {
    if (getDetailError) {
      toast.error('Lấy thông tin chi tiết đơn hàng thất bại');
      onCloseDetailDrawer();
    }
  }, [getDetailError]);

  const onOpenDetailDrawer = (order = null) => {
    setSelectingItem(order);
    setOpenDetailDrawer(true);
  };

  const onCloseDetailDrawer = () => {
    setOpenDetailDrawer(false);
    setSelectingItem(null);
  };

  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 1,
      render: (text, record, index) => <Typography.Text>{index + 1}</Typography.Text>,
    },
    {
      title: 'SĐT',
      dataIndex: 'contact',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'totalPrice',
      render: (price) => formatVietnameseCurrency(price),
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'isPaid',
      render: (isPaid) =>
        isPaid ? (
          <Tag color='success'>Đã thanh toán</Tag>
        ) : (
          <Tag color='warning'>Chưa thanh toán</Tag>
        ),
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
    },
    {
      title: 'Hành động',
      align: 'center',
      width: 1,
      render: (record) => (
        <Button
          loading={isGettingDetail && record.id === selectingItem.id}
          onClick={() => onOpenDetailDrawer(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Modal
      width='70%'
      title='Danh sách hoá đơn mua hàng'
      open={open}
      footer={[
        <Button key='close' onClick={onClose}>
          Đóng
        </Button>,
      ]}
      closable={false}
    >
      {orders.result.length > 0 ? (
        <Table loading={isFetchingOrders} dataSource={orders.result} columns={columns} />
      ) : (
        <Alert
          description='Bạn chưa có hoá đơn nào để hiển thị.'
          className='text-center'
          type='warning'
        />
      )}
      {openDetailDrawer && orderDetail.order && (
        <DetailDrawer open={openDetailDrawer} onCancel={onCloseDetailDrawer} item={orderDetail} />
      )}
    </Modal>
  );
}

export default ListOrderModal;
