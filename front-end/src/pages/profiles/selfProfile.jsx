import React, { useState } from "react";
import { Layout, Descriptions, Input, Button, Avatar } from "antd";

const { Content } = Layout;

const SelfProfile = () => {
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "JohnDoe",
    email: "john.doe@example.com",
    number: "12345678",
    avatar: "",
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    // Para salvar la informacion al darle save
  };

  const handleChange = (key, value) => {
    if (key === "number") {
      // solo entran 8 numeros
      if (/^\d{0,8}$/.test(value)) {
        setUserInfo({
          ...userInfo,
          [key]: value,
        });
      }
    } else {
      setUserInfo({
        ...userInfo,
        [key]: value,
      });
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserInfo({
          ...userInfo,
          avatar: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "24px", minHeight: 280 }}>
        <div style={{ padding: "24px" }}>
          <h1>Profile</h1>
          {editing ? (
            <div style={{ marginBottom: "20px" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          ) : (
            <Avatar
              size={100}
              style={{ marginBottom: "20px" }}
              src={userInfo.avatar}
            />
          )}
          <Descriptions
            title="User Info"
            bordered
            style={{ flexDirection: "column" }}
          >
            <Descriptions.Item label="Username">
              {editing ? (
                <Input
                  value={userInfo.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
              ) : (
                userInfo.username
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {editing ? (
                <Input
                  value={userInfo.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              ) : (
                userInfo.email
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Number">
              {editing ? (
                <Input
                  value={userInfo.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                />
              ) : (
                userInfo.number
              )}
            </Descriptions.Item>
          </Descriptions>
          {editing ? (
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button type="primary" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default SelfProfile;
