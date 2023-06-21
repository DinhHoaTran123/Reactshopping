import React, { useContext, useState } from 'react';
import {
  Row,
  Col,
  Image,
  Alert,
  Skeleton,
  Carousel,
  Button,
  Divider,
  InputNumber,
  Descriptions,
} from 'antd';
import { StarFilled } from '@ant-design/icons';
import { formatVietnameseCurrency } from 'utils/common';
import ProductComment from './comment-section';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { productApi } from 'utils/api/product';
import { AuthContext } from 'context/Auth';
import { toast } from 'react-toastify';
import useCartManagement from 'hooks/cart-management';

function ProductDetail() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  const {
    data: productDetail,
    isLoading,
    refetch: getProductDetail,
  } = useQuery({
    queryKey: [productApi.getByIdKey, id],
    queryFn: (context) => productApi.getById(context, id),
    enabled: Boolean(id),
  });

  const { onAddItem } = useCartManagement();

  const handleAddToCart = () => {
    onAddItem(productDetail.product, quantity);
  };

  const { mutate: submitReview } = useMutation({
    mutationKey: [productApi.reviewKey],
    mutationFn: productApi.review,
    onSuccess: () => {
      toast.success('Cảm ơn bạn đã gửi bài đánh giá');
      getProductDetail();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Unknown error');
    },
  });

  const { userInfo, isAuthenticated } = useContext(AuthContext);

  const handleSubmitComment = (content, rating) => {
    if (userInfo && isAuthenticated) {
      const comment = {
        productId: product.id,
        content,
        rating,
      };
      submitReview(comment);
    }
  };

  const { product, reviews } = productDetail || {};

  return (
    <>
      <Row>
        <Col span={18} offset={3}>
          <Skeleton active={true} loading={isLoading}>
            {productDetail ? (
              <>
                <Row>
                  <Col span={24}>
                    <Row>
                      <Col span={9} className='text-center'>
                        <Carousel draggable autoplay autoplaySpeed={5000} pauseOnHover>
                          {product['images'].map((img) => (
                            <div key={img['id']}>
                              <Image src={img.url} alt='Product image' />
                            </div>
                          ))}
                        </Carousel>
                      </Col>
                      <Col span={15} className='bordered' style={{ padding: 25 }}>
                        <Row>
                          <Col span={24}>
                            <h2>{product['name']}</h2>
                            <h3 style={{ color: '#02937F' }}>
                              {reviews.result?.length > 0 ? (
                                <>
                                  {(product.rating || 0).toFixed(2)}{' '}
                                  <StarFilled className='text-yellow-500' />- Dựa trên{' '}
                                  {reviews.result.length} đánh giá
                                </>
                              ) : (
                                'Chưa có đánh giá nào cho sản phẩm này'
                              )}
                            </h3>
                            <h2>
                              {Boolean(product['isDiscount']) && (
                                <span>
                                  <span>{formatVietnameseCurrency(product['price'])}</span>
                                  {' - '}
                                </span>
                              )}
                              <span>{formatVietnameseCurrency(product.price)}</span>
                            </h2>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <label className='text-bold'>Số lượng:</label>
                          </Col>
                        </Row>
                        <div className='flex flex-row gap-x-4'>
                          <InputNumber
                            min={1}
                            max={product.countInStock}
                            value={quantity}
                            onChange={setQuantity}
                          />
                          <Button
                            style={{
                              backgroundColor: '#02937F',
                              color: 'white',
                            }}
                            onClick={handleAddToCart}
                            disabled={product.countInStock === 0}
                          >
                            THÊM VÀO GIỎ HÀNG
                          </Button>
                        </div>
                        <Row className='mt-20'>
                          <Col span={24}>
                            <Divider orientation='left'>Tổng quan</Divider>
                            <Descriptions>
                              <Descriptions.Item label='Nhãn hàng'>
                                {product.brand}
                              </Descriptions.Item>
                              <Descriptions.Item label='Thể loại'>
                                {product.category}
                              </Descriptions.Item>
                              <Descriptions.Item label='Tồn kho'>
                                {product.countInStock}
                              </Descriptions.Item>
                            </Descriptions>
                            <Divider orientation='left'>Mô tả</Divider>
                            <p>{product.description}</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className='mt-25'>
                      <Col span={24} className='bordered' style={{ padding: 25 }}>
                        <ProductComment
                          comments={reviews}
                          averageRating={product.rating}
                          onComment={handleSubmitComment}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : (
              <Alert type='warning' message='Sản phẩm bạn đang tìm không tồn tại' />
            )}
          </Skeleton>
        </Col>
      </Row>
    </>
  );
}

export default ProductDetail;
