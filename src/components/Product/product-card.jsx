import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Carousel, Tooltip, Image } from 'antd';
import {
  CheckOutlined,
  EyeTwoTone,
  PhoneFilled,
  ShoppingCartOutlined,
  StarFilled,
} from '@ant-design/icons';
import { classNames, formatVietnameseCurrency } from 'utils/common';
import './Product.scss';
import { Link } from 'react-router-dom';
import ProductPlaceholder from 'assets/images/product-placeholder-2.png';
import useCartManagement from 'hooks/cart-management';

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

  const { onAddItem } = useCartManagement();

  const handleAddProductToCart = () => {
    onAddItem(product);
  };

  return (
    <Card
      hoverable
      onMouseEnter={handleHovering}
      onMouseLeave={handleStopHovering}
      className='w-full'
      bodyStyle={{
        padding: '12px 24px',
      }}
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
                <Link to={`/product/detail/${product['id']}`}>
                  <Button size='large' shape='circle'>
                    <EyeTwoTone />
                  </Button>
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
      }
    >
      <div>
        <Link to={`/product/detail/${product['id']}`}>
          <span className='product-card__name font-semibold'>{product.name}</span>
        </Link>
      </div>
      <div>
        {(product.rating || 0).toFixed(2)} <StarFilled className='text-yellow-500' /> (
        {product.numOfReviews})
      </div>
      <div>
        <span className={'font-bold'}>{formatVietnameseCurrency(product.price)}</span>
      </div>
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
