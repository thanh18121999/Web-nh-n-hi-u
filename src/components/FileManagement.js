import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import UploadFileLib from "./UploadFile";
import { GetWarehouseFile } from "../Service";

const FileManagement = () => {
  var userRole = sessionStorage.getItem("roleuser");
  var idUser = sessionStorage.getItem("iduser");
  const [fileList, setFileList] = useState([]);
  async function GetWarehouseFileAPI() {
    let res = await GetWarehouseFile();
    if (res) {
      if (userRole == "ADMI") {
        setFileList(
          res.responses.map((x, index) => ({
            ...x.warehouse_file,
            key: index,
            ordinal: index + 1,
            createuser: x.createuser,
          }))
        );
      } else {
        setFileList(
          res.responses
            .filter((x) => x.warehouse_file.iduser == idUser)
            .map((x, index) => ({
              ...x.warehouse_file,
              key: index,
              ordinal: index + 1,
              createuser: x.createuser,
            }))
        );
      }
    }
  }

  useEffect(() => {
    GetWarehouseFileAPI();
  }, []);
  const AdminColumns = [
    {
      title: "Số thứ tự",
      dataIndex: "ORDINAL",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return record.ordinal;
      },
    },
    {
      title: "Tên tệp",
      dataIndex: "realname",
      align: "center",
      width: "25%",
    },
    {
      title: "Đường dẫn",
      dataIndex: "url",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return (
          <a
            onClick={() =>
              window.open(
                "https://brandname.phuckhangnet.vn/ftp_storage/" +
                  record.filename +
                  "." +
                  record.ext
              )
            }
          >
            Tải file
            {/* {record.filename}.{record.ext} */}
          </a>
        );
      },
    },
    {
      title: "Kích thước (KB)",
      dataIndex: "filesize",
      align: "center",
      width: "10%",
    },
    {
      title: "Phân loại",
      dataIndex: "fileextension",
      align: "center",
      width: "15%",
    },
    {
      title: "Người tải lên",
      dataIndex: "createuser",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return record.createuser;
      },
    },
  ];
  console.log(fileList, "fl");
  const UserColumns = [
    {
      title: "Số thứ tự",
      dataIndex: "ORDINAL",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return record.ordinal;
      },
    },
    {
      title: "Tên tệp",
      dataIndex: "realname",
      align: "center",
      width: "30%",
      render: (_, record) => {
        return record.realname;
      },
    },
    {
      title: "Đường dẫn",
      dataIndex: "url",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return (
          <a onClick={() => window.open(record.filename + "." + record.ext)}>
            {record.filename}.{record.ext}
          </a>
        );
      },
    },
    {
      title: "Kích thước (KB)",
      dataIndex: "filesize",
      align: "center",
      width: "20%",
    },
    {
      title: "Phân loại",
      dataIndex: "fileextension",
      align: "center",
      width: "20%",
    },
  ];

  const [visible, setVisible] = useState(false);
  const handleUpload = () => {
    setVisible(true);
  };
  const handleCancelUpload = () => {
    setVisible(false);
    GetWarehouseFileAPI();
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
          Kho lưu trữ
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "1.3rem",
        }}
      >
        <h1 className="text-secondary pt-3" style={{ fontSize: "1.5rem" }}>
          <Button type="primary" onClick={handleUpload}>
            Chọn File
          </Button>
        </h1>
      </div>
      <div className="py-2 mt-2">
        {/* {fileList.length == 0 ? (
          <LoadingOutlined />
        ) : (
          <Table
            size="middle"
            style={{ paddingRight: "20px" }}
            columns={userRole?.includes("ADMI") ? AdminColumns : UserColumns}
            bordered
            pagination={{
              pageSize: 4,
            }}
            dataSource={fileList}
          />
        )} */}
        <Table
          size="middle"
          style={{ paddingRight: "20px" }}
          columns={userRole?.includes("ADMI") ? AdminColumns : UserColumns}
          bordered
          pagination={{
            pageSize: 4,
          }}
          dataSource={fileList}
        />
      </div>
      <div className="modalUpload">
        <Modal
          title={<h5 className="text-secondary">Tải file lên thư viện</h5>}
          centered
          visible={visible}
          width={"100%"}
          onCancel={handleCancelUpload}
          footer={false}
        >
          <UploadFileLib onCancel={handleCancelUpload} />
        </Modal>
      </div>
    </>
  );
};
export default FileManagement;
