import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Form, Popconfirm, List, message } from "antd";
import React, { useState, useEffect } from "react";
const UploadFileLib = ({ onCancel }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [deleteF, setDeleteF] = useState();
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

  const [selectedFile, setSelectedFile] = useState([]);
  function handleChangeImage(e) {
    setSelectedFile(Array.from(e.target.files));
  }
  const UploadImage = async (e) => {
    if (selectedFile == undefined || selectedFile == "") {
      message.error("Hãy chọn ít nhất 1 file");
    } else if (selectedFile.size > 31457280) {
      message.error("File ảnh không được vượt quá 30MB");
    } else {
      for (var i = 0; i < selectedFile.length; i++) {
        const formData = new FormData();
        var iduser = JSON.parse(sessionStorage.getItem("iduser"));
        formData.append("ID_User", iduser);
        formData.append("My_File", selectedFile[i]);
        formData.append("File_Name", "li");
        await fetch(
          "https://brandname.phuckhangnet.vn/api/upload/verify_upload",
          {
            // headers: {
            //   "Content-Type": "application/x-www-form-urlencoded",
            // },
            method: "POST",
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((data) => {
            message.success("Tải thành công file " + data + " lên thư viện");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      onCancel();
      setSelectedFile();
      form.resetFields(["upload"]);
    }
    setVisible(false);
  };
  useEffect(() => {
    setSelectedFile(selectedFile.filter((x) => x.name !== deleteF?.name));
    form.setFieldsValue("files", selectedFile);
  }, [deleteF]);
  function handleDeleteAll() {
    setSelectedFile();
    form.resetFields(["files"]);
  }
  return (
    <div className="create-group">
      <p style={{ fontWeight: "bold", fontSize: "40", color: "red" }}>
        Số lượng file tối đa: 10, Dung lượng tối đa: 30MB/file
      </p>
      <Form layout="vertical" name="control-hooks" form={form}>
        <Form.Item name="files">
          <input
            type="file"
            name="files"
            multiple="multiple"
            onChange={(e) => {
              handleChangeImage(e);
              form.resetFields(["files"]);
            }}
          />
        </Form.Item>
        <Form.Item name="listUpload">
          <List
            itemLayout="horizontal"
            dataSource={selectedFile}
            renderItem={(item, index) => (
              <List.Item>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {item.name}
                  <DeleteOutlined
                    style={{
                      color: "red",
                      paddingTop: "0.5em",
                    }}
                    onClick={() => {
                      setDeleteF(item);
                    }}
                  />
                </div>
              </List.Item>
            )}
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
              Đóng
            </Button>
            <Button type="primary" onClick={handleDeleteAll}>
              Làm mới
            </Button>
            <Popconfirm
              title="Xác nhận tải hình ảnh lên thư viện?"
              onConfirm={UploadImage}
              onCancel={cancel}
              okText="Xác nhận"
              cancelText="Hủy"
              visible={visible}
            >
              <Button type="primary" onClick={showPopconfirm}>
                Tải tệp lên
              </Button>
            </Popconfirm>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UploadFileLib;
