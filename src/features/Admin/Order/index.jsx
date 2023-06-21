import React, { useEffect, useState } from 'react';
import { Divider, Row, Table, Tag, Typography } from 'antd';
import Actions from './components/Actions';
import DetailModal from './components/DetailModal';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGINATION_DATA, DEFAULT_PER_PAGE } from 'utils/constants';
import { orderApi } from 'utils/api/order';
import { formatVietnameseCurrency } from 'utils/common';
import moment from 'moment';
import DetailDrawer from './components/DetailDrawer';

export default function Product() {
  const [searchParams, setSearchParams] = useSearchParams({
    size: DEFAULT_PER_PAGE,
    page: 1,
  });
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDetailDrawer, setOpenDetailDrawer] = useState(false);
  const [selectingItem, setSelectingItem] = useState(null);

  const {
    data: paginationData,
    isLoading: isFetchingData,
    refetch: getData,
  } = useQuery({
    queryKey: [orderApi.getKey, searchParams],
    queryFn: (context) => orderApi.get(context, Object.fromEntries(searchParams)),
    retry: false,
    placeholderData: {
      orders: DEFAULT_PAGINATION_DATA,
    },
  });

  useEffect(() => {
    getData();
  }, [searchParams]);

  const { mutate: update, isLoading: isUpdating } = useMutation({
    mutationKey: [orderApi.updateKey],
    mutationFn: orderApi.update,
    onSuccess: (data) => {
      if (data.data) {
        onCloseDetailModal();
        toast.success('Cập nhật đơn hàng thành công');
        getData();
      }
    },
    onError: (err) => {
      toast.error('Cập nhật đơn hàng thất bại');
      console.error(err);
    },
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
      onCloseDetailModal();
      onCloseDetailDrawer();
    }
  }, [getDetailError]);

  const onOpenDetailModal = (order = null) => {
    setSelectingItem(order);
    setOpenDetailModal(true);
  };

  const onOpenDetailDrawer = (order = null) => {
    setSelectingItem(order);
    setOpenDetailDrawer(true);
  };

  const onSubmit = (item) => {
    if (item.id) {
      const data = { ...item };
      delete data.id;
      update({ data, id: item.id });
    }
  };

  const onCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectingItem(null);
  };

  const onCloseDetailDrawer = () => {
    setOpenDetailDrawer(false);
    setSelectingItem(null);
  };

  const onChangePage = (page, pageSize) => {
    setSearchParams((prev) => {
      prev.set('size', pageSize);
      prev.set('page', page);
      return prev;
    });
  };

  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 1,
      render: (text, record, index) => (
        <Typography.Text>
          {index + 1 + (parseInt(searchParams.get('page') || 0) - 1) * searchParams.get('size')}
        </Typography.Text>
      ),
    },
    {
      title: 'ID Khách hàng',
      dataIndex: 'userId',
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
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
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
        <Actions
          record={record}
          onView={onOpenDetailDrawer}
          onEdit={onOpenDetailModal}
          loading={isGettingDetail && record.id === selectingItem?.id}
        />
      ),
    },
  ];

  return (
    <>
      <Row justify='space-between' align='middle'>
        <Typography.Title level={2}>Đơn hàng</Typography.Title>
      </Row>
      <Divider />
      <Table
        bordered
        columns={columns}
        dataSource={paginationData.orders.result || []}
        rowKey='id'
        loading={isFetchingData}
        pagination={{
          showSizeChanger: true,
          pageSize: searchParams.get('size') || DEFAULT_PER_PAGE,
          pageSizeOptions: [10, 20, 50, 100],
          total: paginationData.orders.total || 0,
          onChange: onChangePage,
        }}
      />
      {openDetailModal && orderDetail.order && (
        <DetailModal
          open={openDetailModal}
          isProcessing={isUpdating}
          onSubmit={onSubmit}
          onCancel={onCloseDetailModal}
          item={orderDetail.order}
        />
      )}
      {openDetailDrawer && orderDetail.order && (
        <DetailDrawer open={openDetailDrawer} onCancel={onCloseDetailDrawer} item={orderDetail} />
      )}
    </>
  );
}
