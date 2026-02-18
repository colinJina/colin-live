import { useState } from 'react';
import { Modal, Form, Input, Button, Tabs, message, ConfigProvider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useCheckCode, useLoginAccount } from '../../hooks/queries/useAuth';
import { md5 } from '../../utils';


interface LoginModalProps {
    isOpen: boolean;
    onCancel: () => void;
}

const LoginModal = ({ isOpen, onCancel }: LoginModalProps) => {
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);

    // Captcha Hook
    const { data: checkCodeData, refetch: refreshCheckCode } = useCheckCode();
    const loginMutation = useLoginAccount();
    const onFinish = (values: any) => {
        setLoading(true);
        const submitValues = {
            ...values,
            password: md5(values.password).toString(),
            checkCodeKey: checkCodeData?.checkCodeKey,
        };

        loginMutation.mutate(submitValues, {
            onSuccess: (data) => {
                console.log('登录返回数据:', data);
                setLoading(false);
                if (data) {
                    message.success('登录成功');
                    onCancel();
                } else {
                    refreshCheckCode();
                }
            },
            onError: (error: any) => {
                setLoading(false);
                message.error(error.msg || '登录失败');
                refreshCheckCode();
            }
        });

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

                                        <div className="flex justify-center gap-4">
                                            <Form.Item
                                                name="checkCode"
                                                className="mb-0 flex-1"
                                                rules={[{ required: true, message: '请输入验证码' }]}
                                            >
                                                <Input
                                                    prefix={<SafetyCertificateOutlined className="text-gray-400" />}
                                                    placeholder="验证码"
                                                />
                                            </Form.Item>
                                            <div
                                                className="cursor-pointer h-[32px] w-[100px] bg-gray-100 flex items-center justify-center overflow-hidden rounded"
                                                onClick={() => refreshCheckCode()}
                                            >
                                                {checkCodeData?.checkCode ? (
                                                    <img
                                                        src={checkCodeData.checkCode}
                                                        alt="验证码"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400">点击获取</span>
                                                )}
                                            </div>
                                        </div>
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
