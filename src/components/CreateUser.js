import { Button, Space, Form, Input, Select, Popconfirm } from "antd";
import React, { useState } from "react";

const CreateUser = ({ onCancel }) => {
  const [visible, setVisible] = useState(false);

  const CreateNewUser = () => {
    setVisible(false);
  };
  const showPopconfirm = () => {
    if (visible == false) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  const cancel = (e) => {
    setVisible(false);
  };

  return (
    <div className="create-group">
      <Form layout="vertical" name="control-hooks">
        <Form.Item name="ACCOUNT" label="Tài khoản">
          <Input name="ACCOUNT" placeholder="Nhập tên tài khoản" />
        </Form.Item>
        <Form.Item name="PASSWORD" label="Mật khẩu">
          <Input name="PASSWORD" placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item name="NAME" label="Họ tên người dùng">
          <Input name="NAME" placeholder="Nhập tên người dùng" />
        </Form.Item>
        <Form.Item name="ROLE" label="Chọn chức vụ">
          <Select
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Chọn chức vụ"
          >
            <Select.Option key={1}>Trưởng khoa</Select.Option>
            <Select.Option key={2}>Phó khoa</Select.Option>
            <Select.Option key={3}>Giảng viên khoa</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="primary" onClick={onCancel}>
              Hủy
            </Button>
            <Popconfirm
              title="Xác nhận thêm người dùng?"
              onConfirm={CreateNewUser}
              onCancel={cancel}
              okText="Xác nhận"
              cancelText="Hủy"
              visible={visible}
            >
              <Button type="primary" onClick={showPopconfirm}>
                Thêm người dùng
              </Button>
            </Popconfirm>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUser;
