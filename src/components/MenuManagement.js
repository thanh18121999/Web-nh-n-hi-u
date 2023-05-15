import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Space, Tree, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CreateMenu from "./CreateMenu";
import EditCategory from "./EditCategory";
import { getMenuList, DeleteArticle } from "../Service";

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [menuList, setMenuList] = useState([]);
  async function getMenuListAPI() {
    let res = await getMenuList();
    if (res) {
      setMenu(
        res.responses.map((x, index) => ({
          ...x,
          ordinal: index + 1,
        }))
      );
    }
  }
  useEffect(() => {
    getMenuListAPI();
  }, []);
  useEffect(() => {
    findChild();
  }, [menu]);
  function findChild() {
    var menus = [];
    var menutemp = menu.map((entry) => ({ ...entry }));
    if (menutemp.length > 0) {
      var maxLevel = Math.max.apply(
        Math,
        menutemp?.map((x) => x.menulevel)
      );
      var obj = [];
      for (var i = 0; i < menutemp.length; i++) {
        obj.push({
          level: menutemp[i].menulevel,
          parent: menutemp[i].parent,
          value: menutemp[i].id,
          title: menutemp[i].name,
          name: menutemp[i].name,
          key: menutemp[i].id,
          description: menutemp[i].description,
          children: [],
        });
      }
      while (maxLevel > 0) {
        var tmp = obj.filter((x) => x.level == maxLevel);
        maxLevel--;
        var tmpbefore = obj.filter((x) => x.level == maxLevel);
        // Object.keys(tmp).forEach((el) => {
        //   var o = tmp[el];
        //   var type_title = "(Danh Mục)";
        //   if ($(o.description).hasClass("title") == true)
        //     type_title = "(Tiêu Đề)";
        //   else if ($(o.description).attr("webpage") == "true")
        //     type_title = "(Trang)";
        //   else if ($(o.description).attr("multi") == "true")
        //     type_title = "(Chuyên Mục)";
        //   else if ($(o.description).attr("single") == "true")
        //     type_title = "(Bài Viết)";
        //   if (type_title != "(Tiêu Đề)") type_title = type_title;
        //   let ch = tmpbefore.find((x) => x.value == o.parent);
        //   if (ch != undefined) {
        //     o.title = type_title + " " + o.title.replace(ch.name + " - ", "");
        //     ch.children.push(o);
        //   } else o.title = type_title + " " + o.title;
        // });
      }
      var minLevel = Math.min.apply(
        Math,
        menutemp?.map((x) => x.menulevel)
      );

      menus = obj.filter((x) => x.level.toString() == minLevel.toString());
      setMenuList(
        menus.map((x, index) => ({
          ...x,
          ordinal: index + 1,
        }))
      );
    }
  }
  const columns = [
    {
      dataIndex: "title",
      align: "flex-start",
      render: (_, record) => {
        return (
          <>
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              {record.title}
              <DeleteOutlined
                // onClick={() => {
                //   handleFormEdit(record);
                // }}
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "red",
                }}
              />
            </span>
          </>
        );
      },
    },
  ];
  const [visibleNew, setVisibleNew] = useState(false);
  const handleFormNew = () => {
    setVisibleNew(true);
  };
  const handleCancelNew = () => {
    setVisibleNew(false);
    getMenuListAPI();
  };
  return (
    <>
      <Button
        type="primary"
        onClick={handleFormNew}
        style={{ marginTop: "2rem" }}
      >
        Tạo danh mục
      </Button>
      {menuList.length > 0 ? (
        <Table
          columns={columns}
          dataSource={menuList}
          pagination={false}
          defaultExpandAllRows
          style={{ marginTop: "2rem" }}
        />
      ) : (
        <LoadingOutlined
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        />
      )}
      <div className="modalNewMenu">
        <Modal
          title={<h5 className="text-secondary">Thêm danh mục mới</h5>}
          centered
          visible={visibleNew}
          width={800}
          onCancel={handleCancelNew}
          footer={false}
        >
          <CreateMenu onCancel={handleCancelNew} />
        </Modal>
      </div>
    </>
  );
};
export default MenuManagement;
