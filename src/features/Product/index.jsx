import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Select, Pagination, Typography, Checkbox } from 'antd';
import ProductCardGrid from 'components/Product/product-card-grid';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from 'utils/api/product';
import { DEFAULT_PAGINATION_DATA } from 'utils/constants';

function Product(props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchParams, setSearchParams] = useSearchParams({
    size: 12,
    page: 0,
  });

  const {
    data: products,
    isLoading: isFetchingProducts,
    refetch: getProducts,
  } = useQuery({
    queryKey: [productApi.getKey, searchParams],
    queryFn: (context) => productApi.get(context, Object.fromEntries(searchParams)),
    placeholderData: DEFAULT_PAGINATION_DATA,
  });

  const { data: categories } = useQuery({
    queryKey: [productApi.getCategoriesKey],
    queryFn: productApi.getCategories,
    placeholderData: [],
  });

  useEffect(() => {
    getProducts();
  }, [searchParams]);

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleChangePageSize = (currentPage, newPageSize) => {
    setSearchParams((prev) => {
      prev.set('size', newPageSize);
      return prev;
    });
  };

  const handleChangePage = (newPage) => {
    setSearchParams((prev) => {
      prev.set('page', newPage);
      return prev;
    });
  };

  return (
    <>
      <Row>
        <Col span={18} offset={3}>
          <Row>
            <Col span={24}>
              <Typography.Title>Sản phẩm</Typography.Title>
            </Col>
          </Row>
          <Row gutter={15}>
            <Col span={6}>
              <div style={{ padding: 15 }} className='bg-white bordered'>
                <h3>Tìm kiếm</h3>
                <Divider />
                <h4>Danh mục</h4>
                <Row>
                  {selectedCategory ? (
                    <Col span={24}>
                      <Checkbox checked={true} onClick={() => handleChangeCategory('')}>
                        {selectedCategory}
                      </Checkbox>
                    </Col>
                  ) : (
                    <>
                      {categories.map((c) => (
                        <Col key={c} span={24}>
                          <Checkbox checked={false} onChange={() => handleChangeCategory(c)}>
                            {c}
                          </Checkbox>
                        </Col>
                      ))}
                    </>
                  )}
                </Row>
              </div>
            </Col>
            <Col span={18} className='bordered'>
              <ProductCardGrid data={products.result} loading={isFetchingProducts} />
              <Pagination
                showSizeChanger
                onShowSizeChange={handleChangePageSize}
                current={parseInt(searchParams.get('page') || 0)}
                pageSizeOptions={[8, 12, 24, 48]}
                pageSize={parseInt(searchParams.get('size') || 0)}
                total={products.total}
                className='mb-15 float-right'
                onChange={handleChangePage}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Product;
