import { Button, Space, Form, Input, Popconfirm, Select } from "antd";
import React, { useEffect, useState } from "react";

const EditUser = ({ dataToUpdate, onCancel }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState({
    ACCOUNT: dataToUpdate.ACCOUNT,
    PASSWORD: dataToUpdate.PASSWORD,
    NAME: dataToUpdate.NAME,
    ROLE: dataToUpdate.ROLE,
  });
  const [selectedValue, setSelectedValue] = useState();

  useEffect(() => {
    setDataEdit(dataToUpdate);
  }, [dataToUpdate]);
  useEffect(() => {
    form.setFieldsValue({ ACCOUNT: dataEdit?.ACCOUNT });
    form.setFieldsValue({ PASSWORD: dataEdit?.PASSWORD });
    form.setFieldsValue({ NAME: dataEdit?.NAME });
  }, [dataEdit]);
  useEffect(() => {
    setSelectedValue(dataEdit?.ROLE);
  }, [dataEdit?.ROLE]);

  const onChange = (e) => {
    setDataEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleChangeSelect = (e) => {
    setSelectedValue(e);
    setDataEdit({ ...dataEdit, ROLE: e });
  };

  const UpdateUser = () => {
    setVisible(false);
  };
  const showPopconfirm = () => {
    if (visible === false) {
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
        <Form.Item name="ACCOUNT" label="Tài khoản">
          <Input
            onChange={onChange}
            name="ACCOUNT"
            placeholder="Nhập tên tài khoản"
            value={dataEdit.ACCOUNT}
          />
        </Form.Item>
        <Form.Item name="NAME" label="Tên người dùng">
          <Input
            onChange={onChange}
            name="NAME"
            placeholder="Nhập tên người dùng"
            value={dataEdit.NAME}
          />
        </Form.Item>
        <Form.Item label="Chức vụ">
          <Select
            style={{
              width: "100%",
            }}
            placeholder="Chọn chức vụ"
            value={selectedValue}
            onChange={handleChangeSelect}
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
              title="Xác nhận chỉnh sửa?"
              onConfirm={UpdateUser}
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
  );
};

export default EditUser;
