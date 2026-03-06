import { Button, Spin } from 'antd';
import { useEffect, useMemo, useRef } from 'react';

import type { VideoInfo } from '../../../api/video';
import { useLoadVideoByCategory } from '../../../hooks/queries/useVideo';
import { cn, getAvatarSrc } from '../../../utils';

export type DetailVideoProps = {
    pCategoryId?: number;
    categoryId?: number;
    className?: string;
};

function VideoCard({ video }: { video: VideoInfo }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(24,25,28,0.08)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5">
            <img
                src={getAvatarSrc(video.videoCover)}
                alt=""
                className="aspect-video w-full bg-[#f7f8fa] object-cover"
                loading="lazy"
            />
            <div className="p-3">
                <div className="line-clamp-2 text-[13px] font-medium text-[#18191c]">
                    视频 ID：{video.videoId}
                </div>
                <div className="mt-1 text-[12px] text-[#9499a0]">暂无更多字段可展示</div>
            </div>
        </div>
    );
}

export default function VideoCardPage({ pCategoryId, categoryId, className }: DetailVideoProps) {
    const enabled = Boolean(pCategoryId);
    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch,
        isError,
    } = useLoadVideoByCategory({
        pCategoryId,
        categoryId,
        enabled,
    });

    const flatList = useMemo(() => data?.pages.flatMap((p) => p.list) ?? [], [data]);
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

    if (!enabled) {
        return (
            <div
                className={cn(
                    'mt-3 rounded-2xl bg-[#f7f8fa] px-4 py-4 text-sm text-[#9499a0]',
                    className,
                )}
            >
                请选择分类查看视频
            </div>
        );
    }

    return (
        <div className={cn('mt-3', className)}>
            {isError && (
                <div className="rounded-2xl bg-[#fff2f5] px-4 py-4 text-sm text-[#61666d]">
                    <div>视频加载失败，请稍后重试</div>
                    <div className="mt-3">
                        <Button onClick={() => refetch()} className="rounded-xl!">
                            重试
                        </Button>
                    </div>
                </div>
            )}

            {!isError && isLoading && (
                <div className="flex items-center justify-center rounded-2xl bg-white/95 px-4 py-10 ring-1 ring-black/5">
                    <Spin />
                </div>
            )}

            {!isError && !isLoading && flatList.length === 0 && (
                <div className="rounded-2xl bg-[#f7f8fa] px-4 py-4 text-sm text-[#9499a0]">
                    暂无视频数据
                </div>
            )}

            {!isError && flatList.length > 0 && (
                <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {flatList.map((video, idx) => (
                            <VideoCard key={`${video.videoId}-${idx}`} video={video} />
                        ))}
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-3">
                        {hasNextPage ? (
                            <Button
                                onClick={() => fetchNextPage()}
                                loading={isFetchingNextPage}
                                className="rounded-xl!"
                            >
                                加载更多
                            </Button>
                        ) : (
                            <div className="text-xs text-[#9499a0]">没有更多了</div>
                        )}

                        <div ref={sentinelRef} className="h-1 w-full" />
                    </div>
                </>
            )}

            {!isError && isFetching && !isLoading && flatList.length > 0 && (
                <div className="mt-3 flex items-center justify-center text-xs text-[#9499a0]">
                    加载中...
                </div>
            )}
        </div>
    );
}
