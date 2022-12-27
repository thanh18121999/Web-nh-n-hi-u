import React, { useState } from "react";
import { Button, Card, Modal } from "antd";
import CreateArticle from "../components/CreateArticle";
import EditArticle from "../components/EditArticle";

const { Meta } = Card;

const ArticleManagement = () => {
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);

  const article = [
    {
      key: "1",
      TITLE:
        "Trường Đại học Quốc tế và Công Ty PURATOS GRAND PLACE Ký Kết Biên Bản Ghi Nhớ Hợp Tác",
      DESCRIPTION:
        "Ngày 7/12 vừa qua, trường Đại học Quốc tế đã tổ chức lễ ký kết MOU với Công ty TNHH Puratos Grand-Place Vietnam (PGPV). PGPV là Công ty thực phẩm có vốn đầu tư 100% của Bỉ, chuyên cung cấp nguyên vật liệu cũng như các giải pháp chuyên môn trong ngành hàng bánh mì, bánh ngọt, socola. PGPV cũng là đơn vị tiên phong, đặt nền móng cho sự phát triển bền vững của ngành cacao Việt Nam.",
      IMAGE: "",
    },
    {
      key: "1",
      TITLE:
        "CAMPUS TOUR: Đón đoàn học sinh THPT từ tỉnh Bình Thuận và tỉnh Bình Dương",
      DESCRIPTION:
        "Ngày 10-11/12/2022 vừa qua, Khoa Công nghệ Sinh học đã đón các bạn học sinh từ các trường THPT từ các tỉnh lân cận đến tham quan trường Đại học Quốc tế (ĐHQT) và các phòng thí nghiệm của các bộ môn Công nghệ Sinh học, Công nghệ Thực phẩm và Hóa Sinh.",
      IMAGE: "",
    },
    {
      key: "1",
      TITLE:
        "Nhóm Sinh Viên Ngành CNTP Xuất Sắc Giành Giải Cao Trong Hội Nghị Nghiên Cứu Khoa Học 2022",
      DESCRIPTION:
        "Xin chúc mừng nhóm sinh viên IU FT đạt giải BA của Hội nghị Sinh viên nghiên cứu khoa học 2022 với đề tài “PRODUCTION OF SOLUBLE INSTANT TEA FROM CASHEW APPLES (ANACARDIUM OCCIDENTALE L.) EXTRACT BY SPRAY DRYING TECHNIQUE.”",
      IMAGE: "",
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
        <Card
          bordered
          hoverable
          style={{
            height: 100,
            marginRight: ".1rem",
            marginLeft: ".1rem",
            marginBottom: "1rem",
          }}
          onClick={() => {
            handleFormEdit();
          }}
        >
          <Meta
            title="Trường Đại học Quốc tế và Công Ty PURATOS GRAND PLACE Ký Kết Biên Bản Ghi Nhớ Hợp Tác"
            description="Ngày 7/12 vừa qua, trường Đại học Quốc tế đã tổ chức lễ ký kết MOU với Công ty TNHH Puratos Grand-Place Vietnam (PGPV). PGPV là Công ty thực phẩm có vốn đầu tư 100% của Bỉ, chuyên cung cấp nguyên vật liệu cũng như các giải pháp chuyên môn trong ngành hàng bánh mì, bánh ngọt, socola. PGPV cũng là đơn vị tiên phong, đặt nền móng cho sự phát triển bền vững của ngành cacao Việt Nam."
          />
        </Card>
        <Card
          bordered
          hoverable
          style={{
            height: 100,
            marginRight: ".1rem",
            marginLeft: ".1rem",
            marginBottom: "1rem",
          }}
          onClick={() => {
            handleFormEdit();
          }}
        >
          <Meta
            title="ECAMPUS TOUR: Đón đoàn học sinh THPT từ tỉnh Bình Thuận và tỉnh Bình Dương"
            description="Ngày 10-11/12/2022 vừa qua, Khoa Công nghệ Sinh học đã đón các bạn học sinh từ các trường THPT từ các tỉnh lân cận đến tham quan trường Đại học Quốc tế (ĐHQT) và các phòng thí nghiệm của các bộ môn Công nghệ Sinh học, Công nghệ Thực phẩm và Hóa Sinh."
          />
        </Card>
        <Card
          bordered
          hoverable
          style={{
            height: 100,
            marginRight: ".1rem",
            marginLeft: ".1rem",
            marginBottom: "1rem",
          }}
          onClick={() => {
            handleFormEdit();
          }}
        >
          <Meta
            title="Nhóm Sinh Viên Ngành CNTP Xuất Sắc Giành Giải Cao Trong Hội Nghị Nghiên Cứu Khoa Học 2022"
            description="Xin chúc mừng nhóm sinh viên IU FT đạt giải BA của Hội nghị Sinh viên nghiên cứu khoa học 2022 với đề tài “PRODUCTION OF SOLUBLE INSTANT TEA FROM CASHEW APPLES (ANACARDIUM OCCIDENTALE L.) EXTRACT BY SPRAY DRYING TECHNIQUE.”"
          />
        </Card>
      </div>
      <div className="modaEditGroup">
        <Modal
          title={<h5 className="text-secondary">Chỉnh sửa bài viết</h5>}
          centered
          visible={visibleEdit}
          width={800}
          onCancel={handleCancelEdit}
          footer={false}
        >
          <EditArticle onCancel={handleCancelEdit} />
        </Modal>
      </div>
      <div className="modaNewGroup">
        <Modal
          title={<h5 className="text-secondary">Bài viết mới</h5>}
          centered
          visible={visibleNew}
          width={900}
          onCancel={handleCancelNew}
          footer={false}
        >
          <CreateArticle onCancel={handleCancelNew} />
        </Modal>
      </div>
    </>
  );
};
export default ArticleManagement;
