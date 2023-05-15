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
import { UpdateBlog, answerQA } from "../Service";
import SunEditor from "suneditor-react";
import "suneditor/src/assets/css/suneditor.css";

const AssignNewExpertQA = ({ onCancel, value, dataToAssign }) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [dataAssign, setdataAssign] = useState({
    id: dataToAssign.id,
    question: dataToAssign.question,
  });
  useEffect(() => {
    setdataAssign(dataToAssign);
  }, [dataToAssign]);
  useEffect(() => {
    form.setFieldsValue({ question: dataAssign.question });
  }, [dataAssign]);
  const onChangeForm = (e) => {
    setdataAssign((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
  //   const handleAnswerQA = async () => {
  //     if (!dataAnswer.answer) {
  //       message.error("Câu trả lời không được trống");
  //     } else {
  //       let res = answerQA(
  //         dataAnswer.id,
  //         dataAnswer.answer,
  //         answeruseremail,
  //         onCancel
  //       );
  //       if ((res.statuscode = 200)) {
  //         setVisible(false);
  //         message.success("Trả lời câu hỏi thành công");
  //       } else {
  //         setVisible(false);
  //         message.error("Trả lời câu hỏi thất bại");
  //       }
  //     }
  //   };

  return (
    <>
      <div className="edit-group">
        <Form layout="vertical" name="control-hooks" form={form}>
          <div>
            <Form.Item label="Câu hỏi:" name="question">
              <p style={{ fontWeight: "bold" }}>{dataAssign.question}</p>
            </Form.Item>
          </div>
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
                //onConfirm={handleAnswerQA}
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

export default AssignNewExpertQA;
