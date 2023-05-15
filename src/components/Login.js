import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "antd/dist/antd.css";
import "../index.css";
import {
  Form,
  Input,
  Button,
  Space,
  Image,
  Modal,
  Select,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { UserLogin, getMenuListByRole } from "../Service";

const Login = () => {
  let navigate = useNavigate();

  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: "",
  });
  const [visible, setVisible] = useState(false);
  const [listRole, setListRole] = useState([]);
  const [choSenRole, setChosenRole] = useState();
  async function checkRole() {
    let result = await UserLogin(dataLogin.username, dataLogin.password);
    if (
      result &&
      result != "INCORRECT_USER_NAME" &&
      result != "INCORRECT_PASSWORD" &&
      result != "LOGIN_FAIL"
    ) {
      if (result.responses.role.indexOf(",") > -1) {
        sessionStorage.setItem(
          "listrole",
          result.responses.role ? result.responses.role : 0
        );
        sessionStorage.setItem(
          "listroledescription",
          JSON.stringify(result.roleList) ? JSON.stringify(result.roleList) : 0
        );
        sessionStorage.setItem("roleuser", result.responses.role.split(",")[0]);
        setVisible(true);
        sessionStorage.setItem("token", result.responses.token);
        sessionStorage.setItem("iduser", result.responses.id);
        sessionStorage.setItem("username", dataLogin.username);
        sessionStorage.setItem("isActive", result.responses.status);
        sessionStorage.setItem("articleAvailable", result.responses.status);
        setListRole(JSON.parse(sessionStorage.getItem("listroledescription")));
      } else {
        sessionStorage.setItem("roleuser", result.responses.role);
        sessionStorage.setItem("token", result.responses.token);
        sessionStorage.setItem("iduser", result.responses.id);
        sessionStorage.setItem("username", dataLogin.username);
        sessionStorage.setItem("menuList", result.menuList);
        sessionStorage.setItem("isActive", result.responses.status);
        sessionStorage.setItem("articleAvailable", result.responses.status);
        navigate("/mainpage");
      }
    }
    if (result == "INCORRECT_USER_NAME") {
      message.error("Tên đăng nhập không chính xác");
    } else if (result == "INCORRECT_PASSWORD") {
      message.error("Mật khẩu không chính xác");
    } else if (result == "LOGIN_FAIL") {
      message.error("Đăng nhập thất bại");
    }
  }
  function cancelChooseRole() {
    setVisible(false);
    navigate("/");
  }
  async function login() {
    if (!choSenRole) {
      message.error("Hãy chọn quyền để đăng nhập");
    } else {
      let menuSelect = await getMenuListByRole(
        sessionStorage.getItem("roleuser")
      );
      sessionStorage.setItem(
        "menuList",
        menuSelect.responses.map((x) => x.menuid)
      );
      navigate("/mainpage");
    }
  }
  async function handleChangeSelect(e) {
    sessionStorage.setItem("roleuser", e);
    let menuChosen = await getMenuListByRole(
      sessionStorage.getItem("roleuser")
    );
    setChosenRole(menuChosen.responses.map((x) => x.description));
  }

  return (
    <Space
      direction="vertical"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* <p style={{ paddingTop: "2em", fontWeight: "bold" }}>
        Khoa Công Nghệ Sinh Học
      </p>
      <p style={{ fontWeight: "bold" }}>
        Trường Đại Học Quốc Tế - Đại Học Quốc Gia Thành phố Hồ Chí Minh
      </p> */}
      <Image
        style={{ margin: "4rem 0 4rem 0" }}
        width={150}
        src={
          "https://brandname.phuckhangnet.vn/images/header/logo_horizontal.png"
        }
      />
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Invalid Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            onChange={(e) =>
              setDataLogin({ ...dataLogin, username: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Invalid Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) =>
              setDataLogin({ ...dataLogin, password: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            onClick={checkRole}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title={<h5 className="text-secondary">Chọn quyền đăng nhập</h5>}
        centered
        visible={visible}
        width={800}
        footer={false}
        onCancel={cancelChooseRole}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn quyền đăng nhập"
          optionLabelProp="children"
          onChange={(e) => handleChangeSelect(e)}
        >
          {listRole?.map((value) => {
            return (
              <Select.Option
                key={value.code}
                value={value.code}
                label={value.code + "-" + value.description}
              >
                {value.code} - {value.description}
              </Select.Option>
            );
          })}
        </Select>
        {/* {!choSenRole ? null : (
          <p style={{ fontWeight: "bold", marginTop: "1rem" }}>
            Bạn đang chọn quyền: <a style={{ color: "red" }}>{choSenRole[0]}</a>
          </p>
        )} */}

        <Button
          type="primary"
          style={{ marginTop: "2rem", marginLeft: "40.8rem" }}
          onClick={login}
        >
          Đăng nhập
        </Button>
      </Modal>
    </Space>
  );
};
export default Login;
