import {
  Button,
  Space,
  Form,
  Input,
  Select,
  Popconfirm,
  Typography,
  message,
} from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import {
  getRoleList,
  getPositionList,
  getTitleList,
  getDepartmentList,
  AddUser,
} from "../Service";
import SunEditor from "suneditor-react";
import "suneditor/src/assets/css/suneditor.css";

const CreateUser = ({ onCancel }) => {
  const { Text } = Typography;
  const { TextArea } = Input;
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  const [form] = Form.useForm();
  const [dataCreate, setDataCreate] = useState({
    username: "",
    password: "",
    role: "",
    avatar: [],
    name: "",
    phone: "",
    email: "",
    aboutme: "",
    // position: [],
    // title: [],
    // department: [],
    // education: "",
    // office: "",
    // major: "",
    // language: "vn",
  });
  // const [research, setResearch] = useState("");
  // const [supervision, setSupervision] = useState("");
  // const [publication, setPublication] = useState("");
  // const [teachingcourse, setTeachingcourse] = useState("");
  const [roleList, setRoleList] = useState([]);
  async function getRoleListAPI() {
    let res = await getRoleList();
    if (res) {
      setRoleList(
        res.responses.map((x, index) => ({
          ...x,
          key: index,
          ordinal: index + 1,
        }))
      );
    }
  }
  useEffect(() => {
    getRoleListAPI();
  }, []);
  // const [positionList, setPositionList] = useState([]);
  // async function getPositionListAPI() {
  //   let res = await getPositionList();
  //   if (res) {
  //     setPositionList(
  //       res.responses.map((x, index) => ({
  //         ...x,
  //         key: index,
  //         ordinal: index + 1,
  //       }))
  //     );
  //   }
  // }
  // useEffect(() => {
  //   getPositionListAPI();
  // }, []);
  // const [titleList, setTitleList] = useState([]);
  // async function getTitleListAPI() {
  //   let res = await getTitleList();
  //   if (res) {
  //     setTitleList(
  //       res.responses.map((x, index) => ({
  //         ...x,
  //         key: index,
  //         ordinal: index + 1,
  //       }))
  //     );
  //   }
  // }
  // useEffect(() => {
  //   getTitleListAPI();
  // }, []);
  // const [departmentList, setDepartmentList] = useState([]);
  // async function getDepartmentListAPI() {
  //   let res = await getDepartmentList();
  //   if (res) {
  //     setDepartmentList(
  //       res.responses.map((x, index) => ({
  //         ...x,
  //         key: index,
  //         ordinal: index + 1,
  //       }))
  //     );
  //   }
  // }
  // useEffect(() => {
  //   getDepartmentListAPI();
  // }, []);
  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [view, setView] = useState([]);
  function handleChangeImage(e) {
    if (e.target.files[0].size > 10485760) {
      message.error("Avatar không được vượt quá 10MB");
    } else {
      setSelectedFile(e.target.files[0]);
      setView(URL.createObjectURL(e.target.files[0]));
      const formDataAvatar = new FormData();
      var iduser = JSON.parse(sessionStorage.getItem("iduser"));
      formDataAvatar.append("ID_User", iduser);
      formDataAvatar.append("My_File", e.target.files[0]);
      formDataAvatar.append("File_Name", "ua");
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
  async function CreateNewUser() {
    if (dataCreate.avatar.length == 0) {
      message.error("Avatar không được trống");
    } else if (selectedFile?.size > 10485760) {
      message.error("Avatar không được vượt quá 10MB");
    } else if (dataCreate.username == "") {
      message.error("Tài khoản không được trống");
    } else if (dataCreate.password == "") {
      message.error("Mật khẩu không được trống");
    } else if (dataCreate.role.length == 0) {
      message.error("Quyền không được trống");
    } else if (dataCreate.name == "") {
      message.error("Tên người dùng không được trống");
    } else if (dataCreate.phone == "") {
      message.error("Số điện thoại người dùng không được trống");
    } else if (dataCreate.email == "") {
      message.error("Email người dùng không được trống");
    }
    // else if (dataCreate.position.length == 0) {
    //   message.error("Chức vụ không được trống");
    // } else if (dataCreate.department.length == 0) {
    //   message.error("Bộ môn không được trống");
    // }
    else {
      let res = await AddUser(
        dataCreate.username,
        dataCreate.password,
        dataCreate.role.join(","),
        dataCreate.avatar[0],
        dataCreate.name,
        dataCreate.phone,
        dataCreate.email,
        dataCreate.aboutme,
        // dataCreate.position,
        // dataCreate.title,
        // dataCreate.department,
        // dataCreate.education,
        // dataCreate.office,
        // dataCreate.major,
        // dataCreate.language,
        // research,
        // supervision,
        // publication,
        // teachingcourse,
        onCancel
      );
      if (res?.statuscode == 200) {
        setDataCreate({
          ...dataCreate,
          username: "",
          password: "",
          role: "",
          avatar: [""],
          name: "",
          phone: "",
          email: "",
          aboutme: "",
          // position: [""],
          // title: [""],
          // department: [""],
          // education: "",
          // office: "",
          // major: "",
          // language: "vn",
        });
        // setResearch("");
        // setSupervision("");
        // setPublication("");
        // setTeachingcourse("");
        setView([]);
        form.resetFields(["username"]);
        form.resetFields(["password"]);
        form.resetFields(["role"]);
        form.resetFields(["avatar"]);
        form.resetFields(["name"]);
        form.resetFields(["phone"]);
        form.resetFields(["email"]);
        form.resetFields(["aboutme"]);
        // form.resetFields(["position"]);
        // form.resetFields(["title"]);
        // form.resetFields(["department"]);
        // form.resetFields(["education"]);
        // form.resetFields(["office"]);
        // form.resetFields(["major"]);
        // form.resetFields(["research"]);
        // form.resetFields(["supervision"]);
        // form.resetFields(["publication"]);
        // form.resetFields(["teachingcourse"]);
        setVisible(false);
        message.success("Thêm người dùng thành công");
      } else if (res == "USER_INFO_ALREADY_EXIST") {
        setVisible(false);
        message.error("Thông tin người dùng đã tồn tại");
      } else {
        setVisible(false);
        message.error("Thêm người dùng thất bại");
      }
    }
  }

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
  return (
    <div className="create-group">
      <Form layout="vertical" name="control-hooks" form={form}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Thông tin tài khoản
        </Text>
        <Form.Item
          name="username"
          label="Tài khoản"
          rules={[
            {
              required: true,
              message: "Tài khoản không được trống!",
            },
            { min: 4, message: "Tài khoản quá ngắn!" },
            { max: 14, message: "Tài khoản quá dài!" },
            {
              pattern: new RegExp("^[A-Za-z]\\w{4,14}$"),
              message: "Tên tài khoản không hợp lệ!",
            },
          ]}
        >
          <Input
            name="username"
            placeholder="Nhập tên tài khoản"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, username: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={
            "Mật khẩu (mật khẩu phải chứa từ 8 đến 20 ký tự và phải chứa ít nhất một chữ thường, chữ in hoa, số và ký tự đặc biệt)"
          }
          rules={[
            {
              required: true,
              message: "Mật khẩu không được trống!",
            },
            {
              min: 8,
              message: "Mật khẩu quá ngắn!",
            },
            { max: 20, message: "Mật khẩu quá dài!" },
            {
              pattern: new RegExp(
                "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
              ),
              message: "Mật khẩu không hợp lệ!",
            },
          ]}
        >
          <Input.Password
            name="password"
            placeholder="Nhập mật khẩu"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) =>
              setDataCreate({ ...dataCreate, password: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Chọn quyền">
          <Select
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Chọn quyền"
            onChange={(e) => setDataCreate({ ...dataCreate, role: e })}
            mode="multiple"
          >
            {roleList.map((value) => {
              return (
                <Select.Option key={value.code} value={value.code}>
                  {value.description}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Thông tin cá nhân
        </Text>
        <Form.Item label="Avatar">
          <input type="file" name="avatar" onChange={handleChangeImage} />
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
          name="name"
          label="Họ tên người dùng"
          rules={[
            {
              required: true,
              message: "Họ tên không được trống!",
            },
            {
              max: 100,
              message: "Họ tên quá dài!",
            },
          ]}
        >
          <Input
            name="name"
            placeholder="Nhập tên người dùng"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, name: e.target.value })
            }
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
            {
              min: 10,
              message: "Số điện thoại không hợp lệ!",
            },
            {
              max: 12,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input
            name="phone"
            placeholder="Nhập số điện thoại"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, phone: e.target.value })
            }
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
            {
              type: "email",
              message: "Email không hợp lệ!",
            },
          ]}
        >
          <Input
            name="email"
            placeholder="Nhập email"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, email: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item name="aboutme" label="Giới thiệu">
          <TextArea
            name="aboutme"
            placeholder="Giới thiệu"
            maxLength={500}
            onChange={(e) =>
              setDataCreate({ ...dataCreate, aboutme: e.target.value })
            }
          ></TextArea>
        </Form.Item>
        {/* <Form.Item label="Chức vụ" name="position">
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn chức vụ"
            mode="multiple"
            onChange={(e) => setDataCreate({ ...dataCreate, position: e })}
          >
            {positionList.map((value) => {
              return (
                <Select.Option key={value.code} value={value.code}>
                  {value.description}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Học vị" name="title">
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn học vị"
            mode="multiple"
            onChange={(e) => setDataCreate({ ...dataCreate, title: e })}
          >
            {titleList.map((value) => {
              return (
                <Select.Option key={value.code} value={value.code}>
                  {value.description}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Bộ môn" name="department">
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn bộ môn"
            mode="multiple"
            onChange={(e) => setDataCreate({ ...dataCreate, department: e })}
          >
            {departmentList.map((value) => {
              return (
                <Select.Option key={value.code} value={value.code}>
                  {value.description}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="education" label="Bằng cấp">
          <TextArea
            name="education"
            placeholder="Thông tin bằng cấp"
            maxLength={350}
            onChange={(e) =>
              setDataCreate({ ...dataCreate, education: e.target.value })
            }
          ></TextArea>
        </Form.Item>
        <Form.Item name="office" label="Văn phòng">
          <Input
            name="office"
            placeholder="Văn phòng làm việc"
            onChange={(e) =>
              setDataCreate({ ...dataCreate, office: e.target.value })
            }
          ></Input>
        </Form.Item>
        <Form.Item name="major" label="Chuyên ngành">
          <TextArea
            name="major"
            placeholder="Thông tin chuyên ngành"
            maxLength={300}
            onChange={(e) =>
              setDataCreate({ ...dataCreate, major: e.target.value })
            }
          ></TextArea>
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
        <Form.Item label="Nghiên cứu" name="research">
          <SunEditor
            getSunEditorInstance={getSunEditorInstance}
            height="100"
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
            onChange={(e) => setResearch(e)}
          ></SunEditor>
        </Form.Item>
        <Form.Item label="Đề tài ứng dụng" name="supervision">
          <SunEditor
            getSunEditorInstance={getSunEditorInstance}
            height="100"
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
            onChange={(e) => setSupervision(e)}
          ></SunEditor>
        </Form.Item>
        <Form.Item label="Ấn phẩm xuất bản" name="publication">
          <SunEditor
            getSunEditorInstance={getSunEditorInstance}
            height="100"
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
            onChange={(e) => setPublication(e)}
          ></SunEditor>
        </Form.Item>
        <Form.Item label="Môn giảng dạy" name="teachingcourse">
          <SunEditor
            getSunEditorInstance={getSunEditorInstance}
            height="100"
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
                ["fullScreen"],
              ],
            }}
            onChange={(e) => setTeachingcourse(e)}
          ></SunEditor>
        </Form.Item> */}
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
              title="Xác nhận thêm người dùng?"
              onConfirm={CreateNewUser}
              onCancel={cancel}
              okText="Xác nhận"
              cancelText="Hủy"
              visible={visible}
            >
              <Button type="primary" onClick={showPopconfirm}>
                Thêm người dùng
              </Button>
            </Popconfirm>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUser;
