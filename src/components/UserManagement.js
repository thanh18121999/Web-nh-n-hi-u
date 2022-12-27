import React, { useState } from "react";
import { Button, Table, Modal } from "antd";
import {
  InfoCircleOutlined,
  DeleteOutlined,
  LockOutlined,
} from "@ant-design/icons";

import CreateUser from "../components/CreateUser";
import EditUser from "../components/EditUser";

const UserManagement = () => {
  const [dataEdit, setDataEdit] = useState();
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);

  const user = [
    {
      key: "1",
      ACCOUNT: "00000",
      PASSWORD: "1",
      INDEX: "1",
      NAME: "Nguyễn Văn Thuận",
      ROLE: "Trưởng khoa",
    },
    {
      key: "2",
      ACCOUNT: "00001",
      PASSWORD: "1",
      INDEX: "2",
      NAME: "Nguyễn Hoàng Khuê Tú",
      ROLE: "Phó khoa",
    },
    {
      key: "3",
      ACCOUNT: "00002",
      PASSWORD: "1",
      INDEX: "3",
      NAME: "Nguyễn minh Thành",
      ROLE: "Phó khoa",
    },
  ];
  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "INDEX",
      align: "center",
      width: "8%",
    },
    {
      title: "Tài khoản",
      dataIndex: "ACCOUNT",
      align: "center",
      width: "10%",
    },
    {
      title: "Họ tên",
      dataIndex: "NAME",
      align: "center",
      width: "22%",
    },
    {
      title: "Chức vụ",
      dataIndex: "ROLE",
      align: "center",
      width: "10%",
    },
    {
      title: "",
      dataIndex: "LOCK",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return (
          <>
            <span>
              <LockOutlined
                onClick={() => {}}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#009933",
                }}
              />
            </span>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "CHANGEPASSWORD",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return (
          <>
            <span>
              <Button style={{ color: "black", background: "white" }}>
                Đặt lại mật khẩu
              </Button>
            </span>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "DETAIL",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return (
          <>
            <span>
              <InfoCircleOutlined
                onClick={() => {
                  handleFormEdit();
                  setDataEdit(record);
                }}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#000000",
                }}
              />
            </span>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "DELETE",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return (
          <>
            <span>
              <DeleteOutlined
                onClick={() => {}}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#ff0000",
                }}
              />
            </span>
          </>
        );
      },
    },
  ];

  const handleFormEdit = () => {
    setVisibleEdit(true);
  };
  const handleFormNew = () => {
    setVisibleNew(true);
  };
  const handleCancelEdit = () => {
    setVisibleEdit(false);
  };
  const handleCancelNew = () => {
    setVisibleNew(false);
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
        }}
      >
        <h1 className="text-secondary pt-3" style={{ fontSize: "2rem" }}>
          Quản lý người dùng
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginRight: "1.3rem",
        }}
      >
        <h1 className="text-secondary pt-3" style={{ fontSize: "1.5rem" }}>
          <div>Danh sách người dùng</div>
        </h1>
        <Button type="primary" onClick={handleFormNew}>
          Thêm người dùng
        </Button>
      </div>
      <div className="py-2 mt-2">
        <Table
          size="middle"
          style={{ paddingRight: "20px" }}
          columns={columns}
          bordered
          pagination={{
            pageSize: 4,
          }}
          dataSource={user}
        />
      </div>
      <div className="modaEditGroup">
        <Modal
          title={
            <h5 className="text-secondary">Chỉnh sửa thông tin người dùng</h5>
          }
          centered
          visible={visibleEdit}
          width={800}
          onCancel={handleCancelEdit}
          footer={false}
        >
          <EditUser dataToUpdate={dataEdit} onCancel={handleCancelEdit} />
        </Modal>
      </div>
      <div className="modaNewGroup">
        <Modal
          title={<h5 className="text-secondary">Thêm người dùng mới</h5>}
          centered
          visible={visibleNew}
          width={800}
          onCancel={handleCancelNew}
          footer={false}
        >
          <CreateUser onCancel={handleCancelNew} />
        </Modal>
      </div>
    </>
  );
};
export default UserManagement;
