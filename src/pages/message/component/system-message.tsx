import { useEffect, useRef } from 'react';

import { useMessageList } from '../../../hooks/queries/useMessageList';

import { SystemMessageItem } from './system-message-item';

export default function SystemMessage() {
    const { list, isLoading, isFetchingNextPage, hasMore, fetchNextPage } = useMessageList(1);

    const observerTarget = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return <div className="p-4 text-center text-[#9499a0]">加载中...</div>;
    }

    return (
        <div className="flex h-full flex-col overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="mb-6 text-lg font-bold text-[#5a3040] shrink-0">系统通知</h2>

            {list.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-[#9499a0]">
                    暂无系统通知
                </div>
            ) : (
                <div className="flex flex-col gap-4 pb-4">
                    {list.map((item) => (
                        <SystemMessageItem key={item.messageId} item={item} />
                    ))}

                    <div ref={observerTarget} className="h-4 w-full" />

                    {isFetchingNextPage && (
                        <div className="text-center text-sm text-[#9499a0]">加载更多中...</div>
                    )}
                    {!hasMore && list.length > 0 && (
                        <div className="text-center text-sm text-[#9499a0]">没有更多了</div>
                    )}
                </div>
            )}
        </div>
    );
}
