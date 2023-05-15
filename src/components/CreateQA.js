import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Form,
  Input,
  Select,
  Checkbox,
  Typography,
  message,
} from "antd";
import { CreateQASample, getMenuList } from "../Service";

const CreateQA = ({ onCancel, value }) => {
  const [form] = Form.useForm();
  const { Text } = Typography;
  const { TextArea } = Input;

  const [dataCreate, setDataCreate] = useState({
    question: "",
    answer: "",
  });
  const [checkDictionary, setCheckDictionary] = useState(false);

  const CreateNewQASample = async () => {
    if (!dataCreate.question) {
      message.error("Câu hỏi không được trống");
    } else if (!dataCreate.answer) {
      message.error("Câu trả lời không được trống");
    } else {
      let res = await CreateQASample(
        dataCreate.question,
        dataCreate.answer,
        onCancel
      );
      if (res.statuscode == 200) {
        setDataCreate({
          ...dataCreate,
          question: "",
          answer: "",
        });
        form.resetFields(["question"]);
        form.resetFields(["answer"]);
        message.success("Thêm mục hỏi/đáp mẫu thành công");
      } else {
        message.error("Thêm mục hỏi/đáp mẫu thất bại");
      }
    }
  };
  // const onChange = (e) => {
  //   setCheckDictionary(e.target.checked);
  // };
  return (
    <div className="create-group">
      <Form
        layout="vertical"
        name="control-hooks"
        form={form}
        onFinish={CreateNewQASample}
      >
        {/* <Form.Item name="isDictionary">
          <Checkbox onChange={onChange} defaultChecked={false}>
            Câu hỏi mẫu mới
          </Checkbox>
        </Form.Item> */}
        {/* {checkDictionary == false ? (
          <>
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[
                {
                  required: true,
                  message: "Người hỏi không được trống!",
                },
              ]}
            >
              <Input
                name="name"
                placeholder="Nhập họ và tên"
                // onChange={(e) =>
                //   setDataCreate({ ...dataCreate, name: e.target.value })
                // }
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được trống!",
                },
              ]}
            >
              <Input
                name="phone"
                placeholder="Nhập số điện thoại"
                // onChange={(e) =>
                //   setDataCreate({ ...dataCreate, phone: e.target.value })
                // }
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Email không được trống!",
                },
              ]}
            >
              <Input
                name="email"
                placeholder="Nhập email"

                // onChange={(e) =>
                //   setDataCreate({ ...dataCreate, email: e.target.value })
                // }
              />
            </Form.Item>
          </>
        ) : null} */}
        <Form.Item
          label="Câu hỏi"
          name="question"
          rules={[
            {
              required: true,
              message: "Câu hỏi không được trống!",
            },
          ]}
        >
          <Input
            name="question"
            placeholder="Nhập câu hỏi"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, question: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          label="Câu trả lời"
          name="answer"
          rules={[
            {
              required: true,
              message: "Câu trả lời không được trống!",
            },
          ]}
        >
          <TextArea
            rows={6}
            name="answer"
            placeholder="Nhập câu trả lời"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, answer: e.target.value })
            }
          />
        </Form.Item>
        {/* {checkDictionary == true ? (
          <Form.Item
            label="Câu trả lời"
            name="name"
            rules={[
              {
                required: true,
                message: "Câu trả lời không được trống!",
              },
            ]}
          >
            <Input
              name="name"
              placeholder="Nhập câu trả lời"
              onChange={(e) =>
                setDataCreate({ ...dataCreate, answer: e.target.value })
              }
            />
          </Form.Item>
        ) : null} */}
        {/* {checkDictionary == false ? (
          <Form.Item label="Chỉ định chuyên gia trả lời">
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn chuyên gia trả lời"
              //onChange={(e) => }
            ></Select>
          </Form.Item>
        ) : null} */}
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
              Tạo mục hỏi/đáp mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateQA;
