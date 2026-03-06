import type { VideoInfo } from '../../../api/video';
import { cn, getAvatarSrc } from '../../../utils';
interface VideoCardProps {
    video: VideoInfo;
    className?: string;
}
export function VideoCard({ video, className }: VideoCardProps) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(24,25,28,0.08)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5',
                className,
            )}
        >
            <img
                src={getAvatarSrc(video.videoCover)}
                alt=""
                className="aspect-video w-full bg-[#f7f8fa] object-cover"
                loading="lazy"
            />
            <div className="p-3">
                <div className="line-clamp-2 text-[13px] font-medium text-[#18191c]">
                    视频 ID：{video.videoId}
                </div>
                <div className="mt-1 text-[12px] text-[#9499a0]">暂无更多字段可展示</div>
            </div>
        </div>
    );
}
