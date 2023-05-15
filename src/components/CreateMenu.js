import React, { useState, useEffect } from "react";
import { Button, Space, Form, Input, Select, message } from "antd";
import { AddMenu, getMenuList } from "../Service";

const CreateMenu = ({ onCancel, value }) => {
  const [form] = Form.useForm();

  const [dataCreate, setDataCreate] = useState({
    name: "",
    type: "page",
  });
  const [parent, setParent] = useState("0");

  const [menuList, setMenuList] = useState();
  async function getMenuListAPI() {
    let res = await getMenuList();
    if (res) {
      setMenuList(
        res.responses.map((x, index) => ({
          ...x,
          menuType:
            x.type == "page"
              ? "Trang"
              : x.type == "article"
              ? "Bài viết"
              : "Chuyên mục",
          ordinal: index + 1,
        }))
      );
    }
  }
  useEffect(() => {
    getMenuListAPI();
  }, []);
  const CreateNewMenu = async () => {
    if (!dataCreate.name) {
      message.error("Tên danh mục không được trống");
    } else if (!dataCreate.type) {
      message.error("Loại danh mục không được trống");
    } else if (dataCreate.type != "page" && !parent) {
      message.error("Danh mục chứa không được trống");
    } else {
      let res = AddMenu(dataCreate.name, dataCreate.type, parent, onCancel);
      if ((res.statuscode = 200)) {
        setDataCreate({
          ...dataCreate,
          name: "",
          type: "page",
        });
        setParent("0");
        form.resetFields(["name"]);
        form.resetFields(["type"]);
        form.resetFields(["parent"]);
        message.success("Thêm danh mục thành công");
      } else {
        message.error("Thêm danh mục thất bại");
      }
    }
  };
  return (
    <div className="create-group">
      <Form
        layout="vertical"
        name="control-hooks"
        form={form}
        onFinish={CreateNewMenu}
      >
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[
            {
              required: true,
              message: "Tên danh mục không được trống!",
            },
          ]}
        >
          <Input
            name="name"
            placeholder="Nhập tên danh mục"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, name: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Loại danh mục" name="type">
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn loại danh mục"
            defaultValue={"page"}
            options={[
              { value: "page", label: "Trang" },
              { value: "article", label: "Bài viết" },
              { value: "category", label: "Chuyên mục" },
            ]}
            onChange={(e) => {
              if (e != "page") {
                setParent("");
                setDataCreate({ ...dataCreate, type: e });
              } else {
                setDataCreate({ ...dataCreate, type: e });
                setParent("0");
              }
            }}
          />
        </Form.Item>
        {dataCreate.type == "page" ? null : (
          <Form.Item label="Danh mục chứa" name="parent">
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn danh mục chứa"
              onChange={(e) => setParent(e.toString())}
            >
              {menuList.map((e) => {
                return (
                  <Select.OptGroup key={e.id} value={e.id}>
                    {e.name} (Loại danh mục: {e.menuType}, Cấp độ: {e.menulevel}
                    )
                  </Select.OptGroup>
                );
              })}
            </Select>
          </Form.Item>
        )}

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
            <Button type="primary" htmlType="submit">
              Tạo danh mục mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateMenu;
