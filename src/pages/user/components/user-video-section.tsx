import { cn } from '../../../utils';
import EmptyState from './empty-state';

export type VideoSortKey = 'latest' | 'most_played' | 'most_collected';

export interface UserVideoSectionProps {
    title?: string;
    sortKey: VideoSortKey;
    onChangeSort: (key: VideoSortKey) => void;
    videos?: unknown[];
}

const SORTS: { key: VideoSortKey; label: string }[] = [
    { key: 'latest', label: '最新发布' },
    { key: 'most_played', label: '最多播放' },
    { key: 'most_collected', label: '最多收藏' },
];

export default function UserVideoSection({
    title = '我的视频',
    sortKey,
    onChangeSort,
    videos,
}: UserVideoSectionProps) {
    const list = videos ?? [];
    const isEmpty = list.length === 0;

    return (
        <section className="rounded-[26px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_40px_rgba(251,114,153,0.14)] md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-[16px] font-extrabold tracking-[0.04em] text-[#4a2232]">
                    {title}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {SORTS.map((s) => (
                        <button
                            key={s.key}
                            type="button"
                            onClick={() => onChangeSort(s.key)}
                            className={cn(
                                'rounded-2xl px-4 py-2 text-[12px] font-semibold transition-all',
                                sortKey === s.key
                                    ? 'bg-[linear-gradient(135deg,#fb7299_0%,#ff9fbe_100%)] text-white shadow-[0_16px_28px_rgba(251,114,153,0.26)]'
                                    : 'border border-[#ffe0ea] bg-[#fff4f8] text-[#6d3b4d] hover:bg-white',
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                {isEmpty ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {list.map((_, idx) => (
                            <div
                                // eslint-disable-next-line react/no-array-index-key
                                key={idx}
                                className="rounded-[22px] border border-[#ffe0ea] bg-[#fff8fb] p-4 shadow-[0_16px_28px_rgba(251,114,153,0.10)]"
                            >
                                <div className="h-32 rounded-[18px] bg-[linear-gradient(135deg,#ffe1ec_0%,#fff_100%)]" />
                                <div className="mt-3 h-4 w-2/3 rounded-full bg-[#ffd6e3]/70" />
                                <div className="mt-2 h-3 w-1/2 rounded-full bg-[#ffd6e3]/55" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
