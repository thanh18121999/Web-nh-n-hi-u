import React, { useState, useRef } from "react";
import { Button, Space, Form, Input, TreeSelect, Select, message } from "antd";
import { AddArticle } from "../Service";
import SunEditor from "suneditor-react";
import "suneditor/src/assets/css/suneditor.css";

const { SHOW_PARENT } = TreeSelect;
const { TextArea } = Input;

const CreateCategory = ({ onCancel, value }) => {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  const [form] = Form.useForm();
  const menu = sessionStorage.getItem("menuCategory")
    ? JSON.parse(sessionStorage.getItem("menuCategory"))
    : [];

  const [selectedFile, setSelectedFile] = useState([]);
  const [view, setView] = useState([]);
  const [dataCreate, setDataCreate] = useState({
    avatar: [""],
    title: "",
    summary: "",
    hastag: "",
    menu: [],
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
    } else if (dataCreate.menu.length == 0) {
      message.error("Menu không được trống");
    } else if (dataCreate.avatar.length == 0) {
      message.error("Avatar không được trống");
    } else if (selectedFile?.size > 10485760) {
      message.error("Avatar không được vượt quá 10MB");
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
  async function CreateNewArticle() {
    if (!dataCreate.title) {
      message.error("Tiêu đề không được trống");
    } else if (!articlecontent) {
      message.error("Nội dung không được trống");
    } else if (dataCreate.menu.length == 0) {
      message.error("Menu không được trống");
    } else if (selectedFile?.length == 0) {
      message.error("Avatar không được trống");
    } else if (selectedFile?.size > 10485760) {
      message.error("Avatar không được vượt quá 10MB");
    } else {
      let result = await AddArticle(
        dataCreate.avatar[0],
        dataCreate.title,
        dataCreate.summary,
        dataCreate.hastag,
        dataCreate.menu,
        dataCreate.language,
        articlecontent,
        onCancel
      );
      if ((result.statuscode = 200)) {
        setDataCreate({
          ...dataCreate,
          avatar: [""],
          title: "",
          summary: "",
          hastag: "",
          menu: [],
          language: "vn",
        });
        setArticlecontent("");
        setView([]);
        setSelectedFile([]);
        form.resetFields(["avatar"]);
        form.resetFields(["title"]);
        form.resetFields(["summary"]);
        form.resetFields(["hastag"]);
        form.resetFields(["menu"]);
        form.resetFields(["language"]);
        form.resetFields(["article_content"]);
        message.success("Thêm bài viết thành công");
      } else {
        message.error("Thêm bài viết thất bại");
      }
    }
  }

  function handleChangeImage(e) {
    if (e.target.files[0]?.size > 10485760) {
      message.error("Avatar không được vượt quá 10MB");
    } else {
      setSelectedFile(e.target.files[0]);
      setView(URL.createObjectURL(e.target.files[0]));
      const formDataAvatar = new FormData();
      var iduser = JSON.parse(sessionStorage.getItem("iduser"));
      formDataAvatar.append("ID_User", iduser);
      formDataAvatar.append("My_File", e.target.files[0]);
      formDataAvatar.append("File_Name", "aa");
      fetch("https://brandname.phuckhangnet.vn/api/upload/verify_upload", {
        method: "POST",
        body: formDataAvatar,
      })
        .then((response) => response.json())
        .then((data) => {
          setDataCreate({ ...dataCreate, avatar: data });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  const [treeval, setTreeval] = useState(undefined);
  const onChange = (newValue) => {
    setTreeval(newValue);
    setDataCreate({ ...dataCreate, menu: newValue });
  };
  const treeData = menu;
  const tProps = {
    treeData,
    treeval,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "100%",
    },
  };
  return (
    <div className="create-group">
      <Form
        layout="vertical"
        name="control-hooks"
        form={form}
        onFinish={CreateNewArticle}
      >
        <Form.Item label="Avatar" name="avatar">
          <input type="file" onChange={handleChangeImage} />
          <img
            src={view}
            style={{
              height: "10em",
              width: "auto",
              objectFit: "contain",
              marginTop: "1em",
            }}
          />
        </Form.Item>
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
        <Form.Item
          label="Sơ lược"
          name="summary"
          rules={[
            {
              required: true,
              message: "Sơ lược không được trống!",
            },
          ]}
        >
          <TextArea
            name="SUMMARY"
            placeholder="Sơ lược bài viết"
            maxLength={500}
            onChange={(e) =>
              setDataCreate({ ...dataCreate, summary: e.target.value })
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
        <Form.Item
          label="Danh mục"
          name="menu"
          rules={[
            {
              required: true,
              message: "Menu không được trống!",
            },
          ]}
        >
          <TreeSelect
            {...tProps}
            filterTreeNode={(search, item) => {
              return (
                item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
              );
            }}
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

export default CreateCategory;
