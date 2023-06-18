import { Button, Form, Input, Typography } from 'antd';
import React, { useContext } from 'react';
import { classNames } from 'utils/common';
import { useNavigate } from 'react-router-dom';
import { routePaths } from 'routers';
import { LoginBrand } from 'components';
import { AuthContext } from 'context/Auth';
import { useMutation } from '@tanstack/react-query';
import { authApi } from 'utils/api/auth';

export default function Login() {
  const navigate = useNavigate();

  const { setAuthenticate } = useContext(AuthContext);

  const { mutate: login, isLoading } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (resp) => {
      const {
        tokens: {
          access: { token: accessToken },
          refresh: { token: refreshToken },
        },
      } = resp.data.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAuthenticate({ isAuthenticated: true });
      navigate('/');
    },
  });

  const [form] = Form.useForm();

  const initialValues = { email: '', password: '', deviceId: 'deviceId-hieu1x@gmail.com' };

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const data = { ...initialValues, ...values };
        login(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className='w-screen h-screen flex items-center justify-center login'>
        <div
          className={classNames(
            'rounded-lg shadow-2xl shadow-slate-700',
            'p-16 w-1/6 flex flex-col items-center',
            'bg-white/70'
          )}
        >
          <LoginBrand />
          <Typography.Title level={1}>Đăng nhập</Typography.Title>
          <Form
            className='w-full'
            layout='vertical'
            form={form}
            initialValues={initialValues}
            onFinish={onSubmit}
          >
            <Form.Item label='Email' name='email' rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label='Mật khẩu'
              extra={
                <Button className='float-right font-semibold' type='link'>
                  Quên mật khẩu?
                </Button>
              }
              name='password'
              rules={[{ required: true }]}
            >
              <Input type='password' />
            </Form.Item>
            <Button type='primary' className='w-full' htmlType='submit' loading={isLoading}>
              Đăng nhập
            </Button>
            <Button
              className='float-right font-semibold'
              type='link'
              onClick={() => navigate(routePaths.register)}
            >
              Chưa có tài khoản? Đăng ký ngay
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
