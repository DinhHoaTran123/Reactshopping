import React from 'react';
import { Col, Carousel, Row } from 'antd';
import Comment from './Comment';

export default function CommentSection() {
  const comments = [
    {
      rate: 5,
      fullName: 'David Degea',
      content: 'Wonderful, number one',
    },
    {
      rate: 5,
      fullName: 'Cristiano Ronaldo',
      content: '1st, cannot find anywhere better',
    },
    {
      rate: 4,
      fullName: 'Messi',
      content: 'One of my top choices',
    },
    {
      rate: 4,
      fullName: 'Haaland',
      content: 'Can you believe it?',
    },
    {
      rate: 5,
      fullName: 'Mbappe',
      content: 'Good',
    },
    {
      rate: 3,
      fullName: 'Random stranger',
      content: 'Mehhh',
    },
  ];
  return (
    <Col span={24}>
      <Carousel
        slidesPerRow={3}
        draggable
        speed={2000}
        autoplay={true}
        autoplaySpeed={10000}
        pauseOnHover={false}
        dots={false}
      >
        {comments.map((comment, idx) => (
          <Row key={idx}>
            <Col span={24}>
              <Comment comment={comment} />
            </Col>
          </Row>
        ))}
      </Carousel>
    </Col>
  );
}
