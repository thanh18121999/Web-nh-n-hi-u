import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Space, Calendar, message } from "antd";
import { LoadingOutlined, EditOutlined } from "@ant-design/icons";
import { getBooking, cancelBooking, doneBooking } from "../Service";
import EditBooking from "./EditBooking";
const BookingManagement = () => {
  const [bookingList, setBookingList] = useState([]);
  async function getBookingAPI() {
    var role = sessionStorage.getItem("roleuser");
    let res = await getBooking();
    if (res) {
      if (role == "ADMI") {
        setBookingList(
          res.responses
            .filter((x) => x.booking.status != "CANCELED")
            .map((x, index) => ({
              ...x.booking,
              expert: x.expertname,
              status: x.statusname,
              key: index,
              ordinal: index + 1,
            }))
        );
      } else {
        setBookingList(
          res.responses
            .filter(
              (x) =>
                x.booking.status != "CANCELED" &&
                x.booking.assignexpert ==
                  parseInt(sessionStorage.getItem("iduser"))
            )
            .map((x, index) => ({
              ...x.booking,
              expert: x.expertname,
              status: x.statusname,
              key: index,
              ordinal: index + 1,
            }))
        );
      }
    }
  }
  useEffect(() => {
    getBookingAPI();
  }, []);
  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "ordinal",
      align: "center",
      width: "7%",
    },
    {
      title: "Nội dung cuộc hẹn",
      dataIndex: "note",
      align: "center",
      width: "18%",
    },
    {
      title: "Địa điểm",
      dataIndex: "addressbook",
      align: "center",
      width: "15%",
    },
    {
      title: "Thời lượng (phút)",
      dataIndex: "duration",
      align: "center",
      width: "8%",
    },
    {
      title: "Ngày đặt lịch",
      dataIndex: "createdate",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return record.createdate?.split("T")[0];
      },
    },
    {
      title: "Ngày hẹn",
      dataIndex: "datetimebooked",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return record.datetimebooked?.split("T").join("\n");
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: "7%",
    },
    {
      title: "",
      dataIndex: "DETAIL",
      align: "center",
      width: "5%",
      render: (_, record) => {
        if (record.status != "Đã hoàn thành") {
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
        }
      },
    },
    {
      title: "",
      dataIndex: "CONFIRMDONE",
      align: "center",
      width: "10%",
      render: (_, record) => {
        if (record.status != "Đã hoàn thành") {
          return (
            <>
              <span>
                <Button
                  style={{ color: "blue", background: "white" }}
                  onClick={() => {
                    showModalDone();
                    setDataDone(record);
                  }}
                >
                  Xác nhận hoàn thành
                </Button>
              </span>
            </>
          );
        }
      },
    },
    {
      title: "",
      dataIndex: "DELETE",
      align: "center",
      width: "10%",
      render: (_, record) => {
        if (record.status != "Đã hoàn thành") {
          return (
            <>
              <span>
                <Button
                  style={{ color: "red", background: "white" }}
                  onClick={() => {
                    showModalCancel();
                    setDataCancel(record);
                  }}
                >
                  Hủy lịch hẹn
                </Button>
              </span>
            </>
          );
        }
      },
    },
  ];
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState();
  const handleFormEdit = (e) => {
    setVisibleEdit(true);
    setDataEdit(e);
  };
  const handleCancelEdit = () => {
    setVisibleEdit(false);
    getBookingAPI();
  };

  const [dataCancel, setDataCancel] = useState();
  const [dataDone, setDataDone] = useState();
  const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);
  const [isModalDoneOpen, setIsModalDoneOpen] = useState(false);
  const showModalCancel = () => {
    setIsModalCancelOpen(true);
  };

  const handleCancelCancel = () => {
    setIsModalCancelOpen(false);
  };
  const showModalDone = () => {
    setIsModalDoneOpen(true);
  };

  const handleCancelDone = () => {
    setIsModalDoneOpen(false);
  };
  async function cancelBookingAPI() {
    let res = await cancelBooking(dataCancel.id);
    if (res.statuscode == 200) {
      setIsModalCancelOpen(false);
      getBookingAPI();
      message.success("Hủy lịch hẹn thành công");
    } else {
      setIsModalCancelOpen(false);
      message.error("Hủy lịch hẹn  thất bại");
    }
  }
  async function doneBookingAPI() {
    let res = await doneBooking(dataDone.id);
    if (res.statuscode == 200) {
      setIsModalDoneOpen(false);
      getBookingAPI();
      message.success("Xác nhận lịch hẹn hoàn thành thành công");
    } else {
      setIsModalDoneOpen(false);
      message.error("XÁc nhận lịch hẹn hoàn thành thất bại");
    }
  }
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
          Quản lý lịch hẹn
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginRight: "1.3rem",
        }}
      >
        {sessionStorage.getItem("roleuser") == "ADMI" ? (
          <h1 className="text-secondary pt-3" style={{ fontSize: "1.5rem" }}>
            <div>Danh sách lịch hẹn</div>
          </h1>
        ) : (
          <h1 className="text-secondary pt-3" style={{ fontSize: "1.5rem" }}>
            <div>Lịch hẹn của tôi</div>
          </h1>
        )}
      </div>
      <div className="py-2 mt-2">
        {/* {bookingList.length == 0 ? (
          <LoadingOutlined />
        ) : (
          <Table
            size="middle"
            style={{ paddingRight: "20px" }}
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <div style={{ display: "flex" }}>
                    <div>
                      <p style={{ fontWeight: "bold" }}>Thông tin khách hàng</p>
                      <p>Tên khách hàng: {record.customname}</p>
                      <p>Số điện thoại: {record.customphone}</p>
                      <p>Email: {record.customemail}</p>
                    </div>
                    <div style={{ marginLeft: "10rem" }}>
                      <p style={{ fontWeight: "bold" }}>Chuyên gia chỉ định</p>
                      <p>{record.expert != "" ? record.expert : "Không có"}</p>
                    </div>
                  </div>
                </>
              ),
            }}
            bordered
            pagination={{
              pageSize: 5,
            }}
            dataSource={bookingList}
          />
        )} */}
        <Table
          size="middle"
          style={{ paddingRight: "20px" }}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <>
                <div style={{ display: "flex" }}>
                  <div>
                    <p style={{ fontWeight: "bold" }}>Thông tin khách hàng</p>
                    <p>Tên khách hàng: {record.customname}</p>
                    <p>Số điện thoại: {record.customphone}</p>
                    <p>Email: {record.customemail}</p>
                  </div>
                  <div style={{ marginLeft: "10rem" }}>
                    <p style={{ fontWeight: "bold" }}>Chuyên gia chỉ định</p>
                    <p>{record.expert != "" ? record.expert : "Không có"}</p>
                  </div>
                </div>
              </>
            ),
          }}
          bordered
          pagination={{
            pageSize: 5,
          }}
          dataSource={bookingList}
        />
      </div>
      <div className="modalEditGroup">
        <Modal
          title={<h5 className="text-secondary">Chỉnh sửa thời gian hẹn</h5>}
          centered
          visible={visibleEdit}
          width={800}
          onCancel={handleCancelEdit}
          footer={false}
        >
          <EditBooking dataToUpdate={dataEdit} onCancel={handleCancelEdit} />
        </Modal>
      </div>
      <div className="modalCancel">
        <Modal
          title="Hủy lịch hẹn"
          visible={isModalCancelOpen}
          onCancel={handleCancelCancel}
          footer={false}
        >
          <p>
            Xác nhận hủy lịch hẹn với khách hàng "{dataCancel?.customname}"?
          </p>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={handleCancelCancel}>
              Hủy
            </Button>
            <Button type="primary" onClick={cancelBookingAPI}>
              Xác nhận
            </Button>
          </Space>
        </Modal>
      </div>
      <div className="modalDone">
        <Modal
          title="Xác nhận hoàn thành"
          visible={isModalDoneOpen}
          onCancel={handleCancelDone}
          footer={false}
        >
          <p>
            Xác nhận hoàn thành buổi hẹn với khách hàng "{dataDone?.customname}
            "?
          </p>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={handleCancelDone}>
              Hủy
            </Button>
            <Button type="primary" onClick={doneBookingAPI}>
              Xác nhận
            </Button>
          </Space>
        </Modal>
      </div>
    </>
  );
};
export default BookingManagement;
