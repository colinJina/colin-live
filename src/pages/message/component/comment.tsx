import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMessageList } from '../../../hooks/queries/useMessageList';
import { getAvatarSrc } from '../../../utils';

export default function CommentMessage() {
    const { list, isLoading, isFetchingNextPage, hasMore, fetchNextPage } = useMessageList(4);
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
            <h2 className="mb-6 text-lg font-bold text-[#5a3040] shrink-0">评论和@</h2>

            {list.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-[#9499a0]">
                    暂无新评论
                </div>
            ) : (
                <div className="flex flex-col gap-4 pb-4">
                    {list.map((msg) => (
                        <div
                            key={msg.messageId}
                            className="group flex gap-4 rounded-2xl border border-white/60 bg-white/40 p-5 transition-all duration-300 hover:bg-white/70 hover:shadow-[0_10px_30px_rgba(251,114,153,0.08)]"
                        >
                            <img
                                src={getAvatarSrc(msg.sendUserAvatar)}
                                alt="avatar"
                                className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                            />
                            <div className="flex flex-1 flex-col justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-bold text-[#5a3040] group-hover:text-[var(--bili-pink-strong)] cursor-pointer transition-colors">
                                        {msg.sendUserName}
                                    </span>
                                    <span className="text-[13px] text-[#9f4b67]">
                                        评论了你的视频
                                    </span>
                                </div>
                                <div className="mt-1.5 text-[14px] text-[#18191c]">
                                    {msg.extendDto?.messageContent}
                                </div>
                                <div className="mt-3 flex items-center gap-3 text-[12px] text-[#9499a0]">
                                    <span>{msg.createTime}</span>
                                    <div className="cursor-pointer rounded-lg bg-white/50 px-2 py-1 transition-colors hover:bg-white hover:text-[var(--bili-pink-strong)]">
                                        回复
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    navigate(`/video/${msg.videoId}`);
                                }}
                                className="ml-auto w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/50 bg-[#f7f8fa]"
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
