import React from 'react';
import { Modal, Button, Alert, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { formatVietnameseCurrency } from 'utils/common';
import moment from 'moment';
import { useContext } from 'react';
import { AuthContext } from 'context/Auth';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from 'utils/api/order';
import { useState } from 'react';
import DetailOrderModal from './Detail';

function ListOrderModal({ open, onClose }) {
  const { isAuthenticated } = useContext(AuthContext);

  const [selectedId, setSelectedId] = useState(null);
  const [openDetailOrderModal, setOpenDetailOrderModal] = useState(false);

  const { data: orders, isLoading: isFetchingOrders } = useQuery({
    queryKey: [orderApi.getKey],
    queryFn: orderApi,
  });

  const { data: detailOrder, isLoading: isFetchingDetailOrder } = useQuery({
    queryKey: [orderApi.getByIdKey, selectedId],
    queryFn: (context) => orderApi.getById(context, selectedId),
    enabled: isAuthenticated && selectedId,
  });

  const onCloseDetailOrderModal = () => {
    setOpenDetailOrderModal(false);
  };

  const columns = [
    {
      title: 'Hoá đơn',
      key: 'receipt',
      render: (text, record) => `OR_${record['id']}`,
    },
    {
      title: 'Khách hàng',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
    },
    {
      title: 'Ghi chú',
      key: 'note',
      dataIndex: 'note',
    },
    {
      title: 'Ngày đặt hàng',
      key: 'createdDate',
      render: (text, record) => moment(record['createdDate']).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      key: 'statusDescription',
      render: (text, record) => (
        <span style={{ color: record['statusColor'], fontWeight: 'bold' }}>
          {record['statusDescription']}
        </span>
      ),
    },
    {
      title: 'Tổng tiền',
      key: 'totalPrice',
      render: (text, record) => (
        <span style={{ fontWeight: 'bold', color: 'red' }}>
          {formatVietnameseCurrency(parseInt(record['totalPrice']))}
        </span>
      ),
    },
    {
      title: '#',
      key: 'actions',
      render: (text, record) => (
        <Button
          type='primary'
          onClick={() => setSelectedId(record.id)}
          icon={<EyeOutlined />}
          loading={isFetchingDetailOrder && record.id === selectedId}
        />
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
      {orders.length > 0 ? (
        <Table loading={isFetchingOrders} rowKey='id' dataSource={orders} columns={columns} />
      ) : (
        <Alert
          description='Bạn chưa có hoá đơn nào để hiển thị.'
          className='text-center'
          type='warning'
        />
      )}
      {openDetailOrderModal && detailOrder && (
        <DetailOrderModal item={detailOrder} onClose={onCloseDetailOrderModal} />
      )}
    </Modal>
  );
}

export default ListOrderModal;
