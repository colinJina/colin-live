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
        <section className="flex flex-col overflow-hidden rounded-[16px] border border-[#e8edf5] bg-[#f6f7f9] shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3">
                <div className="text-[15px] font-medium text-[#18191c]">
                    视频选集
                    <span className="ml-2 text-xs font-normal text-[#9499a0]">
                        ({videoList.length ? `${currentP}/${videoList.length}` : '0/0'})
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9499a0]">自动连播</span>
                    <Switch checked={autoPlayNext} onChange={onToggleAutoPlayNext} size="small" />
                </div>
            </div>

            <div className="max-h-[300px] space-y-1.5 overflow-y-auto bg-white px-3 py-3">
                {isLoading ? (
                    <div className="py-8 text-center text-sm text-[#9499a0]">加载中...</div>
                ) : videoList.length > 0 ? (
                    videoList.map((item, index) => {
                        const active = index === currentP - 1;
                        return (
                            <button
                                key={item.fileId}
                                type="button"
                                onClick={() => onSelectVideo(index + 1)}
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition',
                                    active
                                        ? 'bg-[#f4f5f7] text-[#fb7299]'
                                        : 'bg-white text-[#18191c] hover:bg-[#f4f5f7]',
                                )}
                            >
                                <span className="w-5 shrink-0 text-center text-[#9499a0]">
                                    {active ? <span className="text-[#fb7299]">▶</span> : index + 1}
                                </span>
                                <div
                                    className="min-w-0 flex-1 truncate"
                                    title={item.title || item.fileName}
                                >
                                    {item.fileName || item.title || `P${index + 1}`}
                                </div>
                                <div className="shrink-0 text-xs text-[#9499a0]">
                                    {formatDuration(item.duration)}
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="py-8 text-center text-sm text-[#9499a0]">暂无分集</div>
                )}
            </div>
        </section>
    );
}
