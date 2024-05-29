import React from "react";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form] = Form.useForm();
    const URL_API = "http://localhost:4223/api/login";
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
            .then(() => {
                alert("Login Correcto");
                navigator('/social-feed');
                
            })
            .catch((error) => {
                console.error(error);
                alert("Login  incorrecto");
            });
    };

    const onFinishFailed = () => {};

    return (
        <>
            <div className='container-sm w-50 my-4'>
                <p> CHURRISBANCA</p>
                <Form
                    form={form}
                    className='my-4'
                    layout='vertical'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item label='Username' name='username'>
                        <Input />
                    </Form.Item>

                    <Form.Item label='Password' name='password'>
                        <Input.Password />
                    </Form.Item>

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
