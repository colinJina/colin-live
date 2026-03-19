import { useNavigate } from 'react-router-dom';
import { UserOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { cn, getAvatarSrc } from '../../../../utils';

export interface HistoryVideoInfo {
    videoId: string;
    videoName?: string;
    videoCover?: string;
    lastUpdateTime: string;
    nickName?: string;
}

interface HistoryVideoCardProps {
    video: HistoryVideoInfo;
    className?: string;
}

export function HistoryVideoCard({ video, className }: HistoryVideoCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className={cn(
                'group relative flex cursor-pointer gap-4 rounded-[20px] border border-transparent bg-white/40 p-3.5 transition-all duration-400 ease-out hover:border-white/80 hover:bg-white/90 hover:shadow-[0_8px_32px_rgba(251,114,153,0.12)]',
                className,
            )}
            onClick={() => {
                navigate(`/video/${video.videoId}`);
            }}
        >
            {/* 封面图区域 */}
            <div className="relative aspect-video w-[160px] flex-shrink-0 overflow-hidden rounded-xl shadow-sm md:w-[180px]">
                <img
                    src={getAvatarSrc(video.videoCover)}
                    alt={video.videoName}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* 信息区域 */}
            <div className="flex flex-1 flex-col justify-between py-1 pr-1">
                {/* 标题 */}
                <div className="line-clamp-2 text-[15px] font-bold leading-snug text-[#5a3040] transition-colors duration-300 group-hover:text-[#fb7299]">
                    {video.videoName}
                </div>

                <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center">
                    {video.nickName && (
                        <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#fff0f4] px-2 py-1 transition-colors group-hover:bg-[#ffe3ec]">
                            <UserOutlined className="text-[12px] text-[#fb7299]" />
                            <span className="text-[12px] font-medium text-[#fb7299]">
                                {video.nickName}
                            </span>
                        </div>
                    )}
                    <div className="inline-flex w-fit items-center gap-1.5 text-[12px] text-[#9f4b67] opacity-80 transition-opacity group-hover:opacity-100">
                        <FieldTimeOutlined className="text-[14px]" />
                        <span>{video.lastUpdateTime} 观看</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
