import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Skeleton, Alert } from "antd";
import ProductCard from "./product-card";

function ProductCardGrid(props) {
    const { data, loading } = props;
    return (
        <>
            <Row gutter={16} style={{ paddingBottom: 10 }}>
                <Skeleton loading={loading}>
                    {data.length > 0 ? (
                        <>
                            {data.map((p, idx) => (
                                <Col className="mt-10" key={idx} lg={6} md={8} sm={12} xs={24}>
                                    <ProductCard product={p} />
                                </Col>
                            ))}
                        </>
                    ) : (
                        <Col span={24}>
                            <Alert type="warning" message="Không có sản phẩm để hiển thị" />
                        </Col>
                    )}
                </Skeleton>
            </Row>
        </>
    );
}

ProductCardGrid.propTypes = {
    data: PropTypes.array,
};

ProductCardGrid.defaultProps = {
    data: [],
};

export default ProductCardGrid;
