import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Carousel, Col, Row, Tooltip, Image } from 'antd';
import {
  CheckOutlined,
  EyeTwoTone,
  PhoneFilled,
  RetweetOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { classNames, formatVietnameseCurrency } from 'utils/common';
import './Product.scss';
import { Link } from 'react-router-dom';
import ProductPlaceholder from 'assets/images/product-placeholder-2.png';

function ProductCard(props) {
  const { product } = props;
  const carousel = useRef(null);
  const [hidden, setHidden] = useState(true);

  const handleHovering = () => {
    carousel.current.next();
    setHidden(false);
  };

  const handleStopHovering = () => {
    setHidden(true);
  };

  const handleAddCompareProduct = () => {
    // dispatch(addProductToCompare(product));
  };

  const handleAddProductToCart = () => {
    // dispatch(addProductToCart(product));
  };

  return (
    <Card
      hoverable
      onMouseEnter={handleHovering}
      onMouseLeave={handleStopHovering}
      className='w-full'
      cover={
        <div className='w-full relative' style={{ height: 300 }}>
          <Carousel speed={500} ref={carousel}>
            {product.images.length > 0 ? (
              product.images.map((img) => (
                <div key={img['id']} className='text-center'>
                  <Image
                    height='300px'
                    className='product-card__img'
                    src={`${img['url']}`}
                    alt='Product image'
                  />
                </div>
              ))
            ) : (
              <div className='text-center'>
                <Image
                  height='300px'
                  className='product-card__img'
                  src={ProductPlaceholder}
                  alt='Product image'
                />
              </div>
            )}
          </Carousel>
          <div className={classNames('custom-overlay custom-overlay-dark-bg', hidden && 'hidden')}>
            <div className='flex w-full h-full items-center justify-center'>
              <Tooltip title='Thêm sản phẩm vào giỏ hàng'>
                <Button
                  onClick={handleAddProductToCart}
                  className='text-green-600'
                  size='large'
                  shape='circle'
                  icon={<ShoppingCartOutlined />}
                />
              </Tooltip>
              <Tooltip title='Xem chi tiết'>
                <Link to={`/product/detail/${product['slug']}.${product['id']}`}>
                  <Button size='large' shape='circle'>
                    <EyeTwoTone />
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip title='So sánh sản phẩm'>
                <Button
                  onClick={handleAddCompareProduct}
                  size='large'
                  shape='circle'
                  icon={<RetweetOutlined />}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      }
    >
      <Row>
        <Col span={24}>
          <Link to={`/product/detail/${product['id']}`}>
            <h4 className='product-card__name'>{product.name}</h4>
          </Link>
        </Col>
      </Row>
      <p>
        <span className={'font-bold'}>{formatVietnameseCurrency(product.price)}</span>
      </p>
      <p>
        {product.countInStock > 0 ? (
          <span style={{ color: '#4EC067' }}>
            <CheckOutlined /> Còn hàng
          </span>
        ) : (
          <span>
            <PhoneFilled rotate={180} /> Liên hệ
          </span>
        )}
      </p>
    </Card>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
