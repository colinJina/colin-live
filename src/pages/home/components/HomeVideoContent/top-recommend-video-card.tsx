import { Spin } from 'antd';
import type { FC } from 'react';

import type { VideoInfo } from '../../../../api/video';
import { VideoCard } from '../video-card';

export type TopRecommendVideoCardProps = {
    videos: VideoInfo[];
    isLoading: boolean;
    isError: boolean;
};

const TopRecommendVideoCard: FC<TopRecommendVideoCardProps> = ({ videos, isLoading, isError }) => {
    if (isLoading) {
        return (
            <section className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,239,246,0.98)_100%)] p-5 shadow-[0_18px_40px_rgba(251,114,153,0.12)] ring-1 ring-[#ffd8e4]/70">
                <div className="flex min-h-[352px] w-full items-center justify-center rounded-[24px] border border-[#ffe2eb] bg-white/75">
                    <Spin />
                </div>
            </section>
        );
    }

    if (isError || videos.length === 0) {
        return (
            <section className="relative flex flex-1 items-center overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,239,246,0.98)_100%)] p-5 shadow-[0_18px_40px_rgba(251,114,153,0.12)] ring-1 ring-[#ffd8e4]/70">
                <div className="flex min-h-[352px] w-full items-center justify-center rounded-[24px] border border-[#ffd7e3] bg-[#fff4f8] px-5 text-sm text-[#a26d82]">
                    {isError
                        ? '\u63a8\u8350\u5185\u5bb9\u52a0\u8f7d\u5931\u8d25'
                        : '\u6682\u65e0\u6570\u636e'}
                </div>
            </section>
        );
    }

    return (
        <section className="relative flex-1 overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,239,246,0.98)_100%)] p-5 shadow-[0_18px_40px_rgba(251,114,153,0.12)] ring-1 ring-[#ffd8e4]/70">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-[8%] top-5 h-16 w-16 rounded-full bg-[#ffb3ca]/20 blur-2xl" />
                <div className="absolute bottom-[-18px] left-[18%] h-12 w-32 rounded-full bg-white/45 blur-2xl" />
            </div>

            <div className="relative mb-4 flex items-center justify-between">
                <div className="inline-flex rounded-full border border-[#ffd4e2] bg-white/72 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#dd6a90]">
                    FOR YOU
                </div>
                <div className="text-sm font-semibold text-[#a2647d]">
                    {'\u7cbe\u9009\u63a8\u8350'}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {videos.map((video) => (
                    <VideoCard key={video.videoId} video={video}></VideoCard>
                ))}
            </div>
        </section>
    );
};

export default TopRecommendVideoCard;
