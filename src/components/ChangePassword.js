import React, { useState } from "react";
import {
  Form,
  Input,
  TreeSelect,
  Space,
  Button,
  Popconfirm,
  message,
} from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { UserChangePassword } from "../Service";

const { SHOW_PARENT } = TreeSelect;
const { TextArea } = Input;

const ChangePassword = ({ onCancel, value }) => {
  const [form] = Form.useForm();
  const [oldpassword, setOldPassword] = useState();
  const [newpassword, setNewPassword] = useState();
  var username = sessionStorage.getItem("username");

  async function ChangePassword() {
    if (!oldpassword) {
      message.error("Mật khẩu hiện tại không được trống");
    } else if (!newpassword) {
      message.error("Mật khẩu mới không được trống");
    } else {
      let res = await UserChangePassword(
        username,
        oldpassword,
        newpassword,
        onCancel
      );
      if ((res.statuscode = 200)) {
        setOldPassword("");
        setNewPassword("");
        form.resetFields(["oldpassword"]);
        form.resetFields(["newpassword"]);
        setVisible(false);
        message.success("Đổi mật khẩu thành công");
      } else {
        setVisible(false);
        message.error("Đổi mật khẩu thất bại");
      }
    }
  }

  const [visible, setVisible] = useState(false);
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
      <Form layout="vertical" name="control-hooks" form={form}>
        <Form.Item
          name="oldpassword"
          label="Mật khẩu hiện tại"
          rules={[
            {
              required: true,
              message: "Mật khẩu hiện tại không được trống!",
            },
          ]}
        >
          <Input.Password
            name="oldpassword"
            placeholder="Nhập mật khẩu hiện tại"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="newpassword"
          label="Mật khẩu mới"
          rules={[
            {
              required: true,
              message: "Mật khẩu mới không được trống!",
            },
            {
              min: 8,
              message: "Mật khẩu quá ngắn!",
            },
            { max: 20, message: "Mật khẩu quá dài!" },
            {
              pattern: new RegExp(
                "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
              ),
              message: "Mật khẩu không hợp lệ!",
            },
          ]}
        >
          <Input.Password
            name="newpassword"
            placeholder="Nhập mật khẩu mới"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => setNewPassword(e.target.value)}
          />
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
              title="Xác nhận đổi mật khẩu?"
              onConfirm={ChangePassword}
              onCancel={cancel}
              okText="Xác nhận"
              cancelText="Hủy"
              visible={visible}
            >
              <Button type="primary" onClick={showPopconfirm}>
                Đổi mật khẩu
              </Button>
            </Popconfirm>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
