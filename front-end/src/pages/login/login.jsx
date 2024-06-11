import { React, useState } from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [validUser, setValidUser] = useState(false);

    const [form] = Form.useForm();
    const URL_API = "http://localhost:4223/api/login";
    const URL_API2 = "http://localhost:4223/api/login/reallogin";
    const navigator = useNavigate();

    const onFinish = () => {
        const username = form.getFieldValue("username");
        const password = form.getFieldValue("password");

        const data = {
            userId: username,
            password,
        };
        axios
            .post(URL_API, data)
            .then((res) => {
                setValidUser(true);
            })
            .catch((error) => {
                console.error(error);
                alert("Login Incorrecto");
            });
    };

     const onRealFinish = () => {
        const username = form.getFieldValue("username");
        const password = form.getFieldValue("password");
        const token = form.getFieldValue("token");

        const data = {
            userId: username,
            password,
            token
        };
        axios
            .post(URL_API2, data)
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                alert("Login Correcto");
                navigator("/social-feed");
                window.location.reload()
            })
            .catch((error) => {
                console.error(error);
                alert("Login Incorrecto");
            });
    };

    const onFinishFailed = () => {
        setValidUser(false);
    };

    return (
        <>
            <div className='container-sm w-50 my-4'>
                <p> CHURRISBANCA</p>
                <Form
                    form={form}
                    className='my-4'
                    layout='vertical'
                    onFinish={validUser ? onRealFinish : onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item label='Username' name='username'>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Password' name='password'>
                        <Input.Password />
                    </Form.Item>
                    {!validUser ? (
                        <>
                        </>
                    ) : (
                        <div>
                            <p style={{ color: 'red' }}>Se le ha enviado un correo con su token de verificación</p>
                            <Form.Item label='Token' name='token'>
                                <Input />
                            </Form.Item>
                        </div>
                    )}
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default Login;
