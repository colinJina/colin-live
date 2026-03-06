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
        <div className={cn('mt-3 px-4 flex-1', className)}>
            <div className="mb-3 flex items-center justify-between text-xs text-[#9499a0]">
                <span>推荐视频</span>
                <Button
                    size="small"
                    onClick={() => refetch()}
                    loading={isFetching}
                    className="rounded-xl!"
                >
                    下拉刷新
                </Button>
            </div>

            {isError && (
                <div className="rounded-2xl bg-[#fff2f5] px-4 py-4 text-sm text-[#61666d]">
                    <div>视频加载失败，请稍后重试</div>
                </div>
            )}

            {!isError && isLoading && (
                <div className="flex items-center justify-center rounded-2xl bg-white/95 px-4 py-10 ring-1 ring-black/5">
                    <Spin />
                </div>
            )}

            {!isError && !isLoading && list.length === 0 && (
                <div className="rounded-2xl bg-[#f7f8fa] px-4 py-4 text-sm text-[#9499a0]">
                    暂无视频数据
                </div>
            )}

            {!isError && list.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {list.map((video, idx) => (
                        <VideoCard key={`${video.videoId}-${idx}`} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}
