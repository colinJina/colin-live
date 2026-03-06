import type { VideoInfo } from '../../../api/video';
import { cn, formatDuration, formatVideoTime, getAvatarSrc } from '../../../utils';
import UpIcon from '../../../assets/icon/up-icon.svg?react';
import PlayerIcon from '../../../assets/icon/player-icon.svg?react';
import DanmuIcon from '../../../assets/icon/danmu-icon.svg?react';
import { useNavigate } from 'react-router-dom';
interface VideoCardProps {
    video: VideoInfo;
    className?: string;
}
export function VideoCard({ video, className }: VideoCardProps) {
    const navigate = useNavigate();
    return (
        <div
            className={cn(
                'group  cursor-pointer relative rounded-2xl bg-white shadow-[0_10px_30px_rgba(24,25,28,0.08)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5',
                className,
            )}
            onClick={() => {
                navigate(`/video/${video.videoId}`);
            }}
        >
            <div className="relative aspect-video w-full  overflow-hidden ">
                <img
                    src={getAvatarSrc(video.videoCover)}
                    alt=""
                    className="aspect-video h-full w-full bg-[#f7f8fa] rounded-2xl object-cover"
                    loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-2 pt-8 text-white text-[12px] bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                            <PlayerIcon className="size-4 fill-current" />
                            <span>{video.playCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <DanmuIcon className="size-4 fill-current" />
                            <span>{video.danmuCount}</span>
                        </div>
                    </div>

                    <div className="font-medium">{formatDuration(video.duration)}</div>
                </div>
            </div>
            <div className="p-3">
                <div className="line-clamp-2 text-[13px] font-medium text-[#18191c] truncate">
                    {video.videoName}
                </div>
                <div className="flex mt-1 gap-1 text-[12px] text-[#9499a0]">
                    <UpIcon className="size-5"></UpIcon>
                    <span>{video.nickName ?? '神秘up主~'}</span>
                    <span>{'·'}</span>
                    <span>{formatVideoTime(video.createTime as string)}</span>
                </div>
            </div>
        </div>
    );
}
