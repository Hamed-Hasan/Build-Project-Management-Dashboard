import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Icon } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const LoginPage = () => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (values) => {
    console.log('Received values of form: ', values);
    // Mock response simulation
    if (values.username === 'admin' && values.password === '12345') {
      alert('Login successful!');
    } else {
      alert('Login failed!');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            onClick={togglePasswordVisibility}
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
