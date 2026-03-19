import {
    LockOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Modal, Tabs, Tooltip } from 'antd';
import { useState } from 'react';

import { useCheckCode, useLoginAccount, useRegisterAccount } from '../../hooks/queries/useAuth';
import { useUserStore } from '../../stores/useUserStore';
import { md5 } from '../../utils';

import { toast } from './message';

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
    const {
        data: checkCodeData,
        refetch: refreshCheckCode,
        isFetching: isRefreshingCode,
    } = useCheckCode();
    const loginMutation = useLoginAccount();
    const registerMutation = useRegisterAccount();
    const setUserInfo = useUserStore((state) => state.setUserInfo);

    const ensureCheckCodeKey = () => {
        if (!checkCodeData?.checkCodeKey) {
            toast.warning('验证码已失效，请刷新重试');
            refreshCheckCode();
            return null;
        }
        return checkCodeData.checkCodeKey;
    };

    const handleLoginFinish = (values: LoginFormValues) => {
        const checkCodeKey = ensureCheckCodeKey();
        if (!checkCodeKey) return;

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
                        toast.success('欢迎回来！');
                        onCancel();
                        return;
                    }
                    refreshCheckCode();
                },
                onError: (error: any) => {
                    toast.error(error.msg || '登录失败，请检查账号或验证码');
                    refreshCheckCode();
                },
            },
        );
    };

    const handleRegisterFinish = (values: RegisterFormValues) => {
        const checkCodeKey = ensureCheckCodeKey();
        if (!checkCodeKey) return;

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
                    toast.success('注册成功，快去登录吧');
                    setActiveTab('login');
                    refreshCheckCode();
                },
                onError: (error: any) => {
                    toast.error(error.msg || '注册失败');
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
                    borderRadius: 8,
                    colorLink: '#00aeec',
                },
                components: {
                    Tabs: {
                        titleFontSize: 16,
                        horizontalItemGutter: 32,
                    },
                    Input: {
                        controlHeight: 42,
                    },
                },
            }}
        >
            <Modal
                open={isOpen}
                onCancel={onCancel}
                footer={null}
                width={440}
                centered
                destroyOnClose
                bodyStyle={{ padding: 0 }}
                className="login-modal-custom"
            >
                <div className="px-8 py-10">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        centered
                        className="mb-8 custom-tabs"
                        items={[
                            {
                                key: 'login',
                                label: <span className="font-medium">密码登录</span>,
                                children: (
                                    <Form<LoginFormValues>
                                        name="login"
                                        onFinish={handleLoginFinish}
                                        layout="vertical"
                                        size="large"
                                    >
                                        <Form.Item
                                            name="email"
                                            rules={[
                                                { required: true, message: '请输入邮箱' },
                                                { type: 'email', message: '邮箱格式不正确' },
                                            ]}
                                        >
                                            <Input
                                                prefix={
                                                    <MailOutlined className="text-gray-300 mr-1" />
                                                }
                                                placeholder="邮箱"
                                                allowClear
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            rules={[{ required: true, message: '请输入密码' }]}
                                        >
                                            <Input.Password
                                                prefix={
                                                    <LockOutlined className="text-gray-300 mr-1" />
                                                }
                                                placeholder="密码"
                                            />
                                        </Form.Item>

                                        <div className="flex items-start gap-3">
                                            <Form.Item
                                                name="checkCode"
                                                className="flex-1"
                                                rules={[
                                                    { required: true, message: '请输入验证码' },
                                                ]}
                                            >
                                                <Input
                                                    prefix={
                                                        <SafetyCertificateOutlined className="text-gray-300 mr-1" />
                                                    }
                                                    placeholder="验证码"
                                                />
                                            </Form.Item>
                                            <Tooltip title="点击刷新">
                                                <div
                                                    className="cursor-pointer h-[42px] w-[110px] bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden rounded transition-all active:scale-95"
                                                    onClick={() => refreshCheckCode()}
                                                >
                                                    {isRefreshingCode ? (
                                                        <SyncOutlined
                                                            spin
                                                            className="text-pink-400"
                                                        />
                                                    ) : checkCodeData?.checkCode ? (
                                                        <img
                                                            src={checkCodeData.checkCode}
                                                            alt="验证码"
                                                            className="h-full w-full object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            点击获取
                                                        </span>
                                                    )}
                                                </div>
                                            </Tooltip>
                                        </div>

                                        <Form.Item className="mt-2 mb-0">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={loginMutation.isPending}
                                                className="h-11 text-base font-semibold shadow-md shadow-pink-100"
                                            >
                                                登录
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                ),
                            },
                            {
                                key: 'register',
                                label: <span className="font-medium">快速注册</span>,
                                children: (
                                    <Form<RegisterFormValues>
                                        name="register"
                                        onFinish={handleRegisterFinish}
                                        layout="vertical"
                                        size="large"
                                    >
                                        <Form.Item
                                            name="email"
                                            rules={[
                                                { required: true, message: '请输入邮箱' },
                                                { type: 'email', message: '格式错误' },
                                                { max: 150, message: '长度超限' },
                                            ]}
                                        >
                                            <Input
                                                prefix={
                                                    <MailOutlined className="text-gray-300 mr-1" />
                                                }
                                                placeholder="邮箱"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="nickName"
                                            rules={[
                                                { required: true, message: '请输入昵称' },
                                                { max: 20, message: '昵称过长' },
                                            ]}
                                        >
                                            <Input
                                                prefix={
                                                    <UserOutlined className="text-gray-300 mr-1" />
                                                }
                                                placeholder="昵称"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="registerPassword"
                                            rules={[
                                                { required: true, message: '请输入密码' },
                                                {
                                                    pattern: registerPasswordRegex,
                                                    message: '8-18位，包含字母和数字',
                                                },
                                            ]}
                                        >
                                            <Input.Password
                                                prefix={
                                                    <LockOutlined className="text-gray-300 mr-1" />
                                                }
                                                placeholder="设置密码"
                                            />
                                        </Form.Item>

                                        <div className="flex items-start gap-3">
                                            <Form.Item
                                                name="checkCode"
                                                className="flex-1"
                                                rules={[
                                                    { required: true, message: '请输入验证码' },
                                                ]}
                                            >
                                                <Input
                                                    prefix={
                                                        <SafetyCertificateOutlined className="text-gray-300 mr-1" />
                                                    }
                                                    placeholder="验证码"
                                                />
                                            </Form.Item>
                                            <div
                                                className="cursor-pointer h-[42px] w-[110px] bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden rounded transition-all"
                                                onClick={() => refreshCheckCode()}
                                            >
                                                {isRefreshingCode ? (
                                                    <SyncOutlined spin className="text-pink-400" />
                                                ) : checkCodeData?.checkCode ? (
                                                    <img
                                                        src={checkCodeData.checkCode}
                                                        alt="验证码"
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                        点击获取
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <Form.Item className="mt-2 mb-0">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={registerMutation.isPending}
                                                className="h-11 text-base font-semibold shadow-md shadow-pink-100"
                                            >
                                                立即注册
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                ),
                            },
                        ]}
                    />

                    <div className="mt-8 text-center">
                        <p className="text-[12px] text-gray-400 leading-relaxed">
                            未注册邮箱登录时将自动创建账号，且代表您同意
                            <br />
                            <a href="#" className="text-blue-400 hover:underline mx-1">
                                服务协议
                            </a>
                            和
                            <a href="#" className="text-blue-400 hover:underline mx-1">
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
