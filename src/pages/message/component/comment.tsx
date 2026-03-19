import { Spin } from 'antd';
import { useEffect, useRef } from 'react';

import { useMessageList } from '../../../hooks/queries/useMessageList';
import { getAvatarSrc } from '../../../utils';

export default function CommentMessage() {
    const { list, isLoading, isFetchingNextPage, hasMore, fetchNextPage } = useMessageList(4);
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

    return (
        <div className="flex h-full flex-col">
            <h2 className="mb-6 text-lg font-bold text-[#5a3040]">评论和@</h2>

            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {list.length > 0
                    ? list.map((msg) => (
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
                              <div className="ml-auto w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/50 bg-[#f7f8fa]">
                                  <div className="line-clamp-2 px-2 py-3 text-[12px] font-medium text-[#5a3040]">
                                      {msg.videoName}
                                  </div>
                              </div>
                          </div>
                      ))
                    : !isLoading && (
                          <div className="flex h-64 items-center justify-center text-[14px] text-[#9499a0]">
                              暂无新评论
                          </div>
                      )}

                <div ref={loadMoreRef} className="text-center py-6 h-10">
                    {(isLoading || isFetchingNextPage) && <Spin />}
                    {!hasMore && list.length > 0 && (
                        <span className="text-xs text-[#c290a5] mt-2 inline-block">
                            没有更多数据啦~
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
