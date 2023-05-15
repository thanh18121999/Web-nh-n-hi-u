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

const EditQA = ({ onCancel, value, dataToUpdate }) => {
  const { TextArea } = Input;
  const [answeruseremail, setAnswerUserEmail] = useState();
  const [form] = Form.useForm();
  const [dataEdit, setDataEdit] = useState({
    id: dataToUpdate.id,
    question: dataToUpdate.question,
    answer: dataToUpdate.answer,
  });
  useEffect(() => {
    setDataEdit(dataToUpdate);
  }, [dataToUpdate]);
  useEffect(() => {
    form.setFieldsValue({ question: dataEdit.question });
    form.setFieldsValue({ answer: dataEdit?.answer });
  }, [dataEdit]);
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
  const handleAnswerQA = async () => {
    if (!dataEdit.answer) {
      message.error("Câu trả lời không được trống");
    } else {
      let res = answerQA(
        dataEdit.id,
        dataEdit.answer,
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
          <Form.Item label="Câu hỏi" name="question">
            <Input
              name="question"
              onChange={onChangeForm}
              value={dataEdit.question}
            />
          </Form.Item>
          <Form.Item label="Câu trả lời" name="answer">
            <TextArea
              rows={6}
              name="answer"
              onChange={onChangeForm}
              value={dataEdit.answer}
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

export default EditQA;
