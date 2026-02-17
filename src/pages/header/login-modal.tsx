import { useState } from 'react';
import { Modal, Form, Input, Button, Tabs, message, ConfigProvider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

interface LoginModalProps {
    isOpen: boolean;
    onCancel: () => void;
}

const LoginModal = ({ isOpen, onCancel }: LoginModalProps) => {
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Success:', values);
        setTimeout(() => {
            message.success(activeTab === 'login' ? '登录成功' : '注册成功');
            setLoading(false);
            onCancel();
        }, 1000);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#fb7299',
                    borderRadius: 4,
                },
                components: {
                    Tabs: {
                        itemSelectedColor: '#fb7299',
                        inkBarColor: '#fb7299',
                        itemHoverColor: '#ff85ad',
                    },
                },
            }}
        >
            <Modal
                open={isOpen}
                onCancel={onCancel}
                footer={null}
                width={480}
                centered
                destroyOnClose
            >
                <div className="px-10 py-8 lg:px-10 lg:py-8">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        centered
                        className="mb-6"
                        items={[
                            {
                                key: 'login',
                                label: <span className="text-base px-4">密码登录</span>,
                                children: (
                                    <Form
                                        name="login"
                                        onFinish={onFinish}
                                        layout="vertical"
                                        size="large"
                                    >
                                        <Form.Item
                                            name="email"
                                            className="mb-4"
                                            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}
                                        >
                                            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="邮箱" />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            className="mb-4"
                                            rules={[{ required: true, message: '请输入密码' }]}
                                        >
                                            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="密码" />
                                        </Form.Item>
                                        <Form.Item className="mb-0">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={loading}
                                                className="h-10 text-base mt-2 bg-bili-pink border-bili-pink hover:!bg-bili-pink-hover hover:!border-bili-pink-hover"
                                            >
                                                登录
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                ),
                            },
                            {
                                key: 'register',
                                label: <span className="text-base px-4">注册</span>,
                                children: (
                                    <Form
                                        name="register"
                                        onFinish={onFinish}
                                        layout="vertical"
                                        size="large"
                                    >
                                        <Form.Item
                                            name="email"
                                            className="mb-4"
                                            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}
                                        >
                                            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="邮箱" />
                                        </Form.Item>
                                        <Form.Item
                                            name="nickname"
                                            className="mb-4"
                                            rules={[{ required: true, message: '请输入昵称' }]}
                                        >
                                            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="昵称" />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            className="mb-4"
                                            rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
                                        >
                                            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="密码" />
                                        </Form.Item>
                                        <Form.Item className="mb-0">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={loading}
                                                className="h-10 text-base mt-2 bg-bili-pink border-bili-pink hover:!bg-bili-pink-hover hover:!border-bili-pink-hover"
                                            >
                                                注册
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                ),
                            },
                        ]}
                    />
                    <div className="mt-6 text-center text-xs text-gray-400">
                        <p>登录即代表您同意 <a href="#" className="text-bili-blue hover:text-bili-pink transition-colors">服务协议</a> 和 <a href="#" className="text-bili-blue hover:text-bili-pink transition-colors">隐私权政策</a></p>
                    </div>
                </div>
            </Modal>
        </ConfigProvider>
    );
};

export default LoginModal;
