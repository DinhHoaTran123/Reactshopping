import React from 'react';
import { Button, Divider, Form, Input, InputNumber, Modal, Select } from 'antd';
import { formItemLayoutVertical } from 'utils/constants';
import { productApi } from 'utils/api/product';
import { useQuery } from '@tanstack/react-query';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { pick } from 'lodash';

export default function DetailModal({ open, isProcessing, onSubmit, onCancel, item }) {
  const [form] = Form.useForm();

  const { data: categories } = useQuery({
    queryKey: [productApi.getCategoriesKey],
    queryFn: productApi.getCategories,
    placeholderData: [],
  });

  const properties = ['id', 'name', 'brand', 'category', 'description', 'price', 'countInStock'];

  const initialValues = {
    ...pick(item, properties),
  } || {
    name: '',
    brand: '',
    category: '',
    description: '',
    price: 1,
    countInStock: 0,
    imageUrls: [],
  };

  const onOK = () => {
    form
      .validateFields()
      .then((values) => onSubmit({ ...initialValues, ...values }))
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Modal
      title='Sản phẩm'
      okText='Lưu'
      cancelText='Hủy bỏ'
      centered
      open={open}
      onOk={onOK}
      onCancel={onCancel}
      confirmLoading={isProcessing}
      width={720}
    >
      <Form {...formItemLayoutVertical} form={form} initialValues={initialValues} layout='vertical'>
        <Form.Item
          name='name'
          label='Tên sản phẩm'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='brand'
          label='Thương hiệu'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='category' label='Thể loại' rules={[{ required: true }]}>
          <Select options={categories.map((category) => ({ label: category, value: category }))} />
        </Form.Item>
        <Form.Item name='description' label='Mô tả' rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name='price' label='Giá tiền' rules={[{ required: true }]}>
          <InputNumber min={1} className='w-full' />
        </Form.Item>
        <Form.Item name='countInStock' label='Số lượng tồn kho' rules={[{ required: true }]}>
          <InputNumber min={0} className='w-full' />
        </Form.Item>
        <Divider orientation='left'>Ảnh</Divider>
        {!item?.id && (
          <Form.List name='imageUrls'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className='flex flex-row gap-x-4 w-full items-baseline'>
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[{ required: true }]}
                      className='!flex-grow'
                    >
                      <Input placeholder='URL ảnh' />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm ảnh
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
      </Form>
    </Modal>
  );
}
