import {
    UploadOutlined,
    LoadingOutlined,
    PlusOutlined,
    VideoCameraOutlined,
    CheckCircleFilled,
} from '@ant-design/icons';
import { Upload, Progress, Form, Input, Radio, Select, Button, message, Checkbox } from 'antd';
import type { UploadProps } from 'antd';
import React, { useState, useMemo } from 'react';

import { useAllCategory } from '../../hooks/queries/useCategory';
import { usePostVideo, useUploadImage } from '../../hooks/queries/useVideo';
import { useVideoUpload } from '../../hooks/queries/useVideoUpload';

function EmptyUploadPanel({ handleCustomRequest, uploadingCount }: any) {
    const props: UploadProps = {
        multiple: true,
        customRequest: handleCustomRequest,
        showUploadList: false,
        accept: 'video/*',
    };

    return (
        <div className="group transition-all duration-300 hover:scale-[1.01] mt-8">
            <Upload.Dragger {...props} className="!border-none !bg-transparent">
                <div className="text-[20px] font-semibold text-[#5b2b3b]">开始你的创作</div>
                <div className="mt-2 text-[14px] text-[#9b6a7c]">
                    支持视频分片上传，大文件更稳定
                </div>

                <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd3e4_0%,#fff_100%)] text-[#fb7299] shadow-[0_14px_26px_rgba(251,114,153,0.16)]">
                    {uploadingCount > 0 ? (
                        <LoadingOutlined style={{ fontSize: '36px' }} />
                    ) : (
                        <UploadOutlined style={{ fontSize: '36px' }} />
                    )}
                </div>

                <p className="mt-6 text-[14px] font-medium text-[#fb7299]">
                    点击或拖拽视频文件至此区域上传
                </p>
            </Upload.Dragger>
        </div>
    );
}

// --- 核心页面组件 ---
export default function UcenterUpload() {
    const { tasks, handleCustomRequest, uploadingCount } = useVideoUpload();
    const [form] = Form.useForm();

    // 引入 API Hooks
    const { data: categoryList = [] } = useAllCategory();
    const { mutateAsync: uploadImage, isPending: isUploadingCover } = useUploadImage();
    const { mutateAsync: postVideo, isPending: isPosting } = usePostVideo();

    // 封面图片 URL 状态
    const [coverUrl, setCoverUrl] = useState<string>('');

    // 判断当前是否有任务
    const hasTasks = Object.keys(tasks).length > 0;

    // 检查是否所有视频都上传完成了
    const isAllUploaded =
        hasTasks && Object.values(tasks).every((t: any) => t.status === 'success');

    const isUploadingVideo =
        hasTasks && Object.values(tasks).some((t: any) => t.status === 'uploading');

    // 监听选中的一级分类，动态计算二级分类列表
    const pCategoryId = Form.useWatch('pCategoryId', form);
    const subCategoryList = useMemo(() => {
        if (!pCategoryId) return [];
        const parent = categoryList.find((c: any) => c.categoryId === pCategoryId);
        return parent?.children || [];
    }, [pCategoryId, categoryList]);

    // 自定义封面上传逻辑
    const handleCoverUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            const url = await uploadImage(file);
            setCoverUrl(url);
            form.setFieldsValue({ cover: url }); // 同步到表单以便校验
            onSuccess('ok');
        } catch (error) {
            onError(error);
        }
    };

    // 表单提交
    const onFinish = async (values: any) => {
        if (!isAllUploaded) {
            message.warning('请等待视频上传完成，或移除失败的任务！');
            return;
        }

        // 1. 整理互动设置 interaction (0=关弹幕, 1=关评论)
        const interactions: string[] = [];
        if (!values.interaction.includes('allowDanmaku')) interactions.push('0');
        if (!values.interaction.includes('allowComment')) interactions.push('1');

        // 2. 整理上传文件列表 uploadFileList
        const fileList = Object.values(tasks).map((task: any, index: number) => ({
            uploadId: task.uploadId || task.uid,
            fileName: task.name || `分P_${index + 1}`,
            fileIndex: index + 1,
        }));

        // 3. 构造请求参数
        const params = {
            videoCover: coverUrl,
            videoName: values.title,
            pCategoryId: values.pCategoryId,
            categoryId: values.categoryId,
            postType: values.type === 'original' ? 0 : 1, // 0为自制 1为转载
            tags: values.tags.join(','), // 数组转逗号分隔字符串
            introduction: values.description,
            interaction: interactions.join(','), // 例如 "0,1"
            uploadFileList: JSON.stringify(fileList), // 要求为 JSON 字符串
        };

        try {
            await postVideo(params);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-end justify-between border-b border-gray-100 pb-4">
                <div>
                    <div className="text-[22px] font-bold text-[#5b2b3b]">投稿管理</div>
                    <div className="mt-1 text-[13px] text-[#9b6a7c]">
                        上传、编辑并管理你的原创作品
                    </div>
                </div>
            </div>

            {!hasTasks ? (
                <EmptyUploadPanel
                    handleCustomRequest={handleCustomRequest}
                    uploadingCount={uploadingCount}
                />
            ) : (
                <div className="flex gap-6">
                    <div className="flex-1 space-y-6">
                        {/* 1. 文件上传区 */}
                        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-base font-bold text-[#5b2b3b]">
                                文件上传 ({Object.keys(tasks).length}P)
                            </h3>
                            <div className="space-y-4">
                                {Object.values(tasks).map((task: any, index) => (
                                    <div
                                        key={task.uid}
                                        className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 border border-gray-100"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded bg-[#fff0f5] text-[#fb7299]">
                                            <VideoCameraOutlined className="text-xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">
                                                    分P {index + 1}{' '}
                                                    {task.status === 'success' && (
                                                        <CheckCircleFilled className="text-green-500 ml-1" />
                                                    )}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {task.status === 'uploading'
                                                        ? '正在上传...'
                                                        : task.status === 'success'
                                                          ? '上传成功'
                                                          : '等待/失败'}
                                                </span>
                                            </div>
                                            <Progress
                                                percent={task.percent}
                                                size="small"
                                                strokeColor="#fb7299"
                                                status={
                                                    task.status === 'fail' ? 'exception' : 'normal'
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Upload
                                multiple
                                customRequest={handleCustomRequest}
                                showUploadList={false}
                                accept="video/*"
                            >
                                <Button
                                    type="dashed"
                                    className="mt-4 border-[#ffc0d4] text-[#fb7299] hover:text-[#fb7299] hover:border-[#fb7299]"
                                    icon={<PlusOutlined />}
                                >
                                    继续添加分P
                                </Button>
                            </Upload>
                        </div>

                        {/* 2. 基本信息表单区 */}
                        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="mb-6 text-base font-bold text-[#5b2b3b]">基本信息</h3>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                initialValues={{
                                    type: 'original',
                                    interaction: ['allowComment', 'allowDanmaku'],
                                }}
                            >
                                <div className="flex gap-8">
                                    {/* 左侧封面上传 */}
                                    <div className="w-48 shrink-0">
                                        <Form.Item
                                            label={
                                                <span className="font-semibold text-gray-700">
                                                    视频封面
                                                </span>
                                            }
                                            name="cover"
                                            rules={[{ required: true, message: '请上传视频封面' }]}
                                        >
                                            <Upload
                                                listType="picture-card"
                                                className="cover-uploader"
                                                showUploadList={false}
                                                customRequest={handleCoverUpload}
                                                accept="image/*"
                                            >
                                                {coverUrl ? (
                                                    <img
                                                        src={coverUrl}
                                                        alt="cover"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-gray-400">
                                                        {isUploadingCover ? (
                                                            <LoadingOutlined className="text-2xl" />
                                                        ) : (
                                                            <PlusOutlined className="text-2xl" />
                                                        )}
                                                        <div className="mt-2 text-xs">
                                                            {isUploadingCover
                                                                ? '上传中...'
                                                                : '上传封面'}
                                                        </div>
                                                    </div>
                                                )}
                                            </Upload>
                                        </Form.Item>
                                        <p className="text-xs text-gray-400 -mt-2 leading-relaxed">
                                            建议尺寸: 1920*1080
                                            <br />
                                            支持 JPG/PNG，大小不超 5MB
                                        </p>
                                    </div>

                                    {/* 右侧常规信息 */}
                                    <div className="flex-1">
                                        <Form.Item
                                            label={
                                                <span className="font-semibold text-gray-700">
                                                    标题
                                                </span>
                                            }
                                            name="title"
                                            rules={[{ required: true, message: '请输入视频标题' }]}
                                        >
                                            <Input
                                                placeholder="请输入稿件标题（最多 80 个字）"
                                                maxLength={80}
                                                showCount
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={
                                                <span className="font-semibold text-gray-700">
                                                    类型
                                                </span>
                                            }
                                            name="type"
                                            required
                                        >
                                            <Radio.Group>
                                                <Radio value="original">自制</Radio>
                                                <Radio value="reprint">转载</Radio>
                                            </Radio.Group>
                                        </Form.Item>

                                        <div className="flex gap-4">
                                            <Form.Item
                                                label={
                                                    <span className="font-semibold text-gray-700">
                                                        分区
                                                    </span>
                                                }
                                                required
                                                className="flex-1"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <div className="flex gap-2">
                                                    <Form.Item
                                                        name="pCategoryId"
                                                        rules={[
                                                            { required: true, message: '必选' },
                                                        ]}
                                                        className="flex-1"
                                                    >
                                                        <Select
                                                            placeholder="一级分区"
                                                            size="large"
                                                            onChange={() =>
                                                                form.setFieldsValue({
                                                                    categoryId: undefined,
                                                                })
                                                            }
                                                        >
                                                            {categoryList.map((c: any) => (
                                                                <Select.Option
                                                                    key={c.categoryId}
                                                                    value={c.categoryId}
                                                                >
                                                                    {c.categoryName}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item name="categoryId" className="flex-1">
                                                        <Select
                                                            placeholder="二级分区(选填)"
                                                            size="large"
                                                            disabled={!subCategoryList.length}
                                                        >
                                                            {subCategoryList.map((c: any) => (
                                                                <Select.Option
                                                                    key={c.categoryId}
                                                                    value={c.categoryId}
                                                                >
                                                                    {c.categoryName}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    <span className="font-semibold text-gray-700">
                                                        标签
                                                    </span>
                                                }
                                                name="tags"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请至少添加一个标签',
                                                    },
                                                ]}
                                                className="flex-[2]"
                                            >
                                                <Select
                                                    mode="tags"
                                                    placeholder="输入后按回车键创建标签"
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </div>

                                        <Form.Item
                                            label={
                                                <span className="font-semibold text-gray-700">
                                                    简介
                                                </span>
                                            }
                                            name="description"
                                        >
                                            <Input.TextArea
                                                placeholder="填写更全面的相关信息，让更多的人能找到你的视频吧"
                                                rows={4}
                                                maxLength={2000}
                                                showCount
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={
                                                <span className="font-semibold text-gray-700">
                                                    互动设置
                                                </span>
                                            }
                                            name="interaction"
                                        >
                                            <Checkbox.Group>
                                                <Checkbox value="allowComment">允许评论</Checkbox>
                                                <Checkbox value="allowDanmaku">允许弹幕</Checkbox>
                                            </Checkbox.Group>
                                        </Form.Item>
                                    </div>
                                </div>

                                {/* 底部操作栏 */}
                                <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        className="bg-[#fb7299] hover:bg-[#ff8eb1] border-none px-12"
                                        loading={isUploadingVideo || isPosting}
                                    >
                                        {isUploadingVideo
                                            ? '视频上传中...'
                                            : isPosting
                                              ? '发布中...'
                                              : '立即投稿'}
                                    </Button>
                                    <Button size="large" disabled={isPosting}>
                                        存草稿
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .cover-uploader .ant-upload.ant-upload-select-picture-card {
                    width: 100%;
                    height: 120px;
                    background-color: #f9fafb;
                    border-radius: 8px;
                    overflow: hidden;
                }
            `,
                }}
            />
        </div>
    );
}
