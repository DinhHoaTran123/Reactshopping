import React from 'react';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';

export default function Actions({ record, onEdit, onDelete, loading }) {
  const KEY_ACTIONS = {
    EDIT: 'edit',
    DELETE: 'delete',
  };

  const onClick = ({ key }) => {
    switch (key) {
      case KEY_ACTIONS.EDIT:
        onEdit(record);
        break;
      case KEY_ACTIONS.DELETE:
        onDelete(record);
        break;
      default:
        break;
    }
  };

  const actions = [
    {
      key: KEY_ACTIONS.EDIT,
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
    },
    {
      key: KEY_ACTIONS.DELETE,
      label: 'Xóa',
      icon: <DeleteOutlined />,
      danger: true,
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
