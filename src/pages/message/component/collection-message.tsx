import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMessageList } from '../../../hooks/queries/useMessageList';
import { getAvatarSrc } from '../../../utils';

export default function CollectionMessage() {
    const { list, isLoading, isFetchingNextPage, hasMore, fetchNextPage } = useMessageList(3);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
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

    if (isLoading) {
        return <div className="p-4 text-center text-[#9499a0]">加载中...</div>;
    }

    return (
        <div className="flex h-full flex-col">
            <h2 className="mb-6 text-lg font-bold text-[#5a3040] shrink-0">收到收藏</h2>

            {list.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-[#9499a0]">
                    暂无收到的收藏
                </div>
            ) : (
                <div className="flex flex-col gap-4 pb-4">
                    {list.map((msg) => (
                        <div
                            key={msg.messageId}
                            className="group flex items-center gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 transition-all duration-300 hover:bg-white/70 hover:shadow-[0_10px_30px_rgba(251,114,153,0.08)]"
                        >
                            <div className="relative">
                                <img
                                    src={getAvatarSrc(msg.sendUserAvatar)}
                                    className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                                    alt="avatar"
                                />
                                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffb11b] text-[10px] text-white shadow-sm">
                                    ★
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[14px] text-[#5a3040]">
                                    <span className="font-bold hover:text-[#fb7299] cursor-pointer transition-colors">
                                        {msg.sendUserName}
                                    </span>
                                    <span className="mx-2 text-[#9f4b67]">收藏了你的视频</span>
                                </div>
                                <div className="mt-1 text-[12px] text-[#9499a0]">
                                    {msg.createTime}
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    navigate(`/video/${msg.videoId}`);
                                }}
                                className="w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/50 bg-[#f7f8fa]"
                            >
                                {msg.videoCover ? (
                                    <img
                                        src={getAvatarSrc(msg.videoCover)}
                                        alt={msg.videoName}
                                        className="h-16 w-full object-cover"
                                    />
                                ) : (
                                    <div className="line-clamp-2 px-2 py-3 text-[12px] font-medium text-[#5a3040]">
                                        {msg.videoName}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div ref={loadMoreRef} className="h-4 w-full" />

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
