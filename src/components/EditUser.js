import {
  Button,
  Space,
  Form,
  Input,
  Popconfirm,
  Select,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  UpdateUser,
  getRoleList,
  // getPositionList,
  // getTitleList,
  // getDepartmentList,
} from "../Service";

const EditUser = ({ dataToUpdate, onCancel }) => {
  const { Text } = Typography;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dataDetailEdit, setDataDetailEdit] = useState({
    name: dataToUpdate.detail.name,
    phone: dataToUpdate.detail.phone,
    email: dataToUpdate.detail.email,
    aboutme: dataToUpdate.detail.aboutme,
    // education: dataToUpdate.detail.education,
    // office: dataToUpdate.detail.office,
    // major: dataToUpdate.detail.major,
    // research: dataToUpdate.detail.research,
    // supervision: dataToUpdate.detail.supervision,
    // publication: dataToUpdate.detail.publication,
    // teachingcourse: dataToUpdate.detail.teachingcourse,
    // language: "vn",
  });
  // const [research, setResearch] = useState("");
  // const [supervision, setSupervision] = useState("");
  // const [publication, setPublication] = useState("");
  // const [teachingcourse, setTeachingcourse] = useState("");
  // const [position, setPosition] = useState([]);
  // const [title, setTitle] = useState([]);
  // const [department, setDepartment] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [avatar, setAvatar] = useState();
  const [updateId, setUpdateID] = useState();
  useEffect(() => {
    setDataDetailEdit(dataToUpdate.detail);
    setSelectedValue(dataToUpdate.role?.split(","));
    setAvatar(dataToUpdate.avatar);
    setUpdateID(dataToUpdate.id);
    // setPosition(dataToUpdate.position?.code.split(", "));
    // setTitle(dataToUpdate.title?.code.split(", "));
    // setDepartment(dataToUpdate.department?.code.split(", "));
    // setResearch(dataToUpdate.detail?.research);
    // setSupervision(dataToUpdate.detail?.supervision);
    // setPublication(dataToUpdate.detail?.publication);
    // setTeachingcourse(dataToUpdate.detail?.teachingcourse);
  }, [dataToUpdate]);
  useEffect(() => {
    form.setFieldsValue({ name: dataDetailEdit.name });
    form.setFieldsValue({ phone: dataDetailEdit.phone });
    form.setFieldsValue({ email: dataDetailEdit.email });
    form.setFieldsValue({ aboutme: dataDetailEdit?.aboutme });
    // form.setFieldsValue({ position: position });
    // form.setFieldsValue({ title: title });
    // form.setFieldsValue({ department: department });
    // form.setFieldsValue({ education: dataDetailEdit?.education });
    // form.setFieldsValue({ office: dataDetailEdit?.office });
    // form.setFieldsValue({ major: dataDetailEdit?.major });
    // form.setFieldsValue({ language: dataDetailEdit?.language });
  }, [dataDetailEdit]);
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
  const onChange = (e) => {
    setDataDetailEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleChangeSelect = (e) => {
    setSelectedValue(e);
  };
  const [selectedFile, setSelectedFile] = useState();
  function handleChangeImage(e) {
    if (e.target.files[0]?.size > 10485760) {
      message.error("Avatar không được vượt quá 10MB");
    } else {
      setSelectedFile(e.target.files[0]);
      const formData = new FormData();
      var iduser = JSON.parse(sessionStorage.getItem("iduser"));
      formData.append("ID_User", iduser);
      formData.append("My_File", e.target.files[0]);
      formData.append("File_Name", "ua");
      fetch("https://brandname.phuckhangnet.vn/api/upload/verify_upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setAvatar(data.toString());
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  async function EditUser() {
    if (selectedValue.length == 0) {
      message.error("Quyền không được trống");
    } else if (avatar.length == 0) {
      message.error("Avatar không được trống");
    } else if (dataDetailEdit.name == "") {
      message.error("Tên người dùng không được trống");
    } else if (dataDetailEdit.phone == "") {
      message.error("Số điện thoại người dùng không được trống");
    } else if (dataDetailEdit.email == "") {
      message.error("Email người dùng không được trống");
    }
    // else if (position.length == 0) {
    //   message.error("Chức vụ không được trống");
    // } else if (department.length == 0) {
    //   message.error("Bộ môn không được trống");
    // }
    else {
      let res = await UpdateUser(
        updateId,
        selectedValue.join(","),
        avatar,
        dataDetailEdit.name,
        dataDetailEdit.phone,
        dataDetailEdit.email,
        dataDetailEdit.aboutme,
        // position,
        // title,
        // department,
        // dataDetailEdit.education,
        // dataDetailEdit.office,
        // dataDetailEdit.major,
        // dataDetailEdit.language,
        // research,
        // supervision,
        // publication,
        // teachingcourse,
        onCancel
      );
      if ((res.statuscode = 200)) {
        message.success("Cập nhật thông tin người dùng thành công");
        setVisible(false);
      } else {
        message.error("Cập nhật thông tin người dùng thất bại");
        setVisible(false);
      }
    }
  }
  const showPopconfirm = () => {
    if (visible === false) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  const cancel = (e) => {
    setVisible(false);
  };
  let userrole = sessionStorage.getItem("roleuser");
  return (
    <div className="edit-user">
      <Form layout="vertical" name="control-hooks" form={form}>
        {userrole != "ADMI" ? null : (
          <>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Thông tin tài khoản
            </Text>
            <Form.Item label="Chọn quyền">
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Chọn quyền"
                value={selectedValue}
                onChange={handleChangeSelect}
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
          </>
        )}
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Thông tin cá nhân
        </Text>
        <Form.Item label="Avatar">
          <input type="file" name="avatar" onChange={handleChangeImage} />
          <img
            src={"https://brandname.phuckhangnet.vn/ftp_images/" + avatar}
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
          label="Tên người dùng"
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
            onChange={onChange}
            name="name"
            placeholder="Nhập tên người dùng"
            value={dataDetailEdit.name}
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
            onChange={onChange}
            name="phone"
            placeholder="Nhập số điện thoại"
            value={dataDetailEdit.phone}
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
            onChange={onChange}
            name="email"
            placeholder="Nhập email"
            value={dataDetailEdit.email}
          />
        </Form.Item>
        <Form.Item name="aboutme" label="Giới thiệu">
          <TextArea
            name="aboutme"
            placeholder="Giới thiệu"
            maxLength={500}
            onChange={(e) =>
              setDataDetailEdit({ ...dataDetailEdit, aboutme: e.target.value })
            }
          ></TextArea>
        </Form.Item>
        {/* <Form.Item label="Chức vụ" name="position">
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn chức vụ"
            mode="multiple"
            onChange={(e) => setPosition(e)}
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
            onChange={(e) => setTitle(e)}
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
            onChange={(e) => setDepartment(e)}
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
            maxLength={300}
            onChange={(e) =>
              setDataDetailEdit({
                ...dataDetailEdit,
                education: e.target.value,
              })
            }
          ></TextArea>
        </Form.Item>
        <Form.Item name="office" label="Văn phòng">
          <Input
            name="office"
            placeholder="Văn phòng làm việc"
            onChange={(e) =>
              setDataDetailEdit({ ...dataDetailEdit, office: e.target.value })
            }
          ></Input>
        </Form.Item>
        <Form.Item name="major" label="Chuyên ngành">
          <TextArea
            name="major"
            placeholder="Thông tin chuyên ngành"
            maxLength={300}
            onChange={(e) =>
              setDataDetailEdit({ ...dataDetailEdit, major: e.target.value })
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
            onChange={(e) =>
              setDataDetailEdit({ ...dataDetailEdit, language: e })
            }
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
            setContents={research}
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
            setContents={supervision}
            onChange={(e) => setSupervision(e)}
          ></SunEditor>
        </Form.Item>
        <Form.Item label="Ấn phẩm" name="publication">
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
            setContents={publication}
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
            setContents={teachingcourse}
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
              title="Xác nhận chỉnh sửa?"
              onConfirm={EditUser}
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
  );
};

export default EditUser;
