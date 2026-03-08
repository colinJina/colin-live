import { Button, Spin } from 'antd';

import type { VideoInfo } from '../../../../api/video';
import { useLoadRecommendVideo } from '../../../../hooks/queries/useVideo';
import { cn } from '../../../../utils';
import { VideoCard } from '../video-card';

type HomeVideoCardProps = {
    className?: string;
};

export default function HomeVideoCard({ className }: HomeVideoCardProps) {
    const { data = [], isLoading, isFetching, isError, refetch } = useLoadRecommendVideo();

    const list: VideoInfo[] = data ?? [];

    return (
        <div className={cn('mt-4 flex-1 px-1', className)}>
            <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,238,245,0.98)_52%,rgba(255,231,240,0.98)_100%)] p-4 shadow-[0_22px_52px_rgba(251,114,153,0.14)] ring-1 ring-[#ffdbe6]/70 md:p-5">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-28px] top-[-34px] h-24 w-24 rounded-full bg-white/60 blur-2xl" />
                    <div className="absolute right-[8%] top-4 h-20 w-20 rounded-full bg-[#ffb3ca]/25 blur-2xl" />
                    <div className="absolute bottom-[-20px] left-[22%] h-14 w-44 rounded-full bg-white/45 blur-2xl" />
                </div>

                <div className="relative mb-4 flex items-center justify-between">
                    <div>
                        <div className="inline-flex rounded-full border border-[#ffd3e1] bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#dd6a90]">
                            RECOMMEND
                        </div>
                        <div className="mt-2 text-[20px] font-bold tracking-[0.04em] text-[#6f3f55]">
                            {'\u63a8\u8350\u89c6\u9891'}
                        </div>
                    </div>

                    <Button
                        size="small"
                        onClick={() => refetch()}
                        loading={isFetching}
                        className="h-9! rounded-full! border-[#ffc7d8]! bg-[linear-gradient(180deg,#ffffff_0%,#fff2f7_100%)] px-4! font-medium! text-[#cb6285]! shadow-none! hover:border-[#ffb0c8]! hover:text-[#e05d8d]!"
                    >
                        {'\u4e0b\u62c9\u5237\u65b0'}
                    </Button>
                </div>

                {isError && (
                    <div className="relative rounded-[24px] border border-[#ffd4df] bg-[#fff4f8] px-5 py-5 text-sm text-[#9b6278] shadow-[0_12px_24px_rgba(251,114,153,0.08)]">
                        {'\u89c6\u9891\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5'}
                    </div>
                )}

                {!isError && isLoading && (
                    <div className="flex items-center justify-center rounded-[24px] border border-[#ffe1ea] bg-white/80 px-4 py-14 shadow-[0_12px_24px_rgba(251,114,153,0.08)]">
                        <Spin />
                    </div>
                )}

                {!isError && !isLoading && list.length === 0 && (
                    <div className="rounded-[24px] border border-[#ffe1ea] bg-white/80 px-5 py-5 text-sm text-[#b07b90] shadow-[0_12px_24px_rgba(251,114,153,0.08)]">
                        {'\u6682\u65e0\u89c6\u9891\u6570\u636e'}
                    </div>
                )}

                {!isError && list.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {list.map((video, idx) => (
                            <VideoCard key={`${video.videoId}-${idx}`} video={video} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
