import React, { useState, useEffect } from "react";
import { Layout, Descriptions, Input, Button, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

const SelfProfile = () => {
  const [editing, setEditing] = useState(false);
  const URL_API = "http://localhost:4223/api/profile";
  const userId = 1; // Por ahora el userId es una constante

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    number: "",
    avatar: "",
  });

  useEffect(() => {
    axios.get(`${URL_API}?userId=${userId}`)
      .then(response => {
        const { USERNAME, MAIL, TEL, PICTURE } = response.data;
        setUserInfo({
          username: USERNAME,
          email: MAIL,
          number: TEL,
          avatar: PICTURE,
        });
        console.log(PICTURE);
      })
      .catch(error => {
        console.error("Error fetching user profile", error);
      });
  }, [userId]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);

    const updatedInfo = {
      userId,
      username: userInfo.username,
      mail: userInfo.email,
      tel: userInfo.number,
      picture: userInfo.avatar
    };

    axios.put(URL_API, updatedInfo)
      .then(response => {
        console.log('Profile updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  const handleChange = (key, value) => {
    if (key === "number") {
      if (/^\d{0,8}$/.test(value)) {
        setUserInfo({
          ...userInfo,
          [key]: value,
        });
      }
    } else if (key === "username" || key === "email") {
      if (value.length <= 50) {
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
          avatar: e.target.result.split(',')[1],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/social-feed');
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
          <div style={{ marginTop: "20px" }}>
            {editing ? (
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button type="primary" onClick={handleEdit}>
                Edit
              </Button>
            )}
            <Button style={{ marginLeft: "10px" }} onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default SelfProfile;
