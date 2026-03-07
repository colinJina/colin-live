import type { VideoInfoFile } from '../../../api/video';

type VideoSummaryCardProps = {
    currentP: number;
    currentVideo: VideoInfoFile | null;
    videoId?: string;
    videoListLength: number;
};

export function VideoSummaryCard({
    currentP,
    currentVideo,
    videoId,
    videoListLength,
}: VideoSummaryCardProps) {
    return (
        <div className="rounded-[16px] border border-[#e9edf5] bg-white p-5 shadow-sm">
            <h1 className="mb-3 text-xl font-medium text-[#18191c]">
                {currentVideo
                    ? `${currentP}. ${currentVideo.fileName || currentVideo.title || `P${currentP}`}`
                    : videoId
                      ? `视频 ${videoId}`
                      : '视频详情'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9499a0]">
                <span>视频 ID: {videoId ?? '--'}</span>
                <span>文件 ID: {currentVideo?.fileId ?? '--'}</span>
                <span>分 P: {videoListLength ? `${currentP}/${videoListLength}` : '--'}</span>
            </div>
        </div>
    );
}
