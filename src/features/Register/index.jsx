import { Button, Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { classNames } from 'utils/common';
import { useNavigate } from 'react-router-dom';
import { routePaths } from 'routers';
import { LoginBrand } from 'components';
import { useMutation } from '@tanstack/react-query';
import { authApi } from 'utils/api/auth';

export default function Register() {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const { mutate: register, isLoading } = useMutation({
    mutationFn: authApi.register,
    mutationKey: [authApi.registerKey],
    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const data = { ...initialValues, ...values };
        delete data.confirmPassword;
        register(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className='w-screen h-screen flex items-center justify-center register'>
        <div
          className={classNames(
            'rounded-lg shadow-2xl shadow-slate-700',
            'p-16 w-full sm:w-2/3 lg:w-1/4 flex flex-col items-center',
            'bg-white/70'
          )}
        >
          <LoginBrand />
          <Typography.Title level={1}>Đăng ký</Typography.Title>
          <Form
            className='w-full'
            layout='vertical'
            form={form}
            initialValues={initialValues}
            onFinish={onSubmit}
          >
            <Form.Item
              label='Tên đăng nhập'
              name='username'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  type: 'email',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Mật khẩu'
              name='password'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type='password' />
            </Form.Item>
            <Form.Item
              label='Xác nhận mật khẩu'
              name='confirmPassword'
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không trùng khớp'));
                  },
                }),
              ]}
            >
              <Input type='password' />
            </Form.Item>

            <Button type='primary' className='w-full' htmlType='submit' loading={isLoading}>
              Đăng ký
            </Button>
            <Button
              className='float-right font-semibold'
              type='link'
              onClick={() => navigate(routePaths.login)}
            >
              Đã có tài khoản? Đăng nhập ngay
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
