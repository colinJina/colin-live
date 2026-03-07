import type { VideoInfo, VideoInfoFile } from '../../../api/video';

type VideoSummaryCardProps = {
    videoInfo: VideoInfo | undefined;
    currentP: number;
    currentVideo: VideoInfoFile | null;
    videoId?: string;
};
import PlayerIcon from '../../../assets/icon/player-icon.svg?react';
import DanmuIcon from '../../../assets/icon/danmu-icon.svg?react';
import { formatVideoTime } from '../../../utils';
export function VideoSummaryCard({
    videoInfo,
    currentP,
    currentVideo,
    videoId,
}: VideoSummaryCardProps) {
    return (
        <div className="">
            <h1 className="mb-3 text-xl font-medium text-[#18191c]">
                {currentVideo
                    ? `${currentP}. ${currentVideo.fileName || currentVideo.title || `P${currentP}`}`
                    : videoId
                      ? `视频 ${videoId}`
                      : '视频详情'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#9499a0]">
                <div className="flex justify-center items-center gap-1">
                    <PlayerIcon />
                    <span>{videoInfo?.playCount}</span>
                </div>
                <div className="flex justify-center items-center gap-1">
                    <DanmuIcon />
                    <span>{videoInfo?.danmuCount}</span>
                </div>
                <span>{formatVideoTime(videoInfo?.createTime ?? '')}</span>
            </div>
        </div>
    );
}
