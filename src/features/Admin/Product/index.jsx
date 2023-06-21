import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Image, Input, Modal, Row, Space, Table, Typography } from 'antd';
import Actions from './components/Actions';
import DetailModal from './components/DetailModal';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import ProductPlaceholder from 'assets/images/product-placeholder-2.png';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGINATION_DATA, DEFAULT_PER_PAGE } from 'utils/constants';
import { productApi } from 'utils/api/product';
import { formatVietnameseCurrency } from 'utils/common';

export default function Product() {
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
    queryKey: [productApi.getKey, searchParams],
    queryFn: (context) => productApi.get(context, Object.fromEntries(searchParams)),
    retry: false,
    placeholderData: DEFAULT_PAGINATION_DATA,
  });

  useEffect(() => {
    getData();
  }, [searchParams]);

  const { mutate: create, isLoading: isCreating } = useMutation({
    mutationKey: [productApi.createKey],
    mutationFn: productApi.create,
    onSuccess: (data) => {
      if (data.data) {
        onCloseDetailModal();
        toast.success('Tạo sản phẩm mới thành công');
        getData();
      }
    },
    onError: (err) => {
      toast.error('Tạo sản phẩm mới thất bại');
      console.error(err);
    },
  });

  const { mutate: update, isLoading: isUpdating } = useMutation({
    mutationKey: [productApi.updateKey],
    mutationFn: productApi.update,
    onSuccess: (data) => {
      if (data.data) {
        onCloseDetailModal();
        toast.success('Cập nhật sản phẩm thành công');
        getData();
      }
    },
    onError: (err) => {
      toast.error('Cập nhật sản phẩm thất bại');
      console.error(err);
    },
  });

  const { mutate: remove } = useMutation({
    mutationKey: [productApi.removeKey],
    mutationFn: productApi.remove,
    onSuccess: () => {
      toast.success('Xóa nhật sản thành công');
      getData();
    },
    onError: (err) => {
      toast.error('Xóa nhật sản thất bại');
      console.error(err);
    },
  });

  const {
    data: productDetail,
    isError: getDetailError,
    isFetching: isGettingDetail,
  } = useQuery({
    queryKey: [productApi.getByIdKey, selectingItem?.id],
    queryFn: (context) => productApi.getById(context, selectingItem?.id),
    enabled: Boolean(selectingItem?.id),
    retry: false,
  });

  useEffect(() => {
    if (getDetailError) {
      toast.error('Lấy thông tin chi tiết sản phẩm thất bại');
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
      title: 'Xóa sản phẩm',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
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
      title: 'Hình ảnh',
      dataIndex: 'images',
      width: 1,
      render: (images) => {
        return (
          <>
            {images.length > 0 ? (
              <Image
                height='300px'
                width='225px'
                className='product-card__img'
                src={`${images[0].url}`}
                alt='Product image'
              />
            ) : (
              <Image
                height='300px'
                width='225px'
                className='product-card__img'
                src={ProductPlaceholder}
                alt='Product image'
              />
            )}
          </>
        );
      },
    },
    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      render: (price) => formatVietnameseCurrency(price),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
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
      {openDetailModal && (productDetail || !selectingItem) && (
        <DetailModal
          open={openDetailModal}
          isProducting={isCreating || isUpdating}
          onSubmit={onSubmit}
          onCancel={onCloseDetailModal}
          item={productDetail.product}
        />
      )}
    </>
  );
}
