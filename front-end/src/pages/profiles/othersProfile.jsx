import React, { useState, useEffect } from "react";
import { Layout, Descriptions, Avatar, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import AuthToken from '../../config/config';

const { Content } = Layout;

const OthersProfile = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    number: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState(true);
  const URL_API = "http://localhost:4223/api/profile";
  const navigate = useNavigate(); // Initialize useNavigate
  const { userId } = useParams();

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const currentUserId = decodedToken.ID;

  

  useEffect(() => {
    if (parseInt(userId, 10) === parseInt(currentUserId, 10)) {
      navigate('/self-profile');
    }
    AuthToken(token);
    axios.post(`${URL_API}?otherUserId=${userId}`)
      .then(response => {
        const friends = response.data
        if (friends) {
          setFriends(true);
        } else {
          setFriends(false)
        }
      });
    //AuthToken(token);
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
        //setFriends(true);
      })
      .catch(error => {
        console.error("Error fetching user profile", error);
        setLoading(false);
      });
  }, [userId, token, currentUserId, navigate]);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (!friends) {
    return (
      <div>
        <div>Profile blocked</div>
        <Button
          type="primary"
          style={{ marginTop: "20px" }}
          onClick={handleGoBack}
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  
  return (
    <Layout>
      <Content style={{ padding: "24px", minHeight: 280 }}>
        <div style={{ padding: "24px" }}>
          <h1>Profile</h1>
          <Avatar
            size={100}
            src={userInfo.avatar}
          />
          <small className="d-block mb-2">Te sigue</small>

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
