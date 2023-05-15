import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Space, message } from "antd";
import {
  EditOutlined,
  LoadingOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

import CreateUser from "../components/CreateUser";
import EditUser from "../components/EditUser";
import { getStaffList, UserUpdateStatus, UserResetPassword } from "../Service";

const UserManagement = () => {
  const [dataEdit, setDataEdit] = useState();
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);

  const [staffList, setStaffList] = useState([]);
  var userRole = sessionStorage.getItem("roleuser");
  async function getStaffListAPI() {
    let res = await getStaffList();
    if (res) {
      if (userRole == "ADMI") {
        setStaffList(
          res.responses.map((x, index) => ({
            ...x.user,
            detail: x.userdetail,
            position: x.positions,
            title: x.titles,
            department: x.departments,
            roledes: x.rolesdescription,
            key: index,
            ordinal: index + 1,
          }))
        );
      } else {
        setStaffList(
          res.responses
            .filter((x) => x.user.id == sessionStorage.getItem("iduser"))
            .map((x, index) => ({
              ...x.user,
              detail: x.userdetail,
              position: x.positions,
              title: x.titles,
              department: x.departments,
              roledes: x.rolesdescription,
              key: index,
              ordinal: index + 1,
            }))
        );
      }
    }
  }
  useEffect(() => {
    getStaffListAPI();
  }, []);
  async function handleUpdateStatus(id) {
    await UserUpdateStatus(id);
    getStaffListAPI();
  }
  async function handleResetPassword() {
    let res = await UserResetPassword(dataReset.username);
    if ((res.statuscode = 200)) {
      setIsModalOpen(false);
      getStaffListAPI();
      message.success(
        'Đặt lại mật khẩu thành công, mật khẩu hiện tại là "123456"'
      );
    } else {
      setIsModalOpen(false);
      message.error("Đặt lại mật khẩu thất bại");
    }
  }
  const [dataReset, setDataReset] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const AdminColumns = [
    {
      title: "Số thứ tự",
      dataIndex: "ordinal",
      align: "center",
      width: "10%",
    },
    {
      title: "Tài khoản",
      dataIndex: "username",
      align: "center",
      width: "15%",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      align: "center",
      width: "25%",
      render: (_, record) => {
        return record.detail?.name;
      },
    },
    {
      title: "Quyền",
      dataIndex: "role",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return record.roledes;
      },
    },
    {
      title: "",
      dataIndex: "LOCK",
      align: "center",
      width: "5%",
      render: (_, record) => {
        if (record.status === 1) {
          return (
            <>
              <span>
                <UnlockOutlined
                  onClick={() => handleUpdateStatus(record.id)}
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "#009933",
                  }}
                />
              </span>
            </>
          );
        } else {
          return (
            <>
              <span>
                <LockOutlined
                  onClick={() => handleUpdateStatus(record.id)}
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "#ff0000",
                  }}
                />
              </span>
            </>
          );
        }
      },
    },
    {
      title: "",
      dataIndex: "resetpassword",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return (
          <>
            <span>
              <Button
                style={{ color: "black", background: "white" }}
                //onClick={() => handleResetPassword(record.username)}
                onClick={() => {
                  showModal();
                  setDataReset(record);
                }}
              >
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
      width: "5%",
      render: (_, record) => {
        return (
          <>
            <span>
              <EditOutlined
                onClick={() => {
                  handleFormEdit(record);
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
  ];
  const UserColumns = [
    {
      title: "Số thứ tự",
      dataIndex: "ordinal",
      align: "center",
      width: "10%",
    },
    {
      title: "Tài khoản",
      dataIndex: "username",
      align: "center",
      width: "20%",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      align: "center",
      width: "30%",
      render: (_, record) => {
        return record.detail?.name;
      },
    },
    {
      title: "",
      dataIndex: "DETAIL",
      align: "center",
      width: "5%",
      render: (_, record) => {
        return (
          <>
            <span>
              <EditOutlined
                onClick={() => {
                  handleFormEdit(record);
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
  ];

  const handleFormEdit = (e) => {
    setDataEdit(e);
    setVisibleEdit(true);
  };
  const handleFormNew = () => {
    setVisibleNew(true);
  };
  const handleCancelEdit = () => {
    setVisibleEdit(false);
    getStaffListAPI();
  };
  const handleCancelNew = () => {
    setVisibleNew(false);
    getStaffListAPI();
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
        {userRole?.includes("ADMI") ? (
          <h1 className="text-secondary pt-3" style={{ fontSize: "2rem" }}>
            Quản lý người dùng
          </h1>
        ) : (
          <h1 className="text-secondary pt-3" style={{ fontSize: "2rem" }}>
            Chỉnh sửa tài khoản
          </h1>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginRight: "1.3rem",
        }}
      >
        {userRole?.includes("ADMI") ? (
          <h1 className="text-secondary pt-3" style={{ fontSize: "1.5rem" }}>
            <div>Danh sách người dùng</div>
          </h1>
        ) : (
          <h1 className="text-secondary pt-3" style={{ fontSize: "1.5rem" }}>
            <div>Tài khoản của tôi</div>
          </h1>
        )}
        {userRole?.includes("ADMI") ? (
          <Button type="primary" onClick={handleFormNew}>
            Thêm tài khoản
          </Button>
        ) : null}
      </div>
      <div className="py-2 mt-2">
        {/* {staffList.length == 0 ? (
          <LoadingOutlined />
        ) : (
          <Table
            size="middle"
            style={{ paddingRight: "20px" }}
            columns={userRole?.includes("ADMI") ? AdminColumns : UserColumns}
            bordered
            pagination={{
              pageSize: 6,
            }}
            dataSource={staffList}
          />
        )} */}
        <Table
          size="middle"
          style={{ paddingRight: "20px" }}
          columns={userRole?.includes("ADMI") ? AdminColumns : UserColumns}
          bordered
          pagination={{
            pageSize: 6,
          }}
          dataSource={staffList}
        />
      </div>
      <div className="modalEditGroup">
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
      <div className="modalNewGroup">
        <Modal
          title={<h5 className="text-secondary">Thêm người dùng mới</h5>}
          centered
          visible={visibleNew}
          width={850}
          onCancel={handleCancelNew}
          footer={false}
        >
          <CreateUser onCancel={handleCancelNew} />
        </Modal>
      </div>
      <div className="modalResetPassword">
        <Modal
          title="Đặt lại mật khẩu"
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
          <p>Xác nhận đặt lại mật khẩu tài khoản "{dataReset?.username}"?</p>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="primary" onClick={handleResetPassword}>
              Xác nhận
            </Button>
          </Space>
        </Modal>
      </div>
    </>
  );
};
export default UserManagement;
