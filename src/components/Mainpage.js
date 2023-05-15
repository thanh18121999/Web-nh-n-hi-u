import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Alert, Button, Modal, Select, Space, message } from "antd";
import UserManagement from "./UserManagement";
import ArticleManagement from "./ArticleManagement";
import CategoryManagement from "./CategoryManagement";
import BlogManagement from "./BlogManagement";
import MenuManagement from "./MenuManagement";
import QAManagement from "./QAManagement";
import FileManagement from "./FileManagement";
import ChangePassword from "./ChangePassword";
import { getMenuList, getMenuListByRole } from "../Service";
import BookingManagement from "./BookingManagement";

const { TabPane } = Tabs;

const MainPage = () => {
  var userrole = sessionStorage.getItem("roleuser");
  var userActive = sessionStorage.getItem("isActive").split(",");
  const [menuCategoryList, setMenuCategoryList] = useState([]);
  const [menuArticleList, setMenuArticleList] = useState([]);
  async function getMenuListAPI() {
    let res = await getMenuList();
    if (res) {
      var userMenu = sessionStorage.getItem("menuList").split(",");
      setMenuCategoryList(
        res.responses
          .filter(
            (x) =>
              x.isActive == 1 &&
              x.isPage == 0 &&
              userMenu.indexOf(x.id.toString()) > -1
          )
          .map((x, index) => ({
            ...x,
            ordinal: index + 1,
          }))
      );
      setMenuArticleList(
        res.responses
          .filter(
            (x) =>
              x.isActive == 1 &&
              x.isPage == 1 &&
              userMenu.indexOf(x.id.toString()) > -1
          )
          .map((x, index) => ({
            ...x,
            ordinal: index + 1,
          }))
      );
    }
  }
  sessionStorage.setItem("menuArticle", JSON.stringify(menuArticleList));
  //sessionStorage.setItem("menus", JSON.stringify(menuList));

  useEffect(() => {
    getMenuListAPI();
  }, []);
  useEffect(() => {
    findChild();
  }, [menuCategoryList]);

  function findChild() {
    if (menuCategoryList.length > 0) {
      var maxLevel = Math.max.apply(
        Math,
        menuCategoryList?.map((x) => x.menulevel)
      );
      var obj = [];
      for (var i = 0; i < menuCategoryList.length; i++) {
        obj.push({
          level: menuCategoryList[i].menulevel,
          parent: menuCategoryList[i].parent,
          value: menuCategoryList[i].id,
          title: menuCategoryList[i].name,
          children: [],
        });
      }
      while (maxLevel > 0) {
        var tmp = obj.filter((x) => x.level == maxLevel);
        maxLevel--;
        var tmpbefore = obj.filter((x) => x.level == maxLevel);
        Object.keys(tmp).forEach((el) => {
          var o = tmp[el];
          var parent = o.parent;
          if (parent > 0) {
            let ch = tmpbefore.find((x) => x.value == parent);
            if (ch != undefined) {
              tmpbefore.find((x) => x.value == parent).children.push(o);
            }
          }
        });
      }
      var minLevel = Math.min.apply(
        Math,
        menuCategoryList?.map((x) => x.menulevel)
      );
      sessionStorage.setItem("menuCategory", JSON.stringify(obj));
    }
  }

  let navigate = useNavigate();
  function handleLogout() {
    sessionStorage.setItem("iduser", []);
    sessionStorage.setItem("username", []);
    sessionStorage.setItem("menuList", []);
    sessionStorage.setItem("menuCategory", []);
    sessionStorage.setItem("menuArticle", []);
    sessionStorage.setItem("isActive", []);
    sessionStorage.setItem("roleuser", []);
    sessionStorage.setItem("token", []);
    sessionStorage.setItem("articleAvailable", []);
    sessionStorage.setItem("listrole", []);
    sessionStorage.setItem("listroledescription", []);
    navigate("./*");
  }
  const [visibleChangePassword, setVisibleChangePassword] = useState(false);
  const handleFormChangePassword = () => {
    setVisibleChangePassword(true);
  };
  const handleCancelChangePassword = () => {
    setVisibleChangePassword(false);
  };
  const [visible, setVisible] = useState(false);
  const [listRole, setListRole] = useState([]);
  const [choSenRole, setChosenRole] = useState();
  const [roleChange, setRoleChange] = useState();
  useEffect(() => {
    setListRole(
      sessionStorage.getItem("listroledescription")
        ? JSON.parse(sessionStorage.getItem("listroledescription"))
        : []
    );
  }, []);
  function handleChangeRole() {
    setVisible(true);
  }
  function cancelChooseRole() {
    setVisible(false);
  }
  async function handleChangeSelect(e) {
    setRoleChange(e);
    let roleChosen = await getMenuListByRole(roleChange);
    setChosenRole(roleChosen.responses.map((x) => x.description));
  }
  async function confirmChangeRole() {
    if (!roleChange) {
      message.error("Hãy chọn quyền để đổi");
    } else {
      sessionStorage.setItem("roleuser", roleChange);
      let menuSelect = await getMenuListByRole(
        sessionStorage.getItem("roleuser")
      );
      sessionStorage.setItem(
        "menuList",
        menuSelect.responses.map((x) => x.menuid)
      );
      setVisible(false);
      window.location.reload();
    }
  }
  const MyButton = (
    <Space direction="vertical">
      {sessionStorage.getItem("listrole")?.indexOf(",") > 1 ? (
        <>
          <Button
            type="default"
            style={{
              color: "blue",
              marginBottom: "1rem",
              marginTop: "14rem",
              marginRight: "2rem",
              width: "8rem",
            }}
            onClick={handleChangeRole}
            size="large"
          >
            Đổi quyền
          </Button>
          <Button
            type="default"
            style={{ color: "blue", marginBottom: "1rem", marginRight: "2rem" }}
            onClick={handleFormChangePassword}
            size="large"
          >
            Đổi mật khẩu
          </Button>
          <Button
            type="default"
            style={{
              color: "red",
              marginRight: "2rem",
              marginBottom: "1rem",
              width: "8rem",
            }}
            onClick={handleLogout}
            size="large"
          >
            Đăng xuất
          </Button>
        </>
      ) : (
        <>
          <Button
            type="default"
            style={{
              color: "blue",
              marginBottom: "1rem",
              marginRight: "2rem",
              marginTop: "18rem",
            }}
            onClick={handleFormChangePassword}
            size="large"
          >
            Đổi mật khẩu
          </Button>
          <Button
            type="default"
            style={{
              color: "red",
              marginRight: "2rem",
              marginBottom: "1rem",
              width: "8rem",
            }}
            onClick={handleLogout}
            size="large"
          >
            Đăng xuất
          </Button>
        </>
      )}
    </Space>
  );
  return (
    <>
      {userActive?.includes("1") ? (
        <>
          <Tabs
            tabPosition="left"
            style={{
              paddingRight: "2em",
              paddingLeft: "2em",
              justifyContent: "flex-end",
            }}
            tabBarExtraContent={MyButton}
          >
            <TabPane tab="Tài khoản" key="0">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "2rem",
                }}
              >
                <Modal
                  title={<h5 className="text-secondary">Đổi mật khẩu</h5>}
                  centered
                  visible={visibleChangePassword}
                  width={800}
                  onCancel={handleCancelChangePassword}
                  footer={false}
                >
                  <ChangePassword onCancel={handleCancelChangePassword} />
                </Modal>

                <Modal
                  title={<h5 className="text-secondary">Chọn quyền</h5>}
                  centered
                  visible={visible}
                  width={800}
                  footer={false}
                  onCancel={cancelChooseRole}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn quyền"
                    optionLabelProp="children"
                    onChange={(e) => handleChangeSelect(e)}
                  >
                    {listRole?.map((value) => {
                      return (
                        <Select.Option
                          key={value.code}
                          value={value.code}
                          label={value.code + "-" + value.description}
                        >
                          {value.code} - {value.description}
                        </Select.Option>
                      );
                    })}
                  </Select>

                  <Button
                    type="primary"
                    style={{ marginTop: "2rem", marginLeft: "41.5rem" }}
                    onClick={confirmChangeRole}
                  >
                    Xác nhận
                  </Button>
                </Modal>
              </div>
              <UserManagement />
            </TabPane>

            <TabPane tab="Bài viết" key="2">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "2rem",
                }}
              ></div>
              <ArticleManagement />
            </TabPane>
            {userrole.startsWith("LE") ? null : (
              <TabPane tab="Chuyên mục" key="1">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginTop: "2rem",
                  }}
                ></div>
                <CategoryManagement />
              </TabPane>
            )}
            {/* <TabPane tab="Bài viết cá nhân" key="3">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "2rem",
                }}
              >
               
              </div>
              <BlogManagement />
            </TabPane> */}
            {/* <TabPane tab="Danh mục" key="4">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "2rem",
                }}
              >
                
              </div>
              <MenuManagement />
            </TabPane> */}
            <TabPane tab="Hỏi đáp" key="5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "2rem",
                }}
              ></div>
              <QAManagement />
            </TabPane>
            {/* <TabPane tab="Khảo sát" key="6">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "2rem",
                }}
              >
                
              </div>
              <QuestionsTab />
            </TabPane> */}
            <TabPane tab="Lịch hẹn" key="7">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "2rem",
                }}
              ></div>
              <BookingManagement />
            </TabPane>
            <TabPane tab="Kho lưu trữ" key="8">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "2rem",
                }}
              ></div>
              <FileManagement />
            </TabPane>
          </Tabs>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10em",
            }}
          >
            <Alert
              message="Error"
              description="Tài khoản đang bị khóa và không thể thao tác các chức năng. Vui lòng liên hệ quản trị viên để biết thêm chi tiết."
              type="error"
              showIcon
            />
          </div>
          <div
            style={{
              display: "flex",
              paddingTop: "2em",
              paddingRight: "2em",
              paddingLeft: "2em",
              justifyContent: "center",
            }}
          >
            <Button
              type="default"
              style={{ color: "red" }}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </>
      )}
    </>
  );
};
export default MainPage;
