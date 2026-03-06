import type { FC } from 'react';
import type { VideoInfo } from '../../../../api/video';

import { VideoCard } from '../video-card';
export type TopRecommendVideoCardProps = {
    videos: VideoInfo[];
    isLoading: boolean;
    isError: boolean;
};

const TopRecommendVideoCard: FC<TopRecommendVideoCardProps> = ({ videos, isLoading, isError }) => {
    if (isLoading || isError || videos.length === 0) {
        return <div>暂无数据</div>;
    }

    return (
        <div className="flex-1">
            <div className="grid grid-cols-4 gap-4">
                {videos.map((video) => (
                    <VideoCard key={video.videoId} className="h-[180px]" video={video}></VideoCard>
                ))}
            </div>
        </div>
    );
};

export default TopRecommendVideoCard;
