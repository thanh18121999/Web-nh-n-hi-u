import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Space, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CreateQA from "./CreateQA";
import EditQA from "./EditQA";
import AnswerQA from "./AnswerQA";
import AssignNewExpertQA from "./AssignNewExpertQA";
import { getQAList, getQASampleList, DeleteArticle } from "../Service";

const QAManagement = () => {
  const [QAList, setQAList] = useState();
  const [answeredQAList, setAnsweredQAList] = useState();
  const [hasData, setHasData] = useState();
  async function getQAListAPI() {
    let res = await getQAList();
    if (res) {
      setQAList(
        res.responses
          .filter(
            (x) =>
              x.isactive == 1 &&
              x.answer == null &&
              (x.assignexpert == 0 ||
                x.assignexpert.toString() == sessionStorage.getItem("iduser"))
          )
          .map((x, index) => ({
            ...x,
            key: x.index,
            ordinal: index + 1,
          }))
      );
      setAnsweredQAList(
        res.responses
          .filter((x) => x.isactive == 1 && x.answer != null)
          .map((x, index) => ({
            ...x,
            key: x.index,
            ordinal: index + 1,
          }))
      );
    } else {
      setHasData(0);
    }
  }
  useEffect(() => {
    getQAListAPI();
  }, []);
  const [QASampleList, setQASampleList] = useState();
  async function getQASampleListAPI() {
    let res = await getQASampleList();
    if (res) {
      setQASampleList(
        res.responses
          .filter((x) => x.isactive == 1)
          .map((x, index) => ({
            ...x,
            key: x.index,
            ordinal: index + 1,
          }))
      );
    }
  }
  useEffect(() => {
    getQASampleListAPI();
  }, []);
  //   async function deleteArticleAPI() {
  //     let res = await DeleteArticle(dataDelete.id);
  //     if (res == "DELETE_SUCCESSFUL") {
  //       setIsModalOpen(false);
  //       getArticleListAPI();
  //       message.success("Xóa danh mục thành công");
  //     } else if (res == "DELETE_FAIL_NOT_ARTICLE_CREATOR") {
  //       setIsModalOpen(false);
  //       message.error(
  //         "Người dùng không phải chủ nhân của danh mục hoặc không có quyền xóa danh mục này"
  //       );
  //     }
  //   }

  const [visibleAnswer, setVisibleAnswer] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);
  const [visibleAssign, setVisibleAssign] = useState(false);
  const [dataAnswer, setDataAnswer] = useState();
  const [dataEdit, setDataEdit] = useState();
  const [dataDelete, setDataDelete] = useState();
  const [dataAssign, setDataAssign] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleFormAnswer = (e) => {
    setVisibleAnswer(true);
    setDataAnswer(e);
  };
  const handleFormEdit = (e) => {
    setVisibleEdit(true);
    setDataEdit(e);
  };
  const handleFormNew = () => {
    setVisibleNew(true);
  };
  const handleFormAssign = (e) => {
    setVisibleAssign(true);
    setDataAssign(e);
  };
  const handleCancelAnswer = () => {
    setVisibleAnswer(false);
    getQAListAPI();
    getQASampleListAPI();
  };
  const handleCancelEdit = () => {
    setVisibleEdit(false);
    getQAListAPI();
    getQASampleListAPI();
  };
  const handleCancelNew = () => {
    setVisibleNew(false);
    getQAListAPI();
    getQASampleListAPI();
  };
  const handleCancelAssign = () => {
    setVisibleAssign(false);
    getQAListAPI();
  };
  const sampleColumns = [
    {
      title: "Số thứ tự",
      dataIndex: "ordinal",
      align: "center",
      width: "10%",
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      align: "center",
      width: "25%",
    },
    {
      title: "Câu trả lời",
      dataIndex: "answer",
      align: "center",
      width: "25%",
    },
    // {
    //   title: "Người tạo",
    //   dataIndex: "createuser",
    //   align: "center",
    //   width: "20%",
    // },
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
  const answerColumns = [
    {
      title: "Số thứ tự",
      dataIndex: "ordinal",
      align: "center",
      width: "10%",
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      align: "center",
      width: "25%",
    },
    {
      title: "Email người hỏi",
      dataIndex: "questionuseremail",
      align: "center",
      width: "20%",
      //   render: (_, record) => {
      //     return record.QAname;
      //   },
    },
    {
      title: "Ngày tạo",
      dataIndex: "questiondate",
      align: "center",
      width: "20%",
      //   render: (_, record) => {
      //     return record.QAname;
      //   },
    },
    {
      title: "",
      dataIndex: "DETAIL",
      align: "center",
      width: "15%",
      render: (_, record) => {
        return (
          <>
            <span>
              <Button
                style={{ color: "black", background: "white" }}
                onClick={() => {
                  handleFormAssign(record);
                }}
              >
                Chỉ định người khác
              </Button>
            </span>
          </>
        );
      },
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
              <Button
                style={{ color: "blue", background: "white" }}
                onClick={() => {
                  handleFormAnswer(record);
                }}
              >
                Trả lời
              </Button>
            </span>
          </>
        );
      },
    },
  ];
  const answeredColumns = [
    {
      title: "Số thứ tự",
      dataIndex: "ordinal",
      align: "center",
      width: "10%",
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      align: "center",
      width: "25%",
    },
    {
      title: "Email người hỏi",
      dataIndex: "questionuseremail",
      align: "center",
      width: "20%",
      //   render: (_, record) => {
      //     return record.QAname;
      //   },
    },
    {
      title: "Câu trả lời",
      dataIndex: "answer",
      align: "center",
      width: "25%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "questiondate",
      align: "center",
      width: "15%",
      //   render: (_, record) => {
      //     return record.QAname;
      //   },
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
          Chuyên mục hỏi đáp
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
          <div>Câu hỏi mẫu đã tạo</div>
        </h1>
        <Button type="primary" onClick={handleFormNew}>
          Câu hỏi mẫu mới
        </Button>
      </div>
      <div className="modalAnswerGroup">
        <Modal
          title={<h5 className="text-secondary">Trả lời câu hỏi</h5>}
          centered
          visible={visibleAnswer}
          width={800}
          onCancel={handleCancelAnswer}
          footer={false}
        >
          <AnswerQA dataToUpdate={dataAnswer} onCancel={handleCancelAnswer} />
        </Modal>
      </div>
      <div className="modalEditGroup">
        <Modal
          title={<h5 className="text-secondary">Trả lời câu hỏi</h5>}
          centered
          visible={visibleEdit}
          width={800}
          onCancel={handleCancelEdit}
          footer={false}
        >
          <EditQA dataToUpdate={dataEdit} onCancel={handleCancelEdit} />
        </Modal>
      </div>
      <div className="py-2 mt-2">
        {/* {QASampleList?.length == 0 ? (
          <LoadingOutlined />
        ) : (
          <Table
            size="middle"
            style={{ paddingRight: "20px" }}
            columns={sampleColumns}
            bordered
            pagination={{
              pageSize: 2,
            }}
            dataSource={QASampleList}
          />
        )} */}
        <Table
          size="middle"
          style={{ paddingRight: "20px" }}
          columns={sampleColumns}
          bordered
          pagination={{
            pageSize: 2,
          }}
          dataSource={QASampleList}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginRight: "1.3rem",
        }}
      >
        <h1 className="text-secondary pt-3" style={{ fontSize: "1.5rem" }}>
          <div>Câu hỏi của tôi</div>
        </h1>
      </div>
      <div className="py-2 mt-2">
        {/* {QAList?.length == 0 ? (
          <LoadingOutlined />
        ) : (
          <Table
            size="middle"
            style={{ paddingRight: "20px" }}
            columns={answerColumns}
            bordered
            pagination={{
              pageSize: 2,
            }}
            dataSource={QAList}
          />
        )} */}
        <Table
          size="middle"
          style={{ paddingRight: "20px" }}
          columns={answerColumns}
          bordered
          pagination={{
            pageSize: 2,
          }}
          dataSource={QAList}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginRight: "1.3rem",
        }}
      >
        <h1 className="text-secondary pt-3" style={{ fontSize: "1.5rem" }}>
          <div>Câu hỏi đã trả lời</div>
        </h1>
      </div>
      <div className="py-2 mt-2">
        {/* {answeredQAList?.length == 0 ? (
          <LoadingOutlined />
        ) : (
          <Table
            size="middle"
            style={{ paddingRight: "20px" }}
            columns={answeredColumns}
            bordered
            pagination={{
              pageSize: 2,
            }}
            dataSource={answeredQAList}
          />
        )} */}
        <Table
          size="middle"
          style={{ paddingRight: "20px" }}
          columns={answeredColumns}
          bordered
          pagination={{
            pageSize: 2,
          }}
          dataSource={answeredQAList}
        />
      </div>
      <div className="modalNewGroup">
        <Modal
          title={<h5 className="text-secondary">Câu hỏi mẫu mới</h5>}
          centered
          visible={visibleNew}
          width={"100%"}
          onCancel={handleCancelNew}
          footer={false}
        >
          <CreateQA onCancel={handleCancelNew} />
        </Modal>
      </div>
      <div className="modalDelete">
        <Modal
          title="Xóa Danh mục"
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
          <p>Xác nhận xóa mục hỏi đáp với tiêu đề "{dataDelete?.question}"?</p>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={handleCancel}>
              Hủy
            </Button>
            {/* <Button type="primary" onClick={deleteArticleAPI}>
              Xác nhận
            </Button> */}
          </Space>
        </Modal>
      </div>
      <div className="modalAssign">
        <Modal
          title={<h5 className="text-secondary">Chỉ định người thay thế</h5>}
          centered
          visible={visibleAssign}
          width={"100%"}
          onCancel={handleCancelAssign}
          footer={false}
        >
          <AssignNewExpertQA
            onCancel={handleCancelAssign}
            dataToAssign={dataAssign}
          />
        </Modal>
      </div>
    </>
  );
};
export default QAManagement;
