import type { VideoDanmu } from '../../../api/video';

type VideoDanmuListProps = {
    danmuList: VideoDanmu[];
    isLoading: boolean;
    formatDanmuTime: (value: number) => string;
    getDanmuTime: (item: VideoDanmu) => number;
    normalizeDanmuText: (item: VideoDanmu) => string;
};

export function VideoDanmuList({
    danmuList,
    isLoading,
    formatDanmuTime,
    getDanmuTime,
    normalizeDanmuText,
}: VideoDanmuListProps) {
    return (
        <section className="flex flex-1 flex-col overflow-hidden rounded-[16px] border border-[#e8edf5] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#edf1f6] bg-[#fbfbfb] px-4 py-3">
                <div className="text-[15px] font-medium text-[#18191c]">弹幕列表</div>
                <span className="text-xs text-[#9499a0]">展开</span>
            </div>

            <div className="max-h-[300px] flex-1 overflow-y-auto bg-[#fcfcfc] px-2 py-2 text-sm">
                {isLoading ? (
                    <div className="py-10 text-center text-[#9499a0]">加载中...</div>
                ) : danmuList.length > 0 ? (
                    danmuList.map((item) => {
                        const text = normalizeDanmuText(item);
                        return (
                            <div
                                key={String(item.danmuId)}
                                className="group flex items-center justify-between gap-3 rounded-md px-3 py-1.5 transition hover:bg-[#f4f5f7]"
                            >
                                <span className="w-12 shrink-0 text-xs text-[#9499a0]">
                                    {formatDanmuTime(getDanmuTime(item))}
                                </span>
                                <p className="min-w-0 flex-1 truncate text-[#18191c]" title={text}>
                                    {text || '---'}
                                </p>
                                <span className="shrink-0 text-xs text-[#9499a0] opacity-0 transition group-hover:opacity-100">
                                    {item.createTime
                                        ? new Date(item.createTime).toLocaleDateString()
                                        : ''}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-10 text-center text-[#9499a0]">暂无弹幕</div>
                )}
            </div>
        </section>
    );
}
