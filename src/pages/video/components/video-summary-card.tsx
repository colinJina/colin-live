import type { VideoInfo, VideoInfoFile } from '../../../api/video';
import DanmuIcon from '../../../assets/icon/danmu-icon.svg?react';
import PlayerIcon from '../../../assets/icon/player-icon.svg?react';
import { formatVideoTime } from '../../../utils';

type VideoSummaryCardProps = {
    videoInfo: VideoInfo | undefined;
    currentP: number;
    currentVideo: VideoInfoFile | null;
    videoId?: string;
};

export function VideoSummaryCard({
    videoInfo,
    currentP,
    currentVideo,
    videoId,
}: VideoSummaryCardProps) {
    return (
        <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,239,246,0.98)_100%)] p-5 shadow-[0_18px_40px_rgba(251,114,153,0.12)] ring-1 ring-[#ffd8e4]/70">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-24px] top-[-26px] h-20 w-20 rounded-full bg-white/55 blur-2xl" />
                <div className="absolute right-[10%] bottom-[-18px] h-14 w-36 rounded-full bg-[#ffb3ca]/18 blur-2xl" />
            </div>

            <div className="relative">
                <div className="inline-flex rounded-full border border-[#ffd4e2] bg-white/72 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#dd6a90]">
                    VIDEO DETAIL
                </div>
                <h1 className="mt-3 text-[24px] font-semibold tracking-[0.02em] text-[#6f3f55]">
                    {currentVideo
                        ? `${currentP}. ${currentVideo.fileName || currentVideo.title || `P${currentP}`}`
                        : videoId
                          ? `\u89c6\u9891 ${videoId}`
                          : '\u89c6\u9891\u8be6\u60c5'}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-[#a46b82]">
                    <div className="flex items-center gap-2 rounded-full border border-[#ffe1ea] bg-white/72 px-3 py-1.5 shadow-[0_8px_18px_rgba(251,114,153,0.06)]">
                        <PlayerIcon />
                        <span>{videoInfo?.playCount}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[#ffe1ea] bg-white/72 px-3 py-1.5 shadow-[0_8px_18px_rgba(251,114,153,0.06)]">
                        <DanmuIcon />
                        <span>{videoInfo?.danmuCount}</span>
                    </div>
                    <span className="rounded-full border border-[#ffe1ea] bg-white/72 px-3 py-1.5 shadow-[0_8px_18px_rgba(251,114,153,0.06)]">
                        {formatVideoTime(videoInfo?.createTime ?? '')}
                    </span>
                </div>
            </div>
        </section>
    );
}
