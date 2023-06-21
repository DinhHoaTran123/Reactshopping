import React, { useContext, useState } from 'react';
import { StarFilled } from '@ant-design/icons';
import { Avatar, Input, Button, Divider, Typography, Rate } from 'antd';
import moment from 'moment';
import { AuthContext } from 'context/Auth';

function ProductComment({ comments, averageRating, onComment }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  const handleSubmitComment = () => {
    onComment(content, rating);
    setRating(5);
    setContent('');
  };

  const { userInfo, isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <Divider style={{ fontSize: 24 }}>Đánh giá của khách hàng</Divider>
      <h3 style={{ color: '#02937F' }}>
        {comments.result?.length > 0 ? (
          <>
            {(averageRating || 0).toFixed(2)} <StarFilled className='text-yellow-500' /> - Dựa trên{' '}
            {comments.result.length} đánh giá
          </>
        ) : (
          'Chưa có đánh giá nào cho sản phẩm này'
        )}
      </h3>
      {userInfo && isAuthenticated && (
        <div className='mt-15 mb-15'>
          <h4>Hãy cho chúng tôi biết ý kiến của bạn</h4>
          <Rate className='mb-4 text-4xl' allowHalf value={rating} onChange={setRating} />
          <Input.TextArea
            rows={4}
            placeholder='Đánh giá'
            value={content}
            onChange={handleChangeContent}
          />
          <Button onClick={handleSubmitComment} className='mt-10' type='primary'>
            Gửi đánh giá
          </Button>
        </div>
      )}
      {comments.result?.map((comment, idx) => {
        return (
          <>
            <Divider />
            <div className='flex flex-row items-center gap-x-4'>
              <div>
                <Avatar
                  src={`https://ui-avatars.com/api/?background=random&name=${comment.userReview.username}`}
                  alt='avatar'
                />
              </div>
              <div>
                <div>
                  <Typography.Text>
                    {comment.rating} <StarFilled className='text-yellow-500' />
                  </Typography.Text>
                  {' - '}
                  <Typography.Text className='font-semibold'>
                    {comment.userReview.username}
                  </Typography.Text>
                  {' - '}
                  <Typography.Text className='text-xs text-gray-500 font-semibold'>
                    {moment(comment['createdAt']).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography.Text>
                </div>
                <div>
                  <p>{comment.content}</p>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
}

export default ProductComment;
