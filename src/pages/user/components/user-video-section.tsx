import EmptyState from './empty-state';

export type VideoSortKey = 'latest' | 'most_played' | 'most_collected';

export interface UserVideoSectionProps {
    videos?: unknown[];
}

/**
 * 纯内容展示区 —— 排序已移入 UserTabBar
 */
export default function UserVideoSection({ videos }: UserVideoSectionProps) {
    const list = videos ?? [];
    const isEmpty = list.length === 0;

    return (
        <section className="rounded-[26px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_40px_rgba(251,114,153,0.14)] md:p-6">
            {isEmpty ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {list.map((_, idx) => (
                        <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={idx}
                            className="group rounded-[22px] border border-[#ffe0ea] bg-[#fff8fb] p-3 shadow-[0_12px_24px_rgba(251,114,153,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(251,114,153,0.16)]"
                        >
                            <div className="h-36 rounded-[18px] bg-[linear-gradient(135deg,#ffe1ec_0%,#fff_100%)] transition-transform group-hover:scale-[1.01]" />
                            <div className="mt-3 h-4 w-3/4 rounded-full bg-[#ffd6e3]/70" />
                            <div className="mt-2 h-3 w-1/2 rounded-full bg-[#ffd6e3]/50" />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
