import React from 'react';
import { HeartTwoTone, StarOutlined, StarFilled } from '@ant-design/icons';
import { Avatar } from 'antd';

export default function Comment(props) {
  const { comment } = props;
  const rating = [0, 0, 0, 0, 0];
  rating.fill(1, 0, comment.rate);
  return (
    <div className='text-center comment-slide'>
      <Avatar
        size={100}
        src={`https://ui-avatars.com/api/?background=random&name=${comment.fullName}`}
        alt='Avatar'
      />
      <div className='mt-4'>
        {rating.map((rate, idx) =>
          rate ? <StarFilled key={idx} className='text-yellow-500' /> : <StarOutlined key={idx} />
        )}
      </div>
      <div>
        <div className='text-lg'>{comment.content}</div>
        <HeartTwoTone twoToneColor='#D7385E' />
        <div className='text-xl font-semibold'>{comment.fullName}</div>
      </div>
    </div>
  );
}
