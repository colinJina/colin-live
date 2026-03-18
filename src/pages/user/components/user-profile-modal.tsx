import { Modal, Form, Input, Radio, DatePicker, Button, Upload } from 'antd';
import { CloseOutlined, CameraFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import type { UserInfoVO } from '../../../api/uhome';
import { getAvatarSrc } from '../../../utils';
import defaultAvatar from '@/assets/icon/user.svg';
import { useUpdateUserInfo } from '../../../hooks/queries/useUhome';
import { toast } from '../../header/message';
import { useUploadImage } from '../../../hooks/queries/useVideo';
import { useUserStore } from '../../../stores/useUserStore';

interface UserProfileModalProps {
    open: boolean;
    onClose: () => void;
    userInfo?: UserInfoVO;
}

const SEX_MAP = {
    MALE: { label: '男', value: 1 },
    FEMALE: { label: '女', value: 0 },
    SECRET: { label: '保密', value: 2 },
};

const sexToLabel = (sex?: number) => {
    if (sex === 1) return SEX_MAP.MALE.label;
    if (sex === 0) return SEX_MAP.FEMALE.label;
    return SEX_MAP.SECRET.label;
};

const labelToSex = (label?: string): number => {
    if (label === SEX_MAP.MALE.label) return SEX_MAP.MALE.value;
    if (label === SEX_MAP.FEMALE.label) return SEX_MAP.FEMALE.value;
    return SEX_MAP.SECRET.value;
};

export default function UserProfileModal({ open, onClose, userInfo }: UserProfileModalProps) {
    const [form] = Form.useForm();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUserInfo();
    const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
    const storeUserInfo = useUserStore((s) => s.userInfo);
    const updateUserProfile = useUserStore((s) => s.updateUserProfile);
    const avatarDraft = Form.useWatch('avatar', form) as string | undefined;

    const labelStyle = useMemo(() => ({ className: 'font-bold text-[#8a5065]' }), []);

    const onFinish = (values: {
        avatar?: string;
        nickname: string;
        gender?: string;
        birthday?: dayjs.Dayjs;
        school?: string;
        intro?: string;
        announcement?: string;
    }) => {
        const avatar = values.avatar || userInfo?.avatar || '';
        if (!avatar) {
            return toast.error('头像不能为空');
        }

        updateUser(
            {
                nickName: values.nickname,
                avatar,
                sex: labelToSex(values.gender),
                birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : undefined,
                school: values.school || undefined,
                personIntroduction: values.intro || undefined,
                noticeInfo: values.announcement || undefined,
            },
            {
                onSuccess: () => {
                    if (userInfo?.userId && storeUserInfo?.userId === userInfo.userId) {
                        updateUserProfile({
                            nickName: values.nickname,
                            avatar,
                        });
                    }
                    onClose();
                },
                onError: () => {
                    toast.error('更新失败，请重试');
                },
            },
        );
    };

    useEffect(() => {
        if (open && userInfo) {
            form.setFieldsValue({
                avatar: userInfo.avatar ?? '',
                nickname: userInfo.nickName ?? '',
                gender: sexToLabel(userInfo.sex),
                birthday: userInfo.birthday ? dayjs(userInfo.birthday) : undefined,
                school: userInfo.school ?? '',
                intro: userInfo.personIntroduction ?? '',
                announcement: userInfo.noticeInfo ?? '',
            });
        }
    }, [open, userInfo, form]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closable={false}
            centered
            width={520}
            destroyOnClose
            wrapClassName="custom-profile-modal"
        >
            <div className="relative overflow-hidden rounded-[32px] bg-[#fff4f8]/95 shadow-[0_32px_64px_rgba(251,114,153,0.2)]">
                {/* 背景装饰 */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/60 blur-3xl" />
                    <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#ff8db2]/15 blur-3xl" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8">
                    <h2 className="m-0 text-[20px] font-extrabold text-[#4a2232]">修改用户信息</h2>
                    <Button
                        type="text"
                        disabled={isUpdating}
                        icon={<CloseOutlined className="text-[#c26683]" />}
                        onClick={onClose}
                        className="hover:rotate-90 hover:text-[#fb7299] transition-all"
                    />
                </div>

                <Form
                    form={form}
                    layout="horizontal"
                    onFinish={onFinish}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    className="max-h-[60vh] overflow-y-auto px-8 py-6 custom-scrollbar"
                >
                    <Form.Item name="avatar" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item label={<span {...labelStyle}>UID</span>}>
                        <span className="text-[14px] font-mono text-[#4a2232]/60">
                            {userInfo?.userId || '--'}
                        </span>
                    </Form.Item>

                    <Form.Item label={<span {...labelStyle}>头像</span>}>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            showUploadList={false}
                            className="avatar-uploader group overflow-hidden !rounded-2xl !border-2 !border-white !shadow-md transition-transform hover:scale-[1.02]"
                            accept="image/*"
                            customRequest={({ file, onSuccess, onError }) => {
                                const realFile = file as File;
                                uploadImage(realFile, {
                                    onSuccess: (path) => {
                                        form.setFieldValue('avatar', path);
                                        toast.success('图片已预存');
                                        onSuccess?.({});
                                    },
                                    onError: (err) => {
                                        toast.error('上传失败');
                                        onError?.(err as any);
                                    },
                                });
                            }}
                        >
                            <div className="relative h-full w-full">
                                <img
                                    src={
                                        getAvatarSrc(avatarDraft || userInfo?.avatar) ||
                                        defaultAvatar
                                    }
                                    alt="avatar"
                                    className="h-full w-full object-cover rounded-xl"
                                />
                                <div
                                    className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                >
                                    <CameraFilled
                                        className={`text-xl text-white ${isUploading ? 'animate-pulse' : ''}`}
                                    />
                                    <span className="mt-1 text-[11px] font-bold text-white">
                                        {isUploading ? '上传中...' : '更换头像'}
                                    </span>
                                </div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="nickname"
                        label={<span {...labelStyle}>昵称</span>}
                        rules={[{ required: true, message: '取个好听的名字吧' }]}
                    >
                        <Input
                            maxLength={20}
                            showCount
                            className="!rounded-xl !py-2.5"
                            placeholder="你的昵称"
                        />
                    </Form.Item>

                    <Form.Item name="gender" label={<span {...labelStyle}>性别</span>}>
                        <Radio.Group className="flex gap-4">
                            <Radio value="女">女</Radio>
                            <Radio value="男">男</Radio>
                            <Radio value="保密">保密</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="birthday" label={<span {...labelStyle}>生日</span>}>
                        <DatePicker
                            className="w-full !rounded-xl !py-2.5"
                            placeholder="请选择日期"
                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                    </Form.Item>

                    <Form.Item name="school" label={<span {...labelStyle}>学校</span>}>
                        <Input maxLength={30} showCount className="!rounded-xl !py-2.5" />
                    </Form.Item>

                    <Form.Item name="intro" label={<span {...labelStyle}>简介</span>}>
                        <Input.TextArea
                            rows={3}
                            maxLength={80}
                            showCount
                            className="!rounded-2xl !py-2.5"
                            placeholder="向大家介绍一下自己..."
                        />
                    </Form.Item>

                    <Form.Item name="announcement" label={<span {...labelStyle}>公告</span>}>
                        <Input.TextArea
                            rows={2}
                            maxLength={100}
                            showCount
                            className="!rounded-2xl !py-2.5"
                        />
                    </Form.Item>
                </Form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 bg-white/40 px-8 py-6 backdrop-blur-md">
                    <Button
                        onClick={onClose}
                        disabled={isUpdating || isUploading}
                        className="h-10 !rounded-xl border-none bg-white/60 !px-6 !font-bold !text-[#8a5065] hover:!bg-white"
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        loading={isUpdating}
                        disabled={isUploading}
                        onClick={() => form.submit()}
                        className="h-10 !rounded-xl !border-none !bg-[linear-gradient(135deg,#fb7299_0%,#ff9fbe_100%)] !px-8 !font-bold !text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                        确定
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
