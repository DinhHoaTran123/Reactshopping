import { Row, Col, Image, Divider } from 'antd';
import React from 'react';
import { formatVietnameseCurrency } from 'utils/common';
import { CheckOutlined, PhoneFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function ProductMenu({ product, cart = false }) {
  return (
    <Link to={`/product/detail/${product['slug']}.${product['id']}`}>
      <Row gutter={10} align='middle'>
        <Col span={5}>
          <Image src={`${product['images'][0]['url']}`} alt='img' />
        </Col>
        <Col span={19}>
          <h4
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product['name']}
          </h4>
          <h3>
            <span>{formatVietnameseCurrency(product['price'])}</span>
          </h3>
          <h4>
            {product.countInStock > 0 ? (
              <span style={{ color: '#4EC067' }}>
                <CheckOutlined /> Còn hàng
              </span>
            ) : (
              <span>
                <PhoneFilled /> Liên hệ
              </span>
            )}
          </h4>
        </Col>
        <Divider />
      </Row>
    </Link>
  );
}

export default ProductMenu;
