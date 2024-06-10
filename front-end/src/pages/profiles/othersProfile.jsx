import React, { useState, useEffect } from "react";
import { Layout, Descriptions, Avatar, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

const OthersProfile = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    number: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState(false);
  const URL_API = "http://localhost:4223/api/profile"; // Ajusta la URL de la API según tu configuración
  const navigate = useNavigate(); // Initialize useNavigate
  const { userId } = useParams();

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
        setLoading(false);
        setFriends(true);
      })
      .catch(error => {
        console.error("Error fetching user profile", error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (!friends) {
    return <div>Profile blocked</div>;
  }

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

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
          <Descriptions title="User Info" bordered style={{ flexDirection: "column" }}>
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
          <Button
            type="primary"
            style={{ marginTop: "20px" }}
            onClick={handleGoBack}
          >
            Go Back
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default OthersProfile;
