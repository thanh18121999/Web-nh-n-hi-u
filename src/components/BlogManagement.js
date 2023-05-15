import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Space, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CreateBlog from "../components/CreateBlog";
import EditBlog from "../components/EditBlog";
import { GetBlog, DeleteBlog } from "../Service";

const BlogManagement = () => {
  const [blogList, setBlogList] = useState([]);
  async function getBlogListAPI() {
    let res = await GetBlog();
    if (res) {
      setBlogList(
        res.responses.map((x, index) => ({
          ...x,
          key: index,
          ordinal: index + 1,
        }))
      );
    }
  }
  useEffect(() => {
    getBlogListAPI();
  }, []);
  async function deleteBlogAPI() {
    let res = await DeleteBlog(dataDelete.id);
    if (res == "DELETE_SUCCESSFUL") {
      setIsModalOpen(false);
      getBlogListAPI();
      message.success("Xóa bài viết thành công");
    } else if (res == "DELETE_FAIL_NOT_BLOG_OWNER") {
      setIsModalOpen(false);
      message.error("Người dùng không phải chủ nhân của bài viết này");
    }
  }
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);
  const [dataEdit, setDataEdit] = useState();
  const [dataDelete, setDataDelete] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFormEdit = (e) => {
    setVisibleEdit(true);
    setDataEdit(e);
  };
  const handleFormNew = () => {
    setVisibleNew(true);
  };
  const handleCancelEdit = () => {
    setVisibleEdit(false);
    getBlogListAPI();
  };
  const handleCancelNew = () => {
    setVisibleNew(false);
    getBlogListAPI();
  };
  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "ordinal",
      align: "center",
      width: "10%",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      align: "center",
      width: "45%",
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdate",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return record.createdate.split("T").join("\n");
      },
    },
    {
      title: "Lượt thích",
      dataIndex: "likes",
      align: "center",
      width: "15%",
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
    {
      title: "",
      dataIndex: "LOCK",
      align: "center",
      width: "5%",
      render: (_, record) => {
        return (
          <>
            <span>
              <DeleteOutlined
                onClick={() => {
                  showModal();
                  setDataDelete(record);
                }}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "red",
                }}
              />
            </span>
          </>
        );
      },
    },
  ];

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
          Bài viết cá nhân
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
          <div>Bài viết cá nhân</div>
        </h1>
        <Button type="primary" onClick={handleFormNew}>
          Bài viết cá nhân mới
        </Button>
      </div>
      <div className="modalEditGroup">
        <Modal
          title={<h5 className="text-secondary">Chỉnh sửa bài viết</h5>}
          centered
          visible={visibleEdit}
          width={800}
          onCancel={handleCancelEdit}
          footer={false}
        >
          <EditBlog dataToUpdate={dataEdit} onCancel={handleCancelEdit} />
        </Modal>
      </div>
      <div className="py-2 mt-2">
        <Table
          size="middle"
          style={{ paddingRight: "20px" }}
          columns={columns}
          bordered
          pagination={{
            pageSize: 5,
          }}
          dataSource={!blogList ? <LoadingOutlined /> : blogList}
        />
      </div>
      <div className="modalNewGroup">
        <Modal
          title={<h5 className="text-secondary">Bài viết mới</h5>}
          centered
          visible={visibleNew}
          width={900}
          onCancel={handleCancelNew}
          footer={false}
        >
          <CreateBlog onCancel={handleCancelNew} />
        </Modal>
      </div>
      <div className="modalDelete">
        <Modal
          title="Xóa bài viết"
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
          <p>Xác nhận xóa bài viết với tiêu đề "{dataDelete?.title}"?</p>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="primary" onClick={deleteBlogAPI}>
              Xác nhận
            </Button>
          </Space>
        </Modal>
      </div>
    </>
  );
};
export default BlogManagement;
