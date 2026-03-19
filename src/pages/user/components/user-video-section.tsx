import EmptyState from './empty-state';
import { Button, Spin } from 'antd';
import { useEffect, useRef } from 'react';

import type { VideoInfo } from '../../../api/video';
import { VideoCard } from '../../home/components/video-card';

export type VideoSortKey = 'latest' | 'most_played' | 'most_collected';

export interface UserVideoSectionProps {
    videos?: VideoInfo[];
    isLoading?: boolean;
    isError?: boolean;
    isFetchingNextPage?: boolean;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
    onRetry?: () => void;
    emptyStateTitle?: string;
}

export default function UserVideoSection({
    videos,
    isLoading = false,
    isError = false,
    isFetchingNextPage = false,
    hasNextPage = false,
    fetchNextPage,
    onRetry,
    emptyStateTitle,
}: UserVideoSectionProps) {
    const list = videos ?? [];
    const isEmpty = list.length === 0;

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        if (!hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                if (!fetchNextPage) return;
                if (isFetchingNextPage) return;
                fetchNextPage();
            },
            { rootMargin: '240px 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <section className="rounded-[32px] border border-[#ffd6e3]/50 bg-[linear-gradient(135deg,rgba(255,248,251,0.96)_0%,rgba(255,229,240,0.92)_100%)] p-6 shadow-[0_32px_64px_-16px_rgba(251,114,153,0.2)] backdrop-blur-2xl transition-all duration-300 md:p-8">
            {isError ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-[#fff2f5]/60 px-4 py-12 text-sm text-[#c26683] backdrop-blur-sm">
                    <div className="font-semibold">视频加载失败，请稍后重试</div>
                    <div className="mt-4">
                        <Button
                            onClick={() => onRetry?.()}
                            disabled={!onRetry}
                            className="h-10 rounded-xl! border-none bg-[linear-gradient(135deg,#fb7299_0%,#ff9fbe_100%)] text-white shadow-[0_8px_20px_rgba(251,114,153,0.3)] transition-transform hover:scale-105 active:scale-95"
                        >
                            重新加载
                        </Button>
                    </div>
                </div>
            ) : isLoading ? (
                <div className="flex items-center justify-center rounded-2xl bg-white/40 px-4 py-20 backdrop-blur-sm">
                    <Spin size="large" />
                </div>
            ) : isEmpty ? (
                <EmptyState title={emptyStateTitle} />
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {list.map((video) => (
                            <VideoCard key={video.videoId} video={video} variant="profile" />
                        ))}
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-3">
                        {hasNextPage ? (
                            <div className="text-xs text-[#9499a0]">...</div>
                        ) : (
                            <div className="text-xs text-[#9499a0]">没有更多了</div>
                        )}
                        <div ref={sentinelRef} className="h-1 w-full" />
                    </div>

                    {isFetchingNextPage && (
                        <div className="mt-3 flex items-center justify-center text-xs text-[#9499a0]">
                            加载中...
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
