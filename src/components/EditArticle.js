import { Button, Space, Form, Input, Popconfirm, Card } from "antd";
import React, { useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const EditArticle = ({ onCancel }) => {
  const [visible, setVisible] = useState(false);

  const EditArticle = () => {
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
    <>
      <div className="create-group">
        <Form layout="vertical" name="control-hooks">
          <Form.Item name="TITLE" label="Tiêu đề">
            <Input name="TITLE" placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>
          <Form.Item name="DESCRIPTION" label="Nội dung">
            <TextArea
              placeholder="Nội dung bài viết"
              className="custom"
              style={{ height: 180 }}
            />
          </Form.Item>

          <Form.Item name="IMAGE" label="Hình ảnh">
            <Card
              bordered
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
                marginRight: ".1rem",
                marginLeft: ".1rem",
              }}
              onClick={() => {}}
            >
              <PlusCircleOutlined
                style={{ fontSize: 22, marginLeft: "1.5rem" }}
              />
              <br></br>
              Tải ảnh lên
            </Card>
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
                title="Xác nhận chỉnh sửa?"
                onConfirm={EditArticle}
                onCancel={cancel}
                okText="Xác nhận"
                cancelText="Hủy"
                visible={visible}
              >
                <Button type="primary" onClick={showPopconfirm}>
                  Cập nhật
                </Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EditArticle;
