import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Space,
  Form,
  Input,
  Popconfirm,
  TreeSelect,
  Select,
  message,
} from "antd";
import { UpdateBlog } from "../Service";
import SunEditor from "suneditor-react";
import "suneditor/src/assets/css/suneditor.css";

const EditBlog = ({ onCancel, value, dataToUpdate }) => {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  const [form] = Form.useForm();
  const [dataEdit, setDataEdit] = useState({
    id: dataToUpdate.id,
    title: dataToUpdate.title,
    articlecontent: dataToUpdate.articlecontent,
    hastag: dataToUpdate.hastag,
    language: dataToUpdate.language,
  });
  const [articlecontent, setArticlecontent] = useState("");
  useEffect(() => {
    setArticlecontent(dataToUpdate?.articlecontent);
    setDataEdit(dataToUpdate);
  }, [dataToUpdate]);
  useEffect(() => {
    form.setFieldsValue({ title: dataEdit.title });
    form.setFieldsValue({ hastag: dataEdit.hastag.replace("#", "") });
    form.setFieldsValue({ language: dataEdit?.language });
  }, [dataEdit]);
  const handleChangeSelect = (e) => {
    setDataEdit({ ...dataEdit, language: e });
  };
  const onChangeForm = (e) => {
    setDataEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
  const handleEditBlog = async () => {
    if (!dataEdit.title) {
      message.error("Tiêu đề không được trống");
    } else if (!articlecontent) {
      message.error("Nội dung không được trống");
    } else {
      let res = UpdateBlog(
        dataEdit.id,
        dataEdit.title,
        articlecontent,
        dataEdit.hastag,
        dataEdit.language,
        onCancel
      );
      if ((res.statuscode = 200)) {
        setVisible(false);
        message.success("Cập nhật thông tin bài viết thành công");
      } else {
        setVisible(false);
        message.error("Cập nhật thông tin bài viết thất bại");
      }
    }
  };

  var options = [
    { val: "vn", label: "Tiếng Việt" },
    { val: "en", label: "English" },
  ];

  return (
    <>
      <div className="edit-group">
        <Form layout="vertical" name="control-hooks" form={form}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[
              {
                required: true,
                message: "Tiêu đề không được trống!",
              },
            ]}
          >
            <Input
              name="title"
              placeholder="Nhập tiêu đề bài viết"
              onChange={onChangeForm}
              value={dataEdit.title}
            />
          </Form.Item>
          <Form.Item label="Hastag" name="hastag">
            <Input
              name="hastag"
              prefix="#"
              onChange={onChangeForm}
              value={dataEdit.hastag}
            />
          </Form.Item>
          <Form.Item label="Ngôn ngữ" name="language">
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn ngôn ngữ"
              value={dataEdit.language}
              onChange={handleChangeSelect}
            >
              {options.map((value) => {
                return (
                  <Select.Option key={value.val} value={value.val}>
                    {value.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="articlecontent"
            rules={[
              {
                required: true,
                message: "Nội dung không được trống!",
              },
            ]}
          >
            <SunEditor
              getSunEditorInstance={getSunEditorInstance}
              height="200"
              setOptions={{
                buttonList: [
                  ["undo", "redo"],
                  ["font", "fontSize", "formatBlock"],
                  ["bold", "italic", "underline", "strike"],
                  ["subscript", "superscript"],
                  ["fontColor", "hiliteColor"],
                  ["textStyle", "removeFormat"],
                  ["outdent", "indent", "align", "lineHeight"],
                  ["horizontalRule", "list", "table"],
                  ["link", "image", "video", "audio"],
                  ["fullScreen", "codeView", "preview", "print"],
                ],
              }}
              setContents={articlecontent}
              oonChange={(e) => setArticlecontent(e)}
            ></SunEditor>
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
                onConfirm={handleEditBlog}
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

export default EditBlog;
