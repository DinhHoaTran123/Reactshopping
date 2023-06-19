import React from 'react';
import { Col, Tabs } from 'antd';
import ProductCardGrid from 'components/Product/product-card-grid';
import { useQuery } from '@tanstack/react-query';
import { productApi } from 'utils/api/product';
import { DEFAULT_PAGINATION_DATA } from 'utils/constants';

export default function ProductSection() {
  const { data: products, isLoading } = useQuery({
    queryKey: [productApi.getKey],
    queryFn: (context) => productApi.get(context, { size: 24 }),
    placeholderData: DEFAULT_PAGINATION_DATA,
  });

  return (
    <Col span={16} push={4}>
      <Tabs
        defaultActiveKey='new-arrival'
        items={[
          {
            key: 'new-arrival',
            label: 'Hàng mới về',
            children: <ProductCardGrid data={products.result.slice(0, 8)} loading={isLoading} />,
          },
          {
            key: 'best-seller',
            label: 'Sản phẩm bán chạy',
            children: <ProductCardGrid data={products.result.slice(8, 16)} loading={isLoading} />,
          },
          {
            key: 'new-product',
            label: 'Sản phẩm mới',
            children: <ProductCardGrid data={products.result.slice(16, 24)} loading={isLoading} />,
          },
        ]}
      />
    </Col>
  );
}
