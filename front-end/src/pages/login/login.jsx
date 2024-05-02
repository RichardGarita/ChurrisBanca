import React from "react";
import { Button, Form, Input } from "antd";

const Login = () => {
    
    const [form] = Form.useForm();

    const onFinish = () => {
        console.log(form.getFieldValue('username'));
        console.log(form.getFieldValue('password'));
    };
     
    const onFinishFailed = () => {
    
    };

    return (
        <>
            <div className='container-sm w-50 my-4'>
                <p> CHURRISBANCA</p>
                <Form
                    form={form}
                    className='my-4'
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label='Username'
                        name='username'
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label='Password'
                        name='password'
                    >
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
