import React from 'react';
import { Form, Input, Modal } from 'antd';
import { formItemLayoutVertical, ROLES } from 'utils/constants';

export default function DetailModal({ open, isProcessing, onSubmit, onCancel, item }) {
  const [form] = Form.useForm();

  const initialValues = item || {
    username: '',
    email: '',
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
          <Input />
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
        <Form.Item
          name='password'
          label='Password'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          name='email'
          label='Email'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
