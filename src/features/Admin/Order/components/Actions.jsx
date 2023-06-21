import React from 'react';
import { DownOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';

export default function Actions({ record, onView, onEdit, loading }) {
  const KEY_ACTIONS = {
    VIEW: 'view',
    EDIT: 'edit',
  };

  const onClick = ({ key }) => {
    switch (key) {
      case KEY_ACTIONS.VIEW:
        onView(record);
        break;
      case KEY_ACTIONS.EDIT:
        onEdit(record);
        break;
      default:
        break;
    }
  };

  const actions = [
    {
      key: KEY_ACTIONS.VIEW,
      label: 'Xem chi tiết',
      icon: <EyeOutlined />,
    },
    {
      key: KEY_ACTIONS.EDIT,
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
    },
  ];

  return (
    <Dropdown menu={{ items: actions, onClick }}>
      <Button loading={loading}>
        <Space>
          Hành động
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
