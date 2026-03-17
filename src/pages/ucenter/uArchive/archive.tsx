import { Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useLoadVideoList } from '../../../hooks/queries/useVideo';

import { EmptyPanel } from './archive-components';
import VideoItem from './archive-video-item';
export default function UcenterArchive() {
    const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'approved' | 'rejected'>(
        'processing',
    );
    const [keyword, setKeyword] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');

    useEffect(() => {
        const t = window.setTimeout(() => setDebouncedKeyword(keyword.trim()), 350);
        return () => window.clearTimeout(t);
    }, [keyword]);

    const status = useMemo(() => {
        // 你的约定：进行中 -> -1；已通过 -> 3；未通过 -> 4；全部稿件不传 status
        if (activeTab === 'processing') return -1;
        if (activeTab === 'approved') return 3;
        if (activeTab === 'rejected') return 4;
        return undefined;
    }, [activeTab]);

    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isError,
        refetch,
    } = useLoadVideoList({
        enabled: true,
        status,
        videoNameFuzzy: debouncedKeyword || undefined,
    });

    const flatList = useMemo(() => data?.pages.flatMap((p) => p.list) ?? [], [data]);
    const totalCount = data?.pages?.[0]?.totalCount ?? 0;

    const tabs = useMemo(
        () => [
            {
                key: 'all' as const,
                name: '全部稿件',
                count: activeTab === 'all' ? totalCount : undefined,
            },
            {
                key: 'processing' as const,
                name: '进行中',
                count: activeTab === 'processing' ? totalCount : undefined,
            },
            {
                key: 'approved' as const,
                name: '已通过',
                count: activeTab === 'approved' ? totalCount : undefined,
            },
            {
                key: 'rejected' as const,
                name: '未通过',
                count: activeTab === 'rejected' ? totalCount : undefined,
            },
        ],
        [activeTab, totalCount],
    );

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
        <div className="space-y-6">
            {/* 头部标题与搜索 */}
            <div className="flex items-end justify-between border-b border-[#ffe1ec] pb-4">
                <div>
                    <div className="text-[18px] font-bold text-[#5b2b3b]">内容管理</div>
                    <div className="mt-1 text-[12px] text-[#9b6a7c]">管理稿件的状态与数据</div>
                </div>

                <div className="flex items-center rounded-full border border-[#ffe1ec] bg-white px-3 py-1.5 shadow-[0_2px_10px_rgba(251,114,153,0.04)] transition-all focus-within:border-[#fb7299] focus-within:ring-2 focus-within:ring-[#fff7fb]">
                    <input
                        type="text"
                        placeholder="搜索稿件"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="ml-2 w-48 bg-transparent text-[13px] text-[#5b2b3b] outline-none placeholder:text-[#9b6a7c]/60"
                    />
                </div>
            </div>

            {/* 状态 Tab */}
            <div className="flex gap-8 text-[14px]">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative pb-2 transition-colors ${
                            activeTab === tab.key
                                ? 'font-semibold text-[#fb7299]'
                                : 'text-[#9b6a7c] hover:text-[#fb7299]'
                        }`}
                    >
                        {tab.name} {typeof tab.count === 'number' ? tab.count : ''}
                        {activeTab === tab.key && (
                            <div className="absolute bottom-0 left-1/2 h-[3px] w-full -translate-x-1/2 rounded-t-full bg-[#fb7299]" />
                        )}
                    </button>
                ))}
            </div>

            {/* 视频列表区 */}
            <div className="flex flex-col gap-2">
                {isError && (
                    <div className="rounded-[16px] border border-[#ffe1ec] bg-white p-4 text-[13px] text-[#5b2b3b]">
                        <div>稿件加载失败，请稍后重试</div>
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
                    <EmptyPanel title="还没有稿件" desc="开始投稿，内容就会出现在这里。" />
                )}

                {!isError && flatList.length > 0 && (
                    <>
                        {flatList.map((video) => (
                            <React.Fragment key={video.videoId}>
                                <VideoItem video={video} />
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
                    </>
                )}

                {!isError && isFetching && !isLoading && flatList.length > 0 && (
                    <div className="mt-2 flex items-center justify-center text-[12px] text-[#9b6a7c]">
                        加载中...
                    </div>
                )}
            </div>
        </div>
    );
}
