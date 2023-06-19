import React from 'react';
import { Button, Carousel, Col, Image, Row, Tooltip } from 'antd';
import PlaceHolderImg from 'assets/images/product-placeholder.png';
import { formatVietnameseCurrency } from 'utils/common';
import PropTypes from 'prop-types';
import { PhoneFilled, RetweetOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProductPlaceholder from 'assets/images/product-placeholder-2.png';

function ProductCarousel(props) {
  const navigate = useNavigate();
  const { products } = props;
  const handleAddCompareProduct = (product) => {
    // dispatch(addProductToCompare(product));
  };

  const handleAddProductToCart = (product) => {
    // dispatch(addProductToCart(product));
  };

  const handleViewProduct = (product) => {
    navigate(`/product/detail/${product['id']}`);
  };

  return (
    <Carousel
      draggable
      slidesPerRow={3}
      speed={2000}
      autoplay={true}
      autoplaySpeed={10000}
      pauseOnHover={false}
      dots={false}
    >
      {products.map((product) => (
        <div key={product['id']}>
          <Row>
            <Col span={22} push={1}>
              <Row
                align='middle'
                gutter={10}
                style={{
                  border: '1px solid #EEEFEE',
                  marginTop: 5,
                  marginBottom: 5,
                  padding: 10,
                  backgroundColor: 'white',
                }}
              >
                <Col
                  span={10}
                  onClick={() => handleViewProduct(product)}
                  className='max-h-72 overflow-hidden'
                >
                  {product['images'].length > 0 ? (
                    <Image
                      alt='Product image'
                      height='220px'
                      className='product-card__img'
                      src={`${product.images?.[0]?.url || ProductPlaceholder}`}
                    />
                  ) : (
                    <Image src={PlaceHolderImg} className='product-card__img' alt='Product image' />
                  )}
                </Col>
                <Col span={14}>
                  <div onClick={() => handleViewProduct(product)} className='cursor-pointer'>
                    <div className='text-xl uppercase txt--dark-olive txt--ellipsis txt--ellipsis-1'>
                      {product['category'] || product['brand']}
                    </div>
                    <div className='font-bold text-lg txt--ellipsis txt--ellipsis-1'>
                      {product['name']}
                    </div>
                  </div>
                  {(product.rating || 0).toFixed(2)} <StarFilled className='text-yellow-500' /> (
                  {product.numOfReviews})
                  <div className='txt--ellipsis txt--ellipsis-3' style={{ marginTop: 10 }}>
                    {product['description']}
                  </div>
                  <div></div>
                  <div>
                    <span className={'font-bold txt--dark-olive'}>
                      {formatVietnameseCurrency(product.price)}
                    </span>
                  </div>
                  {product.countInStock > 0 ? (
                    <Button
                      onClick={() => handleAddProductToCart(product)}
                      className='bg--dark-olive txt--uppercase'
                    >
                      Cho vào giỏ hàng
                    </Button>
                  ) : (
                    <p>
                      <PhoneFilled rotate={180} /> Liên hệ
                    </p>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ))}
    </Carousel>
  );
}

ProductCarousel.propTypes = {
  products: PropTypes.array,
};

ProductCarousel.defaultProps = {
  products: [],
};

export default ProductCarousel;
