import React, { useState, useRef } from "react";
import { Button, Space, Form, Input, Select, message } from "antd";
import { AddBlog } from "../Service";
import SunEditor from "suneditor-react";
import "suneditor/src/assets/css/suneditor.css";

const CreateBlog = ({ onCancel, value }) => {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  const [form] = Form.useForm();
  const [dataCreate, setDataCreate] = useState({
    title: "",
    hastag: "",
    language: "vn",
  });
  const [articlecontent, setArticlecontent] = useState("");
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  const preview = () => {
    if (!dataCreate.title) {
      message.error("Tiêu đề không được trống");
    } else if (!articlecontent) {
      message.error("Nội dung không được trống");
    } else {
      var objPreview = {
        message: "success",
        statuscode: "200",
        responses: [
          {
            id: "temp",
            title: dataCreate.title,
            articlecontent: articlecontent.replace(/"/g, "'"),
            hastag: dataCreate.hastag,
            createdate: day + "-" + month + "-" + year,
            latesteditdate: day + "-" + month + "-" + year,
            avatar: "ava",
            language: "vn",
            summary: dataCreate.summary,
            countrow: 1,
          },
        ],
      };
      localStorage.setItem("sessionpost", JSON.stringify(objPreview));
      var localStorageData = localStorage.getItem(["sessionpost"]);
      if (localStorageData) {
        window.open(window.location.origin + "?page-name=single-post");
      }
    }
  };
  const CreateNewBlog = async () => {
    if (!dataCreate.title) {
      message.error("Tiêu đề không được trống");
    } else if (!articlecontent) {
      message.error("Nội dung không được trống");
    } else {
      let res = AddBlog(
        dataCreate.title,
        articlecontent,
        dataCreate.hastag,
        dataCreate.language,
        onCancel
      );
      if ((res.statuscode = 200)) {
        setDataCreate({
          ...dataCreate,
          title: "",
          hastag: "",
          language: "vn",
        });
        setArticlecontent("");
        form.resetFields(["title"]);
        form.resetFields(["hastag"]);
        form.resetFields(["language"]);
        form.resetFields(["article_content"]);
        message.success("Thêm bài viết thành công");
      } else {
        message.error("Thêm bài viết thất bại");
      }
    }
  };

  return (
    <div className="create-group">
      <Form
        layout="vertical"
        name="control-hooks"
        form={form}
        onFinish={CreateNewBlog}
      >
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
            name="TITLE"
            placeholder="Nhập tiêu đề bài viết"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, title: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Hastag" name="hastag">
          <Input
            name="HASTAG"
            prefix="#"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, hastag: "#" + e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Ngôn ngữ" name="language">
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn ngôn ngữ"
            defaultValue={"vn"}
            options={[
              { value: "vn", label: "Tiếng Việt" },
              { value: "en", label: "English" },
            ]}
            onChange={(e) => setDataCreate({ ...dataCreate, language: e })}
          />
        </Form.Item>
        <Form.Item
          label="Nội dung"
          name="article_content"
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
            onChange={(e) => setArticlecontent(e)}
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
            <Button type="primary" onClick={preview}>
              Xem trước
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo bài viết mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBlog;
