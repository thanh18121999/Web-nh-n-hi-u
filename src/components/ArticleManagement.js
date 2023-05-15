import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Space, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CreateArticle from "./CreateArticle";
import EditArticle from "./EditArticle";
import { GetArticle, DeleteArticle } from "../Service";

const ArticleManagement = () => {
  const [articleList, setArticleList] = useState([]);
  async function getArticleListAPI() {
    var menuArticle = JSON.parse(sessionStorage.getItem("menuArticle"));
    var rolcode = sessionStorage.getItem("roleuser");
    let res = await GetArticle(
      menuArticle.map((x) => x.id),
      rolcode
    );
    if (res) {
      setArticleList(
        res.articlemenu?.map((x, index) => ({
          ...x.arc,
          key: index,
          ordinal: index + 1,
          menu: x.menuid,
          menuname: x.menuname.join(", "),
          user: x.name,
        }))
      );
    }
  }
  sessionStorage.setItem(
    "articleAvailable",
    articleList?.map((x) => parseInt(x.menu))
  );
  useEffect(() => {
    getArticleListAPI();
  }, []);
  async function deleteArticleAPI() {
    let res = await DeleteArticle(dataDelete.id);
    if (res == "DELETE_SUCCESSFUL") {
      setIsModalOpen(false);
      getArticleListAPI();
      message.success("Xóa bài viết thành công");
    } else if (res == "DELETE_FAIL_NOT_ARTICLE_CREATOR") {
      setIsModalOpen(false);
      message.error(
        "Người dùng không phải chủ nhân của bài viết hoặc không có quyền xóa bài viết này"
      );
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
    getArticleListAPI();
  };
  const handleCancelNew = () => {
    setVisibleNew(false);
    getArticleListAPI();
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
      width: "30%",
    },
    {
      title: "Danh mục",
      dataIndex: "menu",
      align: "center",
      width: "30%",
      render: (_, record) => {
        return record.menuname;
      },
    },
    {
      title: "Người đăng",
      dataIndex: "idusercreate",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return record.user;
      },
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
          Quản lý bài viết
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
          <div>Danh sách bài viết</div>
        </h1>
        <Button type="primary" onClick={handleFormNew}>
          Bài viết mới
        </Button>
      </div>
      <div className="py-2 mt-2">
        {/* {articleList.length == 0 ? (
          <LoadingOutlined />
        ) : (
          <Table
            size="middle"
            style={{ paddingRight: "20px" }}
            columns={columns}
            bordered
            pagination={{
              pageSize: 5,
            }}
            dataSource={articleList}
          />
        )} */}
        <Table
            size="middle"
            style={{ paddingRight: "20px" }}
            columns={columns}
            bordered
            pagination={{
              pageSize: 5,
            }}
            dataSource={articleList}
          />
      </div>
      <div className="modalEditGroup">
        <Modal
          title={<h5 className="text-secondary">Chỉnh sửa trang</h5>}
          centered
          visible={visibleEdit}
          width={800}
          onCancel={handleCancelEdit}
          footer={false}
        >
          <EditArticle dataToUpdate={dataEdit} onCancel={handleCancelEdit} />
        </Modal>
      </div>
      <div className="modalNewGroup">
        <Modal
          title={<h5 className="text-secondary">Trang mới</h5>}
          centered
          visible={visibleNew}
          width={930}
          onCancel={handleCancelNew}
          footer={false}
        >
          <CreateArticle onCancel={handleCancelNew} />
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
            <Button type="primary" onClick={deleteArticleAPI}>
              Xác nhận
            </Button>
          </Space>
        </Modal>
      </div>
    </>
  );
};
export default ArticleManagement;
