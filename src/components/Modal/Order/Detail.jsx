import { Button, Col, Image, Input, Modal, Row, Table } from 'antd';
import React from 'react';
import { formatVietnameseCurrency } from 'utils/common';

function DetailOrderModal({ item, open, onClose }) {
  const priceStyle = {
    fontWeight: 'bold',
    color: 'red',
  };

  const columns = [
    {
      title: 'Ảnh',
      key: 'image',
      render: (text, record) => (
        <Image src={`${record['imgUrl']}/tr:h-150,w-150`} alt='product img' />
      ),
    },
    {
      title: 'Sẩn phẩm',
      key: 'product',
      dataIndex: 'name',
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Tổng tiền',
      key: 'price',
      render: (text, record) => (
        <span style={priceStyle}>{formatVietnameseCurrency(record['price'])}</span>
      ),
    },
  ];

  return (
    <Modal
      width='70%'
      open={open}
      title='Thông tin chi tiết hoá đơn'
      footer={
        <Button onClick={onClose} type='default'>
          Đóng
        </Button>
      }
    >
      {item && (
        <>
          {/* <Row>
            <Col span={24}>
              <Row gutter={10}>
                <Col span={8}>
                  <label>Khách hàng: </label>
                  <Input readOnly value={detailOrder['name']} />
                </Col>
                <Col span={8}>
                  <label>SĐT: </label>
                  <Input readOnly value={detailOrder['phone']} />
                </Col>
                <Col span={8}>
                  <label>Địa chỉ giao hàng: </label>
                  <Input readOnly value={detailOrder['address']} />
                </Col>
              </Row>
              <Row className='mt-10' gutter={10}>
                <Col span={8}>
                  <label>Tổng tiền: </label>
                  <span style={priceStyle}>
                    {formatVietnameseCurrency(detailOrder['totalPrice'])}
                  </span>
                </Col>
                <Col span={8}>
                  <label>Ngày lập đơn hàng: </label>
                  <span>{moment(detailOrder['createdDate']).format('HH:mm DD/MM/YYYY')}</span>
                </Col>
                <Col span={8}>
                  <label>Trạng thái: </label>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: detailOrder['statusColor'],
                    }}
                  >
                    {detailOrder['statusDescription']}
                  </span>
                </Col>
              </Row>
              {detailOrder['note'] && (
                <Row className='mt-10'>
                  <Col span={24}>
                    <label>Ghi chú:</label>
                    <Input.TextArea value={detailOrder['note']} />
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <Row className='mt-10'>
            <Col span={24}>
              <h3>Danh sách sản phẩm</h3>
            </Col>
          </Row>
          <Row className='mt-10'>
            <Col span={24}>
              <Table columns={columns} dataSource={detailOrder['detail']} />
            </Col>
          </Row> */}
        </>
      )}
    </Modal>
  );
}

export default DetailOrderModal;
