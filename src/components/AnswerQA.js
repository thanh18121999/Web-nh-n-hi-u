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

const AnswerQA = ({ onCancel, value, dataToUpdate }) => {
  const { TextArea } = Input;
  const [answeruseremail, setAnswerUserEmail] = useState();
  const [form] = Form.useForm();
  const [dataAnswer, setdataAnswer] = useState({
    id: dataToUpdate.id,
    question: dataToUpdate.title,
    answer: dataToUpdate.articlecontent,
  });
  useEffect(() => {
    setdataAnswer(dataToUpdate);
  }, [dataToUpdate]);
  useEffect(() => {
    form.setFieldsValue({ question: dataAnswer.question });
    form.setFieldsValue({ answer: dataAnswer?.answer });
  }, [dataAnswer]);
  const onChangeForm = (e) => {
    setdataAnswer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
  const handleAnswerQA = async () => {
    if (!dataAnswer.answer) {
      message.error("Câu trả lời không được trống");
    } else {
      let res = answerQA(
        dataAnswer.id,
        dataAnswer.answer,
        answeruseremail,
        onCancel
      );
      if ((res.statuscode = 200)) {
        setVisible(false);
        message.success("Trả lời câu hỏi thành công");
      } else {
        setVisible(false);
        message.error("Trả lời câu hỏi thất bại");
      }
    }
  };

  return (
    <>
      <div className="edit-group">
        <Form layout="vertical" name="control-hooks" form={form}>
          <div>
            <Form.Item label="Câu hỏi:" name="question">
              <p style={{ fontWeight: "bold" }}>{dataAnswer.question}</p>
            </Form.Item>
            <Form.Item label="Câu trả lời:" name="answer">
              <TextArea
                rows={6}
                name="answer"
                onChange={onChangeForm}
                value={dataAnswer.answer}
              />
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
                onConfirm={handleAnswerQA}
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

export default AnswerQA;
