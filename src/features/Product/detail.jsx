import React, { useContext, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Image,
  Alert,
  Skeleton,
  Carousel,
  Input,
  Button,
  Tabs,
  Divider,
  InputNumber,
  Descriptions,
} from 'antd';
import { PlusOutlined, MinusOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { formatVietnameseCurrency } from 'utils/common';
import ProductCard from 'components/Product/product-card';
import ProductComment from './comment-section';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { productApi } from 'utils/api/product';
import { AuthContext } from 'context/Auth';
import { toast } from 'react-toastify';

function ProductDetail() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [disableAddToCart, setDisableAddToCart] = useState(false);

  const { data: productDetail, isLoading } = useQuery({
    queryKey: [productApi.getByIdKey, id],
    queryFn: (context) => productApi.getById(context, id),
    enabled: Boolean(id),
  });

  const handleInputQuantity = (e) => {
    if (isNaN(e.key)) {
      e.preventDefault();
    }
  };

  const handleBlurQuantity = (e) => {
    if (quantity < 1) {
      if (!disableAddToCart) {
        setDisableAddToCart(true);
      }
    }
  };

  const handleChangeQuantity = (e) => {
    let newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity)) {
      newQuantity = '';
    }
    setQuantity(newQuantity);
  };

  const handleFocusQuantityInput = () => {
    if (disableAddToCart) {
      setDisableAddToCart(false);
    }
  };

  const handleAddToCart = () => {
    // dispatch(addProductToCart(product, quantity));
  };

  const handlePlusQuantity = () => {
    if (quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleMinusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { mutate: submitReview } = useMutation({
    mutationKey: [productApi.reviewKey],
    mutationFn: productApi.review,
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

  const tabPaneStyle = {
    maxHeight: 500,
    overflow: 'auto',
  };

  console.log(productDetail);
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
                                  {product.rating} <StarFilled className='text-yellow-500' />- Dựa
                                  trên {reviews.result.length} đánh giá
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
                            disabled={disableAddToCart}
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
                            <p>{product['description']}</p>
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
