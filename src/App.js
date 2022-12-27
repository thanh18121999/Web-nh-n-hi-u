import { Tabs } from "antd";
import UserManagement from "./components/UserManagement";
import ArticleManagement from "./components/ArticleManagement";

const { TabPane } = Tabs;

const Management = () => {
  return (
    <Tabs tabPosition="top">
      <TabPane tab="Quản lý người dùng" key="0">
        <UserManagement />
      </TabPane>
      <TabPane tab="Quản lý bài viết" key="1">
        <ArticleManagement />
      </TabPane>
    </Tabs>
  );
};

export default Management;
