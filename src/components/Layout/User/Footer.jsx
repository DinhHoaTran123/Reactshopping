import React from 'react';
import { Col, Image, Layout, Menu, Row } from 'antd';
import BrandIconBlueTransparent from 'assets/images/brand-icon-blue-transparent.png';

function Footer() {
  return (
    <Layout.Footer
      style={{ textAlign: 'center', backgroundColor: 'white', borderTop: '5px solid #668866' }}
    >
      <Row>
        <Col offset={4} span={4}>
          <div className='logo'>
            <Image src={BrandIconBlueTransparent} alt='Logo smatyx' className='w-full' />
          </div>
          © Smatyx - All rights reversed
        </Col>
        <Col span={4}>
          <Menu>
            <Menu.Item>Về chúng tôi</Menu.Item>
            <Menu.Item>Thông tin liên lạc</Menu.Item>
            <Menu.Item>Theo dõi đơn hàng</Menu.Item>
          </Menu>
        </Col>
        <Col span={4}>
          <Menu>
            <Menu.Item>FAQs</Menu.Item>
            <Menu.Item>Hỗ trợ</Menu.Item>
          </Menu>
        </Col>
        <Col span={4}>
          <Menu>
            <Menu.Item>Facebook</Menu.Item>
            <Menu.Item>Instagram</Menu.Item>
            <Menu.Item>Youtube</Menu.Item>
            <Menu.Item>Twitter</Menu.Item>
          </Menu>
        </Col>
      </Row>
    </Layout.Footer>
  );
}

export default Footer;
