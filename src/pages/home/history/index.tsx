import { useEffect, useRef, useMemo } from 'react';
import { ClockCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { Timeline, Spin } from 'antd';

import { HistoryVideoCard, type HistoryVideoInfo } from './components/history-video-card';
import { useHistory } from '../../../hooks/queries/useHistory';

export default function History() {
    const { list, isLoading, isFetchingNextPage, hasMore, fetchNextPage } = useHistory();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );
        const currentRef = loadMoreRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [hasMore, isFetchingNextPage, fetchNextPage]);

    const groupedData = useMemo(() => {
        const groups: { date: string; videos: HistoryVideoInfo[] }[] = [];
        const groupMap: Record<string, HistoryVideoInfo[]> = {};

        list.forEach((video) => {
            const dateKey = video.lastUpdateTime ? video.lastUpdateTime.split(' ')[0] : '未知时间';
            if (!groupMap[dateKey]) {
                groupMap[dateKey] = [];
                groups.push({ date: dateKey, videos: groupMap[dateKey] });
            }
            groupMap[dateKey].push(video as unknown as HistoryVideoInfo);
        });
        return groups;
    }, [list]);

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col">
            <div className="mb-8 flex items-center gap-3 pl-2 shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fb7299_0%,#ff9fbe_100%)] text-white shadow-[0_4px_12px_rgba(251,114,153,0.3)]">
                    <ClockCircleOutlined className="text-xl" />
                </div>
                <h1 className="text-2xl font-bold tracking-wide text-[#5a3040]">历史记录</h1>
            </div>

            <div className="flex-1 rounded-[32px] border border-[#ffd6e3]/50 bg-[linear-gradient(135deg,rgba(255,250,252,0.8)_0%,rgba(255,240,245,0.6)_100%)] p-6 shadow-[0_16px_40px_-16px_rgba(251,114,153,0.1)] backdrop-blur-xl md:p-10 flex flex-col">
                {isLoading && list.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center py-32">
                        <Spin size="large" />
                    </div>
                ) : groupedData.length > 0 ? (
                    <div className="flex-1">
                        <Timeline
                            className="mt-2"
                            items={groupedData.map((group, index) => ({
                                dot:
                                    index === 0 ? (
                                        <div className="h-3.5 w-3.5 rounded-full bg-[#fb7299] shadow-[0_0_8px_#fb7299]" />
                                    ) : (
                                        <div className="h-3 w-3 rounded-full border-2 border-[#ffb6cc] bg-white" />
                                    ),
                                color: '#fb7299',
                                children: (
                                    <div className="mb-10 pl-4">
                                        <h2 className="mb-5 text-xl font-bold text-[#6d3b4d]">
                                            {group.date}
                                        </h2>
                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                            {group.videos.map((video) => (
                                                <HistoryVideoCard
                                                    key={video.videoId}
                                                    video={video}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ),
                            }))}
                        />

                        <div ref={loadMoreRef} className="h-4 w-full" />

                        {isFetchingNextPage && (
                            <div className="text-center py-4 text-sm text-[#9499a0]">
                                正在加载更多...
                            </div>
                        )}
                        {!hasMore && groupedData.length > 0 && (
                            <div className="text-center py-4 text-sm text-[#9499a0]">
                                没有更多记录了
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 items-center justify-center py-32 text-[#ffb6cc]">
                        <SmileOutlined className="mb-4 text-5xl opacity-80" />
                        <p className="text-[15px] font-medium tracking-widest text-[#8a5065]">
                            还没有留下历史足迹呢 ~
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
