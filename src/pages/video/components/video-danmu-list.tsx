import { useState } from 'react';

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
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <section
            className={`flex flex-col overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,239,246,0.98)_100%)] shadow-[0_18px_40px_rgba(251,114,153,0.12)] ring-1 ring-[#ffd8e4]/70 ${
                isExpanded ? 'min-h-0 flex-1' : 'flex-none'
            }`}
        >
            <div className="flex items-center justify-between border-b border-white/70 bg-white/56 px-4 py-3 backdrop-blur-md">
                <div>
                    <div className="text-[15px] font-semibold text-[#6f3f55]">
                        {'\u5f39\u5e55\u5217\u8868'}
                    </div>
                    <div className="mt-1 text-[11px] tracking-[0.14em] text-[#c07a95]">
                        DANMU FEED
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsExpanded((value) => !value)}
                    aria-expanded={isExpanded}
                    className="rounded-full border border-[#ffe1ea] bg-white/70 cursor-pointer px-3 py-1 text-xs text-[#b07b90] transition hover:border-[#ffc9d8] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#fb7299]/20"
                >
                    {isExpanded ? '\u6536\u8d77' : '\u5c55\u5f00'}
                </button>
            </div>

            {isExpanded && (
                <div className="min-h-0 flex-1 overflow-y-auto bg-white/46 px-2 py-2 text-sm">
                    {isLoading ? (
                        <div className="py-10 text-center text-[#b07b90]">
                            {'\u52a0\u8f7d\u4e2d...'}
                        </div>
                    ) : danmuList.length > 0 ? (
                        danmuList.map((item) => {
                            const text = normalizeDanmuText(item);
                            return (
                                <div
                                    key={String(item.danmuId)}
                                    className="group flex items-center justify-between gap-3 rounded-[18px] border border-transparent px-3 py-2 transition hover:border-[#ffe0ea] hover:bg-white/72"
                                >
                                    <span className="w-12 shrink-0 text-xs font-medium text-[#c07a95]">
                                        {formatDanmuTime(getDanmuTime(item))}
                                    </span>
                                    <p
                                        className="min-w-0 flex-1 truncate text-[#6f3f55]"
                                        title={text}
                                    >
                                        {text || '---'}
                                    </p>
                                    <span className="shrink-0 text-xs text-[#c3a0af] opacity-0 transition group-hover:opacity-100">
                                        {item.createTime
                                            ? new Date(item.createTime).toLocaleDateString()
                                            : ''}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-10 text-center text-[#b07b90]">
                            {'\u6682\u65e0\u5f39\u5e55'}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
