import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Carousel, Empty, Spin } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import type { VideoInfo } from '../../../../api/video';
import { getAvatarSrc } from '../../../../utils';

type CarouselVideoCardProps = {
    videos: VideoInfo[];
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
};

export default function CarouselVideoCard({
    videos,
    isLoading,
    isError,
    onRetry,
}: CarouselVideoCardProps) {
    const navigate = useNavigate();
    const carouselRef = useRef<CarouselRef>(null);

    const renderData = videos.slice(0, 5);

    const onOpenVideo = (videoId: string) => {
        if (!videoId) return;
        navigate(`/video/${encodeURIComponent(videoId)}`);
    };

    return (
        <section className="relative w-[600px] overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,238,245,0.98)_52%,rgba(255,229,239,0.98)_100%)] p-4 shadow-[0_22px_52px_rgba(251,114,153,0.14)] ring-1 ring-[#ffdbe6]/70">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-26px] top-[-34px] h-24 w-24 rounded-full bg-white/60 blur-2xl" />
                <div className="absolute right-[10%] top-5 h-20 w-20 rounded-full bg-[#ffadc7]/25 blur-2xl" />
            </div>

            <div className="relative mb-4 flex items-center justify-between">
                <div>
                    <div className="inline-flex rounded-full border border-[#ffd4e2] bg-white/72 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#dd6a90]">
                        HERO PICKS
                    </div>
                    <div className="mt-2 text-[20px] font-bold tracking-[0.04em] text-[#6f3f55]">
                        {'\u8f6e\u64ad\u63a8\u8350'}
                    </div>
                </div>
                <div className="rounded-full border border-[#ffe0ea] bg-white/68 px-3 py-1 text-[11px] font-medium text-[#b17189]">
                    Flat Pink Feed
                </div>
            </div>

            {isLoading && (
                <div className="flex h-[320px] items-center justify-center rounded-[24px] border border-[#ffe1ea] bg-white/78 shadow-[0_12px_24px_rgba(251,114,153,0.08)]">
                    <Spin />
                </div>
            )}

            {!isLoading && isError && (
                <div className="flex h-[320px] flex-col items-center justify-center rounded-[24px] border border-[#ffd5e0] bg-[#fff4f8] px-4 shadow-[0_12px_24px_rgba(251,114,153,0.08)]">
                    <p className="text-sm text-[#9e6379]">
                        {
                            '\u63a8\u8350\u89c6\u9891\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5'
                        }
                    </p>
                    <Button
                        className="mt-3 h-9! rounded-full! border-[#ffc8d9]! bg-white! px-4! text-[#cf6688]! shadow-none! hover:border-[#ffb4cc]! hover:text-[#e05d8d]!"
                        onClick={onRetry}
                    >
                        {'\u91cd\u8bd5'}
                    </Button>
                </div>
            )}

            {!isLoading && !isError && renderData.length === 0 && (
                <div className="flex h-[320px] items-center justify-center rounded-[24px] border border-[#ffe1ea] bg-white/78 shadow-[0_12px_24px_rgba(251,114,153,0.08)]">
                    <Empty description={'\u6682\u65e0\u63a8\u8350\u89c6\u9891'} />
                </div>
            )}

            {!isLoading && !isError && renderData.length > 0 && (
                <div className="relative">
                    <button
                        type="button"
                        aria-label={'\u4e0a\u4e00\u5f20'}
                        className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/72 text-[#c85f84] shadow-[0_10px_24px_rgba(251,114,153,0.18)] backdrop-blur-md transition hover:-translate-y-1/2 hover:border-[#ffc1d4] hover:bg-white/90 hover:text-[#ea608f]"
                        onClick={() => carouselRef.current?.prev()}
                    >
                        <LeftOutlined />
                    </button>
                    <button
                        type="button"
                        aria-label={'\u4e0b\u4e00\u5f20'}
                        className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/72 text-[#c85f84] shadow-[0_10px_24px_rgba(251,114,153,0.18)] backdrop-blur-md transition hover:-translate-y-1/2 hover:border-[#ffc1d4] hover:bg-white/90 hover:text-[#ea608f]"
                        onClick={() => carouselRef.current?.next()}
                    >
                        <RightOutlined />
                    </button>

                    <Carousel ref={carouselRef} autoplay dots draggable>
                        {renderData.map((video) => (
                            <div key={video.videoId}>
                                <button
                                    type="button"
                                    className="group relative block h-[320px] w-full overflow-hidden rounded-[24px] text-left shadow-[0_16px_32px_rgba(251,114,153,0.12)]"
                                    onClick={() => onOpenVideo(video.videoId)}
                                >
                                    <img
                                        src={getAvatarSrc(video.videoCover)}
                                        alt={video.videoName || video.videoId}
                                        className="h-full w-full bg-[#f9e7ee] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />

                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,195,216,0.04)_0%,rgba(131,44,76,0.18)_36%,rgba(74,27,46,0.78)_100%)]" />
                                    <div className="absolute inset-x-5 top-5 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <div className="inline-flex rounded-full border border-white/20 bg-white/14 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/92 backdrop-blur-sm">
                                            FEATURED
                                        </div>
                                        <div className="mt-3 text-[18px] font-semibold text-white">
                                            {video.videoName || `\u89c6\u9891 ${video.videoId}`}
                                        </div>
                                        <div className="mt-1 text-xs text-white/80">
                                            {'\u89c6\u9891ID: '} {video.videoId}
                                        </div>
                                        {video.introduction && (
                                            <div className="mt-2 line-clamp-2 max-w-[88%] text-sm text-white/88">
                                                {video.introduction}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>
                        ))}
                    </Carousel>
                </div>
            )}
        </section>
    );
}
