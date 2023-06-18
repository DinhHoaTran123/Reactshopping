import React from 'react';
import { Button, Carousel, Col, Image, Row, Tooltip } from 'antd';
import PlaceHolderImg from 'assets/images/product-placeholder.png';
import { formatVietnameseCurrency } from 'utils/common';
import PropTypes from 'prop-types';
import { RetweetOutlined } from '@ant-design/icons';
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
                  cursor: 'pointer',
                  backgroundColor: 'white',
                }}
              >
                <Col span={10} onClick={() => handleViewProduct(product)} className="max-h-72 overflow-hidden">
                  {product['images'].length > 0 ? (
                    <Image
                      alt='Product image'
                      className='product-card__img'
                      src={`${product.images?.[0]?.url || ProductPlaceholder}`}
                    />
                  ) : (
                    <Image src={PlaceHolderImg} className='product-card__img' alt='Product image' />
                  )}
                </Col>
                <Col span={14}>
                  <div onClick={() => handleViewProduct(product)}>
                    <h5 className='txt--uppercase txt--dark-olive txt--ellipsis txt--ellipsis-1'>
                      {product['categoryName'] || product['brandName']}
                    </h5>
                    <h4 className='txt--ellipsis txt--ellipsis-1'>{product['name']}</h4>
                    <h4 className='txt--dark-olive'>
                      {formatVietnameseCurrency(product['price'])}
                    </h4>
                    <p className='txt--ellipsis txt--ellipsis-3' style={{ marginTop: 10 }}>
                      {product['description']}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleAddProductToCart(product)}
                    className='bg--dark-olive txt--uppercase'
                  >
                    Cho vào giỏ hàng
                  </Button>
                  <Tooltip title='So sánh sản phẩm'>
                    <Button
                      onClick={() => handleAddCompareProduct(product)}
                      className='bg--dark-olive'
                    >
                      <RetweetOutlined />
                    </Button>
                  </Tooltip>
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
