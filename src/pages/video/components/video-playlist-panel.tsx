import { Switch } from 'antd';

import type { VideoInfoFile } from '../../../api/video';
import { cn, formatDuration } from '../../../utils';

type VideoPlaylistPanelProps = {
    autoPlayNext: boolean;
    currentP: number;
    isLoading: boolean;
    videoList: VideoInfoFile[];
    onSelectVideo: (index: number) => void;
    onToggleAutoPlayNext: (checked: boolean) => void;
};

export function VideoPlaylistPanel({
    autoPlayNext,
    currentP,
    isLoading,
    videoList,
    onSelectVideo,
    onToggleAutoPlayNext,
}: VideoPlaylistPanelProps) {
    return (
        <section className="flex flex-col overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,239,246,0.98)_100%)] shadow-[0_18px_40px_rgba(251,114,153,0.12)] ring-1 ring-[#ffd8e4]/70">
            <div className="flex items-center justify-between border-b border-white/70 bg-white/56 px-4 py-3 backdrop-blur-md">
                <div className="text-[15px] font-semibold text-[#6f3f55]">
                    {'\u89c6\u9891\u9009\u96c6'}
                    <span className="ml-2 text-xs font-normal text-[#b07b90]">
                        ({videoList.length ? `${currentP}/${videoList.length}` : '0/0'})
                    </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#ffe1ea] bg-white/72 px-3 py-1.5 text-xs text-[#b07b90]">
                    <span>{'\u81ea\u52a8\u8fde\u64ad'}</span>
                    <Switch checked={autoPlayNext} onChange={onToggleAutoPlayNext} size="small" />
                </div>
            </div>

            <div className="max-h-[300px] space-y-2 overflow-y-auto bg-white/46 px-3 py-3">
                {isLoading ? (
                    <div className="py-8 text-center text-sm text-[#b07b90]">
                        {'\u52a0\u8f7d\u4e2d...'}
                    </div>
                ) : videoList.length > 0 ? (
                    videoList.map((item, index) => {
                        const active = index === currentP - 1;
                        return (
                            <button
                                key={item.fileId}
                                type="button"
                                onClick={() => onSelectVideo(index + 1)}
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 text-left text-sm shadow-[0_8px_18px_rgba(251,114,153,0.05)] transition',
                                    active
                                        ? 'border-[#ffbfd3] bg-[linear-gradient(180deg,#fff8fb_0%,#ffe8f1_100%)] text-[#e05d8d]'
                                        : 'border-[#ffe1ea] bg-white/78 text-[#6f3f55] hover:-translate-y-0.5 hover:border-[#ffc1d4] hover:bg-white',
                                )}
                            >
                                <span className="w-6 shrink-0 text-center text-[#c07a95]">
                                    {active ? <span>{'\u25b6'}</span> : index + 1}
                                </span>
                                <div
                                    className="min-w-0 flex-1 truncate"
                                    title={item.title || item.fileName}
                                >
                                    {item.fileName || item.title || `P${index + 1}`}
                                </div>
                                <div className="shrink-0 text-xs text-[#c3a0af]">
                                    {formatDuration(item.duration)}
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="py-8 text-center text-sm text-[#b07b90]">
                        {'\u6682\u65e0\u5206\u96c6'}
                    </div>
                )}
            </div>
        </section>
    );
}
