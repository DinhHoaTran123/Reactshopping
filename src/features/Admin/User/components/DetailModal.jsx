import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { formItemLayoutVertical, ROLES } from 'utils/constants';
import { pick } from 'lodash';

export default function DetailModal({ open, isProcessing, onSubmit, onCancel, item }) {
  const [form] = Form.useForm();

  const properties = ['id', 'username', 'email', 'contact', 'role'];

  const initialValues = {
    ...pick(item, properties),
  } || {
    username: '',
    email: '',
    contact: '',
    role: ROLES.USER,
    password: '',
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
      title='User'
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
          name='email'
          label='Email'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input disabled={Boolean(item?.id)} />
        </Form.Item>
        <Form.Item
          name='username'
          label='Username'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        {!item?.id && (
          <Form.Item
            name='password'
            label='Password'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type='password' />
          </Form.Item>
        )}
        <Form.Item name='contact' label='Contact'>
          <Input />
        </Form.Item>
        <Form.Item name='role' label='Role'>
          <Select
            options={[
              {
                label: 'User',
                value: ROLES.USER,
              },
              {
                label: 'Admin',
                value: ROLES.ADMIN,
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
