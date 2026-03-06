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
        <section className="w-[600px] rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(24,25,28,0.08)] ring-1 ring-black/5">
            {isLoading && (
                <div className="flex h-[320px] items-center justify-center rounded-2xl bg-[#f7f8fa]">
                    <Spin />
                </div>
            )}

            {!isLoading && isError && (
                <div className="flex h-[320px] flex-col items-center justify-center rounded-2xl bg-[#fff2f5] px-4">
                    <p className="text-sm text-[#61666d]">推荐视频加载失败，请稍后重试</p>
                    <Button className="mt-3 rounded-xl!" onClick={onRetry}>
                        重试
                    </Button>
                </div>
            )}

            {!isLoading && !isError && renderData.length === 0 && (
                <div className="flex h-[320px] items-center justify-center rounded-2xl bg-[#f7f8fa]">
                    <Empty description="暂无推荐视频" />
                </div>
            )}

            {!isLoading && !isError && renderData.length > 0 && (
                <div className="relative">
                    <button
                        type="button"
                        aria-label="上一张"
                        className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65"
                        onClick={() => carouselRef.current?.prev()}
                    >
                        <LeftOutlined />
                    </button>
                    <button
                        type="button"
                        aria-label="下一张"
                        className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65"
                        onClick={() => carouselRef.current?.next()}
                    >
                        <RightOutlined />
                    </button>

                    <Carousel ref={carouselRef} autoplay dots draggable>
                        {renderData.map((video) => (
                            <div key={video.videoId}>
                                <button
                                    type="button"
                                    className="group relative block h-[320px] w-full overflow-hidden rounded-2xl text-left"
                                    onClick={() => onOpenVideo(video.videoId)}
                                >
                                    <img
                                        src={getAvatarSrc(video.videoCover)}
                                        alt={video.videoName || video.videoId}
                                        className="h-full w-full bg-[#f1f2f3] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />

                                    <div className="absolute right-0 bottom-0 left-0 p-5">
                                        <div className="text-base font-semibold text-white">
                                            {video.videoName || `视频 ${video.videoId}`}
                                        </div>
                                        <div className="mt-1 text-xs text-white/85">
                                            视频ID：{video.videoId}
                                        </div>
                                        {video.introduction && (
                                            <div className="mt-2 line-clamp-2 text-sm text-white/90">
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
