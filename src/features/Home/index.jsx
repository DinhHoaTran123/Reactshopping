import React from 'react';
import { Button, Col, Row, Skeleton } from 'antd';
import Carousel from './Carousel';
import FeaturedSection from './FeaturedSection';
import ProductSection from './ProductSection';
import ProductCarousel from './ProductCarousel';
import CommentSection from './CommentSection';
import './Home.scss';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from 'utils/api/product';
import { DEFAULT_PAGINATION_DATA } from 'utils/constants';

export default function HomePage() {
  const { data: hotProducts, isLoading } = useQuery({
    queryKey: [productApi.getKey],
    queryFn: (context) => productApi.get(context, { size: 8 }),
    placeholderData: DEFAULT_PAGINATION_DATA,
  });

  return (
    <>
      <Row>
        <Carousel />
      </Row>
      <Row gutter={10} className='featured-section'>
        <FeaturedSection />
      </Row>
      <Row className='product-section'>
        <ProductSection />
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Link to='/product'>
            <Button type='link'>
              <u>Xem thêm các sản phẩm khác</u>
            </Button>
          </Link>
        </Col>
      </Row>
      <Row style={{ marginTop: 150 }}>
        <Col span={16} push={4}>
          <h2>Sản phẩm nổi bật</h2>
        </Col>
      </Row>
      <Row gutter={2} style={{ backgroundColor: '#F2FBCC', paddingTop: 25, paddingBottom: 25 }}>
        <Col span={24}>
          <Skeleton loading={isLoading}>
            <ProductCarousel products={hotProducts.result} />
          </Skeleton>
        </Col>
      </Row>
      <Row style={{ marginTop: 150 }}>
        <Col span={16} push={4}>
          <h2>Đánh giá của khách hàng</h2>
        </Col>
      </Row>
      <Row
        style={{
          backgroundColor: '#F6F6F6',
          paddingTop: 100,
          paddingBottom: 100,
        }}
      >
        <CommentSection />
      </Row>
    </>
  );
}
