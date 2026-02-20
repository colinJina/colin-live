import {
    LockOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Modal, Tabs, message } from 'antd';
import { useState } from 'react';

import { useCheckCode, useLoginAccount, useRegisterAccount } from '../../hooks/queries/useAuth';
import { useUserStore } from '../../stores/useUserStore';
import { md5 } from '../../utils';

interface LoginModalProps {
    isOpen: boolean;
    onCancel: () => void;
}

interface LoginFormValues {
    email: string;
    password: string;
    checkCode: string;
}

interface RegisterFormValues {
    email: string;
    nickName: string;
    registerPassword: string;
    checkCode: string;
}

const registerPasswordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,18}$/;

const LoginModal = ({ isOpen, onCancel }: LoginModalProps) => {
    const [activeTab, setActiveTab] = useState('login');
    const { data: checkCodeData, refetch: refreshCheckCode } = useCheckCode();
    const loginMutation = useLoginAccount();
    const registerMutation = useRegisterAccount();
    const setUserInfo = useUserStore((state) => state.setUserInfo);

    const ensureCheckCodeKey = () => {
        if (!checkCodeData?.checkCodeKey) {
            message.warning('验证码已失效，请刷新后重试');
            refreshCheckCode();
            return null;
        }
        return checkCodeData.checkCodeKey;
    };

    const handleLoginFinish = (values: LoginFormValues) => {
        const checkCodeKey = ensureCheckCodeKey();
        if (!checkCodeKey) {
            return;
        }

        loginMutation.mutate(
            {
                email: values.email,
                password: md5(values.password).toString(),
                checkCode: values.checkCode,
                checkCodeKey,
            },
            {
                onSuccess: (data) => {
                    if (data) {
                        setUserInfo(data);
                        message.success('登录成功');
                        onCancel();
                        return;
                    }
                    refreshCheckCode();
                },
                onError: (error: any) => {
                    message.error(error.msg || '登录失败');
                    refreshCheckCode();
                },
            },
        );
    };

    const handleRegisterFinish = (values: RegisterFormValues) => {
        const checkCodeKey = ensureCheckCodeKey();
        if (!checkCodeKey) {
            return;
        }

        registerMutation.mutate(
            {
                email: values.email,
                nickName: values.nickName,
                registerPassword: values.registerPassword,
                checkCode: values.checkCode,
                checkCodeKey,
            },
            {
                onSuccess: () => {
                    message.success('注册成功，请登录');
                    setActiveTab('login');
                    refreshCheckCode();
                },
                onError: (error: any) => {
                    message.error(error.msg || '注册失败');
                    refreshCheckCode();
                },
            },
        );
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
                                    <Form<LoginFormValues>
                                        name="login"
                                        onFinish={handleLoginFinish}
                                        layout="vertical"
                                        size="large"
                                    >
                                        <Form.Item
                                            name="email"
                                            className="mb-4"
                                            rules={[
                                                { required: true, message: '请输入邮箱' },
                                                { type: 'email', message: '邮箱格式不正确' },
                                                { max: 150, message: '邮箱长度不能超过150' },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="text-gray-400" />}
                                                placeholder="邮箱"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            className="mb-4"
                                            rules={[{ required: true, message: '请输入密码' }]}
                                        >
                                            <Input.Password
                                                prefix={<LockOutlined className="text-gray-400" />}
                                                placeholder="密码"
                                            />
                                        </Form.Item>
                                        <div className="flex justify-center gap-4">
                                            <Form.Item
                                                name="checkCode"
                                                className="mb-0 flex-1"
                                                rules={[
                                                    { required: true, message: '请输入验证码' },
                                                ]}
                                            >
                                                <Input
                                                    prefix={
                                                        <SafetyCertificateOutlined className="text-gray-400" />
                                                    }
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
                                                    <span className="text-xs text-gray-400">
                                                        点击获取
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Form.Item className="mb-0">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={loginMutation.isPending}
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
                                    <Form<RegisterFormValues>
                                        name="register"
                                        onFinish={handleRegisterFinish}
                                        layout="vertical"
                                        size="large"
                                    >
                                        <Form.Item
                                            name="email"
                                            className="mb-4"
                                            rules={[
                                                { required: true, message: '请输入邮箱' },
                                                { type: 'email', message: '邮箱格式不正确' },
                                                { max: 150, message: '邮箱长度不能超过150' },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined className="text-gray-400" />}
                                                placeholder="邮箱"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="nickName"
                                            className="mb-4"
                                            rules={[
                                                { required: true, message: '请输入昵称' },
                                                { max: 20, message: '昵称长度不能超过20' },
                                            ]}
                                        >
                                            <Input
                                                prefix={<UserOutlined className="text-gray-400" />}
                                                placeholder="昵称"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="registerPassword"
                                            className="mb-4"
                                            rules={[
                                                { required: true, message: '请输入注册密码' },
                                                {
                                                    pattern: registerPasswordRegex,
                                                    message: '密码需8-18位，包含字母、数字',
                                                },
                                            ]}
                                        >
                                            <Input.Password
                                                prefix={<LockOutlined className="text-gray-400" />}
                                                placeholder="注册密码"
                                            />
                                        </Form.Item>
                                        <div className="flex justify-center gap-4">
                                            <Form.Item
                                                name="checkCode"
                                                className="mb-0 flex-1"
                                                rules={[
                                                    { required: true, message: '请输入验证码' },
                                                ]}
                                            >
                                                <Input
                                                    prefix={
                                                        <SafetyCertificateOutlined className="text-gray-400" />
                                                    }
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
                                                    <span className="text-xs text-gray-400">
                                                        点击获取
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Form.Item className="mb-0">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={registerMutation.isPending}
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
                        <p>
                            登录即代表您同意
                            <a
                                href="#"
                                className="text-bili-blue hover:text-bili-pink transition-colors"
                            >
                                服务协议
                            </a>
                            和
                            <a
                                href="#"
                                className="text-bili-blue hover:text-bili-pink transition-colors"
                            >
                                隐私政策
                            </a>
                        </p>
                    </div>
                </div>
            </Modal>
        </ConfigProvider>
    );
};

export default LoginModal;
