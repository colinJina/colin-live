import React, { useState, useEffect, useRef } from 'react';
import {
    SmileOutlined,
    PictureOutlined,
    LikeOutlined,
    LikeFilled,
    MessageOutlined,
    MoreOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Input, Dropdown, Tooltip, Spin, message, Popover, Image } from 'antd';
import {
    useComments,
    useDoAction,
    usePostComment,
    useUploadImage,
} from '../../../hooks/queries/useVideo';
import type { CommentData } from '../../../api/video';
import { formatVideoTime, getAvatarSrc } from '../../../utils';
import { useUserStore } from '../../../stores/useUserStore';
import defaultAvatar from '@/assets/icon/user.svg';
import { useLoginModal } from '../../../provider/login-modal-provider';

const EMOJI_LIST = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '🥰',
    '😘',
    '😗',
    '😙',
    '😚',
    '😋',
    '😛',
    '😝',
    '😜',
    '🤪',
    '🤨',
    '🧐',
    '🤓',
    '😎',
    '🥸',
    '🤩',
    '🥳',
    '😏',
    '😒',
    '😞',
    '😔',
    '😟',
    '😕',
    '🙁',
    '☹️',
    '❤️',
    '💔',
    '💖',
    '💗',
    '💓',
    '💞',
    '💕',
    '💘',
    '💝',
    '👍',
    '👎',
    '👏',
    '🙌',
    '🙏',
    '🤝',
    '👀',
    '🔥',
    '✨',
    '🎉',
    '🎊',
];

const CommentInputBox = ({
    placeholder = '发一条友善的评论吧...',
    autoFocus = false,
    isLoading = false,
    onCancel,
    onSubmit,
    allowImage = true, // 一级评论 true，二级回复 false
}: {
    placeholder?: string;
    autoFocus?: boolean;
    isLoading?: boolean;
    onCancel?: () => void;
    allowImage?: boolean;
    onSubmit?: (content: string, clearFn: () => void, imgPath?: string) => void;
}) => {
    const [content, setContent] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const userInfo = useUserStore((state) => state.userInfo);
    const textareaRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
    const isSubmitting = isUploading || isLoading;
    const insertEmoji = (emoji: string) => {
        const textarea = textareaRef.current?.resizableTextArea?.textArea;
        if (!textarea) {
            setContent((prev) => prev + emoji);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.slice(0, start) + emoji + content.slice(end);

        setContent(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        }, 10);
    };

    const handlePictureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            message.warning('请选择有效的图片文件');
            return;
        }

        if (previewUrl) URL.revokeObjectURL(previewUrl);

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setSelectedFile(file);
        e.target.value = '';
    };

    const removeImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            message.warning('评论内容不能为空');
            return;
        }
        if (content.length > 500) {
            message.warning('评论内容不能超过500字');
            return;
        }

        let imgPath: string | undefined;

        if (selectedFile && allowImage) {
            try {
                imgPath = await uploadImage(selectedFile);
            } catch (err) {
                console.error(err);
                return;
            }
        }

        onSubmit?.(
            content,
            () => {
                setContent('');
                removeImage();
            },
            imgPath,
        );
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div className="flex gap-4 w-full">
            <Avatar
                size={40}
                src={userInfo ? getAvatarSrc(userInfo.avatar) : defaultAvatar}
                className="flex-shrink-0 mt-1 shadow-sm"
            />
            <div className="flex-1 flex flex-col rounded-[20px] border border-[#ffdce7] bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(255,243,248,0.88)_100%)] p-3 shadow-[0_8px_16px_rgba(251,114,153,0.06)] focus-within:border-[#ffb6cc] focus-within:ring-2 focus-within:ring-[#fb7299]/10 transition-all">
                {/* TextArea */}
                <Input.TextArea
                    disabled={isSubmitting}
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    autoFocus={autoFocus}
                    className="bg-transparent border-none text-sm !text-[#6f3f55] !shadow-none placeholder:!text-[#c290a5] focus:!shadow-none mb-2 resize-none"
                />

                {/* 图片预览（仅一级评论） */}
                {previewUrl && allowImage && (
                    <div className="relative mt-2 inline-block">
                        <img
                            src={previewUrl}
                            alt="预览"
                            className="w-20 h-20 object-cover rounded-xl border border-[#ffe1ea] shadow-sm"
                        />
                        <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={removeImage}
                            className="absolute -top-1 -right-1 bg-white rounded-full shadow text-[#fb7299] hover:text-[#dd6a90]"
                        />
                    </div>
                )}

                {/* 操作栏 */}
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-4 pl-1 text-[#fb7299]/60">
                        {/* 表情选择器 */}
                        <Popover
                            trigger="click"
                            open={showEmoji}
                            onOpenChange={setShowEmoji}
                            content={
                                <div className="grid grid-cols-8 gap-3 p-4 w-[300px] max-h-[260px] overflow-y-auto">
                                    {EMOJI_LIST.map((emoji) => (
                                        <span
                                            key={emoji}
                                            className="text-3xl cursor-pointer hover:scale-125 active:scale-110 transition-transform"
                                            onClick={() => {
                                                insertEmoji(emoji);
                                                setShowEmoji(false);
                                            }}
                                        >
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                            }
                            placement="top"
                        >
                            <SmileOutlined className="cursor-pointer hover:text-[#fb7299] text-[18px] transition-colors hover:scale-110" />
                        </Popover>

                        {allowImage && (
                            <Tooltip title="添加图片">
                                <div
                                    onClick={!isSubmitting ? handlePictureClick : undefined}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#fb7299]/10 text-[#fb7299] cursor-pointer transition-all active:scale-90 ${isSubmitting ? 'opacity-30 cursor-not-allowed' : ''}`}
                                >
                                    <PictureOutlined style={{ fontSize: '20px' }} />
                                </div>
                            </Tooltip>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {onCancel && (
                            <Button
                                type="text"
                                size="small"
                                disabled={isSubmitting}
                                onClick={() => {
                                    onCancel();
                                    removeImage();
                                }}
                                className="h-8 px-4 rounded-full !text-[#fb7299]/60 hover:!text-[#fb7299] hover:!bg-[#fb7299]/5 border-none font-medium transition-all"
                            >
                                取消
                            </Button>
                        )}
                        <Button
                            type="primary"
                            loading={isSubmitting}
                            onClick={handleSubmit}
                            className="
                h-8 px-6 rounded-full border-none
                bg-[#fb7299] hover:!bg-[#ff85ad] active:!bg-[#e06489]
                text-white font-bold text-sm
                shadow-[0_4px_12px_rgba(251,114,153,0.3)] 
               hover:shadow-[0_6px_16px_rgba(251,114,153,0.4)]
                transition-all duration-300 transform hover:-translate-y-[1px]
            "
                        >
                            发布
                        </Button>
                    </div>
                </div>

                {/* 隐藏的文件输入 */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

const CommentItem = ({
    data,
    videoId,
    isSubComment = false,
}: {
    data: CommentData;
    videoId: string;
    isSubComment?: boolean;
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const { mutateAsync: postComment, isPending: isPosting } = usePostComment();
    const { mutate: doLike, isPending: isLiking } = useDoAction();
    const { openLoginModal } = useLoginModal();
    const userInfo = useUserStore((state) => state.userInfo);
    const handleReplySubmit = async (content: string, clearFn: () => void, imgPath?: string) => {
        try {
            if (!userInfo) {
                openLoginModal();
                return;
            }
            await postComment({
                videoId,
                content,
                replyCommentId: Number(data.commentId),
                imgPath,
            });
            clearFn();
            setIsReplying(false);
        } catch (error) {
            console.log(error);
        }
    };
    const handleLike = () => {
        if (!userInfo) {
            openLoginModal();
            return;
        }
        doLike({
            videoId,
            actionType: 0,
            commentId: Number(data.commentId),
        });
    };
    return (
        <div className={`flex gap-3 ${isSubComment ? 'mb-4 last:mb-0' : 'mb-6'}`}>
            <Avatar
                size={isSubComment ? 32 : 44}
                src={getAvatarSrc(data?.user?.avatar) || defaultAvatar}
                className="flex-shrink-0 shadow-sm border border-[#ffe0ea]"
            />
            <div
                className={`flex-1 ${!isSubComment && 'border-b border-[#ffe1ea]/80 pb-6 last:border-0 last:pb-0'}`}
            >
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-baseline gap-2">
                        <span
                            className={`font-semibold text-[#dd6a90] ${isSubComment ? 'text-xs' : 'text-sm'}`}
                        >
                            {data.user.nickName}
                        </span>
                        {data.replyTo && (
                            <>
                                <span className="text-xs text-[#c290a5] mx-1">回复</span>
                                <span className="font-semibold text-[#dd6a90] text-xs">
                                    @{data.replyTo.nickName}
                                </span>
                            </>
                        )}
                        <span className="text-[11px] text-[#c290a5] ml-1">
                            {formatVideoTime(data.time)}
                        </span>
                    </div>
                    <Dropdown
                        menu={{ items: [{ key: '1', label: '举报' }] }}
                        placement="bottomRight"
                    >
                        <MoreOutlined className="text-[#c290a5] cursor-pointer hover:text-[#fb7299]" />
                    </Dropdown>
                </div>

                <p
                    className={`text-[#6f3f55] leading-relaxed mb-3 whitespace-pre-wrap ${isSubComment ? 'text-xs' : 'text-sm'}`}
                >
                    {data.content}
                </p>

                {data.images && data.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Image.PreviewGroup>
                            {data.images.map((img, i) => (
                                <Image
                                    key={i}
                                    src={getAvatarSrc(img)}
                                    width={100}
                                    height={100}
                                    className="object-cover rounded-xl border border-[#ffe1ea] shadow-sm hover:opacity-90 transition-opacity"
                                    alt="配图"
                                />
                            ))}
                        </Image.PreviewGroup>
                    </div>
                )}

                <div className="flex items-center gap-5 text-[#c290a5] text-xs">
                    <span
                        className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                            data.isLiked ? 'text-[#fb7299]' : 'hover:text-[#fb7299]'
                        } ${isLiking ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={handleLike}
                    >
                        {data.isLiked ? (
                            <LikeFilled className="text-sm" />
                        ) : (
                            <LikeOutlined className="text-sm" />
                        )}
                        {data.likes ?? 0}
                    </span>

                    <span
                        className="flex items-center gap-1.5 cursor-pointer hover:text-[#fb7299] transition-colors"
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        <MessageOutlined className="text-sm" /> 回复
                    </span>
                </div>

                {isReplying && (
                    <div className="mt-4">
                        <CommentInputBox
                            placeholder={`回复 @${data.user.nickName} :`}
                            autoFocus
                            isLoading={isPosting}
                            onCancel={() => setIsReplying(false)}
                            onSubmit={handleReplySubmit}
                            allowImage={true}
                        />
                    </div>
                )}

                {data.replies && data.replies.length > 0 && (
                    <div className="mt-4 rounded-[20px] bg-white/50 p-4 border border-[#ffe0ea] shadow-[inset_0_2px_10px_rgba(251,114,153,0.03)]">
                        {data.replies.map((reply) => (
                            <CommentItem
                                key={reply.commentId}
                                data={reply}
                                videoId={videoId}
                                isSubComment={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface VideoCommentSectionProps {
    videoId: string | undefined;
}

export default function VideoCommentSection({ videoId }: VideoCommentSectionProps) {
    const {
        comments,
        totalCount,
        isLoading,
        isFetchingNextPage,
        hasMore,
        fetchNextPage,
        orderType,
        setOrderType,
    } = useComments(videoId ?? '');
    const { mutateAsync: postComment, isPending: isPostingTop } = usePostComment();
    const { openLoginModal } = useLoginModal();
    const userInfo = useUserStore((state) => state.userInfo);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) fetchNextPage();
            },
            { threshold: 0.1 },
        );
        const currentRef = loadMoreRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [hasMore, isFetchingNextPage, fetchNextPage]);

    const handleTopLevelSubmit = async (content: string, clearFn: () => void, imgPath?: string) => {
        if (!videoId) return;
        if (!userInfo) {
            openLoginModal();
            return;
        }
        try {
            await postComment({
                videoId,
                content,
                imgPath,
            });
            clearFn();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,238,245,0.98)_55%,rgba(255,230,240,0.98)_100%)] shadow-[0_22px_52px_rgba(251,114,153,0.14)] ring-1 ring-[#ffdbe6]/70 p-6 md:p-8">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#dd6a90] flex items-baseline gap-3 m-0">
                        全部评论
                        <span className="text-xs font-normal text-[#c290a5] tracking-wide bg-white/60 px-2 py-0.5 rounded-full border border-[#ffe0ea]">
                            {totalCount.toLocaleString()}
                        </span>
                    </h3>
                    <div className="text-xs flex gap-3 text-[#c290a5]">
                        <span
                            className={`cursor-pointer hover:text-[#fb7299] ${orderType === 0 ? 'font-bold text-[#fb7299]' : ''}`}
                            onClick={() => setOrderType(0)}
                        >
                            最热
                        </span>
                        <span className="w-px bg-[#ffe1ea]"></span>
                        <span
                            className={`cursor-pointer hover:text-[#fb7299] ${orderType === 1 ? 'font-bold text-[#fb7299]' : ''}`}
                            onClick={() => setOrderType(1)}
                        >
                            最新
                        </span>
                    </div>
                </div>

                <div className="mb-10 pb-8 border-b border-[#ffe1ea]/80">
                    <CommentInputBox isLoading={isPostingTop} onSubmit={handleTopLevelSubmit} />
                </div>

                <div className="flex flex-col">
                    {comments.length > 0
                        ? comments.map((comment) => (
                              <CommentItem
                                  key={comment.commentId}
                                  data={comment}
                                  videoId={videoId!}
                              />
                          ))
                        : !isLoading && (
                              <div className="text-center text-[#c290a5] py-8">
                                  暂无评论，快来抢沙发吧~
                              </div>
                          )}
                </div>

                <div ref={loadMoreRef} className="text-center py-6 h-10">
                    {(isLoading || isFetchingNextPage) && <Spin />}
                    {!hasMore && comments.length > 0 && (
                        <span className="text-xs text-[#c290a5]">没有更多评论啦~</span>
                    )}
                </div>
            </div>
        </div>
    );
}
