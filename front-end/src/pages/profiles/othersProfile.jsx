import React from "react";
import { Layout, Descriptions, Avatar } from "antd";

const { Content } = Layout;

const OthersProfile = (props) => {
  const { userInfo } = props;

  if (!userInfo) {
    return <div>cargando información de los usuarios...</div>;
  }

  return (
    <Layout>
      <Content style={{ padding: "24px", minHeight: 280 }}>
        <div style={{ padding: "24px" }}>
          <h1>Profile</h1>
          <Avatar
            size={100}
            style={{ marginBottom: "20px" }}
            src={userInfo.avatar}
          />
          <Descriptions title="User Info" bordered>
            <Descriptions.Item label="Username">
              {userInfo.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {userInfo.email}
            </Descriptions.Item>
            <Descriptions.Item label="Number">
              {userInfo.number}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Content>
    </Layout>
  );
};

export default OthersProfile;
