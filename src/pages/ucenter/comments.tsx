import { EmptyPanel } from './uArchive/archive-components';
import { Popconfirm, Spin } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';

import type { VideoComment } from '../../api/video';
import { useDelUcenterComment, useLoadUcenterComments } from '../../hooks/queries/useVideo';
import { formatVideoTime, getAvatarSrc } from '../../utils';

import DeleteIcon from '../../assets/icon/comment-delete.svg?react';

export default function UcenterComments() {
    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isError,
        refetch,
    } = useLoadUcenterComments({ enabled: true });

    const { mutate: delOne, isPending: isDeleting } = useDelUcenterComment();

    const flatList = useMemo(() => data?.pages.flatMap((p) => p.list) ?? [], [data]);
    const totalCount = data?.pages?.[0]?.totalCount ?? 0;

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        if (!hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                if (isFetchingNextPage) return;
                void fetchNextPage();
            },
            { rootMargin: '240px 0px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-baseline justify-between gap-3">
                    <div className="text-[18px] font-bold text-[#5b2b3b]">评论管理</div>
                    <div className="text-[12px] text-[#9b6a7c]">
                        {typeof totalCount === 'number' ? `共 ${totalCount} 条` : ''}
                    </div>
                </div>
                <div className="mt-1 text-[12px] text-[#9b6a7c]">查看并回复收到的评论</div>
            </div>

            {isError && (
                <div className="rounded-[16px] border border-[#ffe1ec] bg-white p-4 text-[13px] text-[#5b2b3b]">
                    <div>评论加载失败，请稍后重试</div>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 rounded-[10px] border border-[#ffe1ec] bg-[#fff7fb] px-4 py-1.5 text-[13px] text-[#fb7299] hover:border-[#fb7299]"
                    >
                        重试
                    </button>
                </div>
            )}

            {!isError && isLoading && (
                <div className="flex items-center justify-center rounded-[16px] border border-[#ffe1ec] bg-white p-10">
                    <Spin />
                </div>
            )}

            {!isError && !isLoading && flatList.length === 0 && (
                <EmptyPanel title="暂无评论" desc="当作品收到评论时，会显示在这里。" />
            )}

            {!isError && flatList.length > 0 && (
                <div className="flex flex-col gap-2">
                    {flatList.map((c) => (
                        <React.Fragment key={String(c.commentId)}>
                            <CommentRow
                                comment={c}
                                isDeleting={isDeleting}
                                onDelete={(commentId) => delOne(commentId)}
                            />
                            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[#ffe1ec] to-transparent opacity-50 last:hidden" />
                        </React.Fragment>
                    ))}

                    <div className="mt-2 flex flex-col items-center gap-3">
                        {hasNextPage ? (
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="rounded-[12px] border border-[#ffe1ec] bg-white px-5 py-2 text-[13px] text-[#5b2b3b] shadow-sm transition-all hover:border-[#fb7299] hover:text-[#fb7299] disabled:opacity-60"
                            >
                                {isFetchingNextPage ? '加载中...' : '加载更多'}
                            </button>
                        ) : (
                            <div className="text-[12px] text-[#9b6a7c]">没有更多了</div>
                        )}
                        <div ref={sentinelRef} className="h-1 w-full" />
                    </div>

                    {isFetching && !isLoading && (
                        <div className="mt-2 flex items-center justify-center text-[12px] text-[#9b6a7c]">
                            加载中...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function CommentRow({
    comment,
    isDeleting,
    onDelete,
}: {
    comment: VideoComment;
    isDeleting: boolean;
    onDelete: (commentId: number) => void;
}) {
    const userName = comment.nickName || comment.userName || '匿名用户';
    const userAvatar = getAvatarSrc(comment.avatar);
    const videoCover = getAvatarSrc(comment.videoCover);
    const time = comment.postTime || comment.createTime || '';
    const commentId = Number(comment.commentId);

    return (
        <div className="flex gap-5 rounded-[16px] border border-transparent p-4 transition-all hover:border-[#ffe1ec] hover:bg-[#fff7fb] hover:shadow-[0_8px_20px_rgba(251,114,153,0.06)]">
            {/* 视频封面 */}
            <div className="relative h-[80px] w-[128px] flex-shrink-0 overflow-hidden rounded-[12px] bg-[#ffe1ec]">
                {videoCover ? (
                    <img
                        src={videoCover}
                        alt={comment.videoName || '视频封面'}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#ffb8d2] text-[12px]">
                        无封面
                    </div>
                )}
            </div>

            {/* 评论信息 */}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-[#ffe1ec]">
                            {userAvatar ? (
                                <img
                                    src={userAvatar}
                                    alt={userName}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : null}
                        </div>
                        <div className="min-w-0">
                            <div className="text-[13px] font-medium text-[#5b2b3b] line-clamp-1">
                                {userName}
                            </div>
                            <div className="text-[11px] text-[#9b6a7c]">
                                {time ? formatVideoTime(time) : ''}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="text-[12px] text-[#9b6a7c]">
                            赞 {comment.likeCount ?? 0}
                        </div>
                        <Popconfirm
                            title="确定删除这条评论吗？"
                            description="删除后不可恢复"
                            okText="删除"
                            cancelText="取消"
                            okButtonProps={{ danger: true, loading: isDeleting }}
                            onConfirm={() => {
                                if (!Number.isFinite(commentId)) return;
                                onDelete(commentId);
                            }}
                        >
                            <button
                                aria-label="删除评论"
                                disabled={isDeleting || !Number.isFinite(commentId)}
                                className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#ffe1ec] bg-white text-[#9b6a7c] shadow-sm transition-all hover:border-[#fb7299] hover:text-[#fb7299] hover:bg-[#fff7fb] disabled:opacity-60"
                            >
                                <DeleteIcon className="h-4 w-4" />
                            </button>
                        </Popconfirm>
                    </div>
                </div>

                <div className="text-[14px] leading-6 text-[#5b2b3b] break-words">
                    {comment.replyNickName ? (
                        <span className="mr-1 text-[#9b6a7c]">
                            回复 <span className="text-[#fb7299]">@{comment.replyNickName}</span>：
                        </span>
                    ) : null}
                    {comment.content || ''}
                </div>

                <div className="text-[12px] text-[#9b6a7c]">
                    {comment.videoName ? (
                        <span className="line-clamp-1">来自视频：{comment.videoName}</span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
