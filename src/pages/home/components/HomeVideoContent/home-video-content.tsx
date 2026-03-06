import type { VideoInfo } from '../../../../api/video';
import { useLoadRecommendVideo } from '../../../../hooks/queries/useVideo';
import CarouselVideoCard from './carousel-video-card';
import HomeVideoCard from './home-video-card';
import TopRecommendVideoCard from './top-recommend-video-card';

export default function HomeVideoContent() {
    const { data = [], isLoading, isError, refetch } = useLoadRecommendVideo();

    const carouselVideos: VideoInfo[] = data.slice(0, 4);
    const topRecommendVideos: VideoInfo[] = data.slice(4);

    return (
        <>
            <div className="flex items-start gap-4">
                <div className="shrink-0">
                    <CarouselVideoCard
                        videos={carouselVideos}
                        isLoading={isLoading}
                        isError={isError}
                        onRetry={refetch}
                    />
                </div>
                <TopRecommendVideoCard
                    videos={topRecommendVideos}
                    isLoading={isLoading}
                    isError={isError}
                />
            </div>
            <HomeVideoCard></HomeVideoCard>
        </>
    );
}
