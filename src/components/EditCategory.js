import React, { useState, useEffect, useRef } from "react";
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
import { UpdateArticle } from "../Service";
import SunEditor from "suneditor-react";
import "suneditor/src/assets/css/suneditor.css";

const { SHOW_PARENT } = TreeSelect;
const { TextArea } = Input;

const EditCategory = ({ onCancel, value, dataToUpdate }) => {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  const [form] = Form.useForm();
  const [dataEdit, setDataEdit] = useState({
    id: dataToUpdate.id,
    avatar: dataToUpdate.avatar,
    title: dataToUpdate.title,
    summary: dataToUpdate.summary,
    hastag: dataToUpdate.hastag,
    menu: dataToUpdate.menu,
    language: dataToUpdate.language,
    articlecontent: dataToUpdate.articlecontent,
  });
  const [articlecontent, setArticlecontent] = useState("");
  useEffect(() => {
    setArticlecontent(dataToUpdate?.articlecontent);
    setDataEdit(dataToUpdate);
  }, [dataToUpdate]);
  useEffect(() => {
    form.setFieldsValue({ title: dataEdit.title });
    form.setFieldsValue({ summary: dataEdit.summary });
    form.setFieldsValue({ hastag: dataEdit.hastag.replace("#", "") });
    form.setFieldsValue({ menu: dataEdit?.menu });
    form.setFieldsValue({ language: dataEdit?.language });
  }, [dataEdit]);
  const handleChangeSelect = (e) => {
    setDataEdit({ ...dataEdit, language: e });
  };
  const onChangeForm = (e) => {
    setDataEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const menu = JSON.parse(sessionStorage.getItem("menuCategory"));

  const [selectedFile, setSelectedFile] = useState();

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

  function handleChangeImage(e) {
    if (e.target.files[0]?.size > 10485760) {
      message.error("Avatar không được vượt quá 10MB");
    } else {
      setSelectedFile(e.target.files[0]);
      const formData = new FormData();
      var iduser = JSON.parse(sessionStorage.getItem("iduser"));
      formData.append("ID_User", iduser);
      formData.append("My_File", e.target.files[0]);
      formData.append("File_Name", "aa");
      fetch("https://brandname.phuckhangnet.vn/api/upload/verify_upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setDataEdit({ ...dataEdit, avatar: data.toString() });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  const handleEditArticle = async () => {
    if (!dataEdit.title) {
      message.error("Tiêu đề không được trống");
    } else if (!articlecontent) {
      message.error("Nội dung không được trống");
    } else if (dataEdit.menu.length == 0) {
      message.error("Menu không được trống");
    } else if (dataEdit.avatar[0] == "") {
      message.error("Avatar không được trống");
    } else if (selectedFile?.size > 10485760) {
      message.error("Avatar không được vượt quá 10MB");
    } else {
      let res = UpdateArticle(
        dataEdit.id,
        dataEdit.title,
        articlecontent,
        dataEdit.hastag,
        dataEdit.menu,
        dataEdit.avatar,
        dataEdit.language,
        dataEdit.summary,
        onCancel
      );
      if ((res.statuscode = 200)) {
        form.resetFields(["avatar"]);
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

  const [treeval, setTreeval] = useState(undefined);
  const onChange = (newValue) => {
    setTreeval(newValue);
    setDataEdit({ ...dataEdit, menu: newValue });
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
    initialvalues: dataEdit.menu,
  };
  return (
    <>
      <div className="edit-group">
        <Form layout="vertical" name="control-hooks" form={form}>
          <Form.Item label="Avatar" name="avatar">
            <input type="file" name="avatar" onChange={handleChangeImage} />
            <img
              src={
                "https://brandname.phuckhangnet.vn/ftp_images/" +
                dataEdit.avatar
              }
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
              name="title"
              placeholder="Nhập tiêu đề bài viết"
              onChange={onChangeForm}
              value={dataEdit.title}
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
              onChange={(e) => {
                setDataEdit({ ...dataEdit, summary: e.target.value });
              }}
              value={dataEdit.summary}
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
          <Form.Item
            label="Menu"
            name="menu"
            rules={[
              {
                required: true,
                message: "Menu không được trống!",
              },
            ]}
          >
            <TreeSelect {...tProps} />
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
              <Popconfirm
                title="Xác nhận chỉnh sửa?"
                onConfirm={handleEditArticle}
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

export default EditCategory;
