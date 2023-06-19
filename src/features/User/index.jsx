import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Row, Space, Table, Typography } from 'antd';
import Actions from './components/Actions';
import DetailModal from './components/DetailModal';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { userApi } from 'utils/api/user';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGINATION_DATA, DEFAULT_PER_PAGE } from 'utils/constants';

export default function Process() {
  const [searchParams, setSearchParams] = useSearchParams({
    size: DEFAULT_PER_PAGE,
    page: 1,
  });
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectingItem, setSelectingItem] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const {
    data: paginationData,
    isLoading: isFetchingData,
    refetch: getData,
  } = useQuery({
    queryKey: [userApi.getKey, searchParams],
    queryFn: (context) => userApi.get(context, Object.fromEntries(searchParams)),
    retry: false,
    placeholderData: DEFAULT_PAGINATION_DATA,
  });

  useEffect(() => {
    getData();
  }, [searchParams]);

  const { mutate: create, isLoading: isCreating } = useMutation({
    mutationKey: [userApi.createKey],
    mutationFn: userApi.create,
    onSuccess: (resp) => {
      if (resp.data.data) {
        onCloseDetailModal();
        toast.success('Tạo user mới thành công');
        getData();
      }
    },
    onError: (err) => {
      toast.error('Tạo user mới thất bại');
      console.error(err);
    },
  });

  const { mutate: update, isLoading: isUpdating } = useMutation({
    mutationKey: [userApi.updateKey],
    mutationFn: userApi.update,
    onSuccess: (resp) => {
      if (resp.data.data) {
        onCloseDetailModal();
        toast.success('Cập nhật user thành công');
        getData();
      }
    },
    onError: (err) => {
      toast.error('Cập nhật user thất bại');
      console.error(err);
    },
  });

  const { mutate: remove } = useMutation({
    mutationKey: [userApi.removeKey],
    mutationFn: userApi.remove,
    onSuccess: (resp) => {
      toast.success('Xóa user thành công');
      getData();
    },
    onError: (err) => {
      toast.error('Xóa user thất bại');
      console.error(err);
    },
  });

  const {
    data: jobHiringChannelDetail,
    isError: getDetailError,
    isFetching: isGettingDetail,
  } = useQuery({
    queryKey: [userApi.getByIdKey, selectingItem?.id],
    queryFn: (context) => userApi.getById(context, selectingItem?.id),
    enabled: Boolean(selectingItem?.id),
    retry: false,
  });

  useEffect(() => {
    if (getDetailError) {
      toast.error('Lấy thông tin chi tiết user thất bại');
      onCloseDetailModal();
    }
  }, [getDetailError]);

  const onOpenDetailModal = (account = null) => {
    setSelectingItem(account);
    setOpenDetailModal(true);
  };

  const onSubmit = (item) => {
    if (item.id) {
      update(item);
    } else {
      create(item);
    }
  };

  const onCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectingItem(null);
  };

  const onDeleteItem = (item) => {
    Modal.confirm({
      title: 'Xóa user',
      content: 'Bạn có chắc chắn muốn xóa user này?',
      onOk: () => {
        remove(item.id);
      },
    });
  };

  const onChangePage = (page, pageSize) => {
    setSearchParams((prev) => {
      prev.set('size', pageSize);
      prev.set('page', page);
      return prev;
    });
  };

  const onSearchByCode = () => {
    setSearchParams((prev) => {
      prev.set('code', searchValue);
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
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Hành động',
      align: 'center',
      width: 1,
      render: (record) => (
        <Actions
          record={record}
          onEdit={onOpenDetailModal}
          onDelete={onDeleteItem}
          loading={isGettingDetail && record.id === selectingItem?.id}
        />
      ),
    },
  ];

  return (
    <>
      <Row justify='space-between' align='middle'>
        <Typography.Title level={2}>User</Typography.Title>
        <Space size='middle'>
          <Input.Search
            placeholder='Tìm kiếm user theo email'
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={onSearchByCode}
            allowClear
            enterButton
            value={searchValue}
          />
          <Button type='primary' icon={<PlusOutlined />} onClick={() => onOpenDetailModal()}>
            Tạo mới
          </Button>
        </Space>
      </Row>
      <Divider />
      <Table
        bordered
        columns={columns}
        dataSource={paginationData.result}
        rowKey='id'
        loading={isFetchingData}
        pagination={{
          showSizeChanger: true,
          pageSize: searchParams.get('size') || DEFAULT_PER_PAGE,
          pageSizeOptions: [10, 20, 50, 100],
          total: paginationData?.total || 0,
          onChange: onChangePage,
        }}
      />
      {openDetailModal && (jobHiringChannelDetail || !selectingItem) && (
        <DetailModal
          open={openDetailModal}
          isProcessing={isCreating || isUpdating}
          onSubmit={onSubmit}
          onCancel={onCloseDetailModal}
          item={jobHiringChannelDetail}
        />
      )}
    </>
  );
}
