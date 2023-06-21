import React from 'react';
import { Form, Input, Modal, Switch } from 'antd';
import { formItemLayoutVertical } from 'utils/constants';
import { pick } from 'lodash';

export default function DetailModal({ open, isProcessing, onSubmit, onCancel, item }) {
  const [form] = Form.useForm();

  const properties = ['id', 'status', 'isPaid'];

  const initialValues = {
    ...pick(item, properties),
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
      title='Đơn hàng'
      okText='Lưu'
      cancelText='Hủy bỏ'
      centered
      open={open}
      onOk={onOK}
      onCancel={onCancel}
      confirmLoading={isProcessing}
      width={480}
    >
      <Form {...formItemLayoutVertical} form={form} initialValues={initialValues} layout='vertical'>
        <Form.Item
          name='status'
          label='Trạng thái'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='isPaid' label='Trạng thái thanh toán' valuePropName='checked'>
          <Switch checkedChildren='Đã thanh toán' unCheckedChildren='Chưa thanh toán' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
