import { Popconfirm, Spin } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';

import type { VideoDanmu } from '../../api/video';
import DeleteIcon from '../../assets/icon/comment-delete.svg?react';
import { useDelUcenterDanmu, useLoadUcenterDanmu } from '../../hooks/queries/useVideo';
import { formatVideoTime, getAvatarSrc } from '../../utils';

import { EmptyPanel } from './uArchive/archive-components';

export default function UcenterDanmaku() {
    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isError,
        refetch,
    } = useLoadUcenterDanmu({ enabled: true });

    const { mutate: delOne, isPending: isDeleting } = useDelUcenterDanmu();

    const flatList = useMemo(() => data?.pages.flatMap((p) => p.list) ?? [], [data]);
    const totalCount = data?.pages?.[0]?.totalCount ?? 0;

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || !hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting || isFetchingNextPage) return;
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
                    <div className="text-[18px] font-bold text-[#5b2b3b]">
                        {'\u5f39\u5e55\u7ba1\u7406'}
                    </div>
                    <div className="text-[12px] text-[#9b6a7c]">
                        {typeof totalCount === 'number' ? `\u5171 ${totalCount} \u6761` : ''}
                    </div>
                </div>
                <div className="mt-1 text-[12px] text-[#9b6a7c]">
                    {
                        '\u67e5\u770b\u5e76\u7ba1\u7406\u4f5c\u54c1\u6536\u5230\u7684\u5f39\u5e55\u5185\u5bb9'
                    }
                </div>
            </div>

            {isError && (
                <div className="rounded-[16px] border border-[#ffe1ec] bg-white p-4 text-[13px] text-[#5b2b3b]">
                    <div>
                        {'\u5f39\u5e55\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5'}
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 rounded-[10px] border border-[#ffe1ec] bg-[#fff7fb] px-4 py-1.5 text-[13px] text-[#fb7299] hover:border-[#fb7299]"
                    >
                        {'\u91cd\u8bd5'}
                    </button>
                </div>
            )}

            {!isError && isLoading && (
                <div className="flex items-center justify-center rounded-[16px] border border-[#ffe1ec] bg-white p-10">
                    <Spin />
                </div>
            )}

            {!isError && !isLoading && flatList.length === 0 && (
                <EmptyPanel
                    title={'\u6682\u65e0\u5f39\u5e55'}
                    desc={
                        '\u4f5c\u54c1\u6709\u5f39\u5e55\u65f6\uff0c\u53ef\u4ee5\u5728\u8fd9\u91cc\u8fdb\u884c\u7ba1\u7406\u3002'
                    }
                />
            )}

            {!isError && flatList.length > 0 && (
                <div className="flex flex-col gap-2">
                    {flatList.map((danmu) => (
                        <React.Fragment key={String(danmu.danmuId)}>
                            <DanmuRow
                                danmu={danmu}
                                isDeleting={isDeleting}
                                onDelete={(danmuId) => delOne(danmuId)}
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
                                {isFetchingNextPage
                                    ? '\u52a0\u8f7d\u4e2d...'
                                    : '\u52a0\u8f7d\u66f4\u591a'}
                            </button>
                        ) : (
                            <div className="text-[12px] text-[#9b6a7c]">
                                {'\u6ca1\u6709\u66f4\u591a\u4e86'}
                            </div>
                        )}
                        <div ref={sentinelRef} className="h-1 w-full" />
                    </div>

                    {isFetching && !isLoading && (
                        <div className="mt-2 flex items-center justify-center text-[12px] text-[#9b6a7c]">
                            {'\u52a0\u8f7d\u4e2d...'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function DanmuRow({
    danmu,
    isDeleting,
    onDelete,
}: {
    danmu: VideoDanmu;
    isDeleting: boolean;
    onDelete: (danmuId: number) => void;
}) {
    const videoCover = getAvatarSrc(danmu.videoCover);
    const time = danmu.createTime || danmu.postTime || '';
    const danmuId = Number(danmu.danmuId);
    const content = danmu.text?.trim() || danmu.content?.trim() || '';
    const senderName = danmu.nickName || danmu.userName || '\u533f\u540d\u7528\u6237';
    const videoTitle =
        danmu.videoName ||
        (danmu.videoId ? `\u89c6\u9891 ${danmu.videoId}` : '\u672a\u547d\u540d\u89c6\u9891');
    const showTime = Number(danmu.time ?? danmu.videoTime ?? danmu.showTime ?? 0);

    return (
        <div className="flex gap-5 rounded-[16px] border border-transparent p-4 transition-all hover:border-[#ffe1ec] hover:bg-[#fff7fb] hover:shadow-[0_8px_20px_rgba(251,114,153,0.06)]">
            <div className="relative h-[80px] w-[128px] flex-shrink-0 overflow-hidden rounded-[12px] bg-[#ffe1ec]">
                {videoCover ? (
                    <img
                        src={videoCover}
                        alt={videoTitle}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center px-3 text-center text-[12px] text-[#ff8fb3]">
                        {'\u5f39\u5e55'}
                    </div>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="line-clamp-1 text-[14px] font-semibold text-[#5b2b3b]">
                            {videoTitle}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#9b6a7c]">
                            <span>{senderName}</span>
                            <span>{time ? formatVideoTime(time) : ''}</span>
                            <span>{`\u51fa\u73b0\u4e8e ${formatDanmuSecond(showTime)}`}</span>
                        </div>
                    </div>

                    <Popconfirm
                        title={'\u786e\u5b9a\u5220\u9664\u8fd9\u6761\u5f39\u5e55\u5417\uff1f'}
                        description={'\u5220\u9664\u540e\u4e0d\u53ef\u6062\u590d\u3002'}
                        okText={'\u5220\u9664'}
                        cancelText={'\u53d6\u6d88'}
                        okButtonProps={{ danger: true, loading: isDeleting }}
                        onConfirm={() => {
                            if (!Number.isFinite(danmuId)) return;
                            onDelete(danmuId);
                        }}
                    >
                        <button
                            aria-label={'\u5220\u9664\u5f39\u5e55'}
                            disabled={isDeleting || !Number.isFinite(danmuId)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[#ffe1ec] bg-white text-[#9b6a7c] shadow-sm transition-all hover:border-[#fb7299] hover:bg-[#fff7fb] hover:text-[#fb7299] disabled:opacity-60"
                        >
                            <DeleteIcon className="h-4 w-4" />
                        </button>
                    </Popconfirm>
                </div>

                <div className="rounded-[14px] border border-[#ffe6ef] bg-white/80 px-4 py-3 text-[14px] leading-6 text-[#5b2b3b] break-words">
                    {content || '---'}
                </div>
            </div>
        </div>
    );
}

function formatDanmuSecond(value: number) {
    const seconds = Math.max(0, Math.floor(value));
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}
