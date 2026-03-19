import { cn } from '../../../utils';

import type { VideoSortKey } from './user-video-section';

export type UserMainTabKey = 'home' | 'contribute' | 'videos' | 'collect';

export interface UserTabBarProps {
    activeTab: UserMainTabKey;
    onChangeTab: (tab: UserMainTabKey) => void;
    searchValue: string;
    onChangeSearchValue: (value: string) => void;
    onSearch?: (value: string) => void;
    sortKey: VideoSortKey;
    onChangeSort: (key: VideoSortKey) => void;
}

const TABS: { key: UserMainTabKey; label: string }[] = [
    { key: 'contribute', label: '投稿' },
    { key: 'videos', label: '视频列表' },
    { key: 'collect', label: '收藏' },
];

const SORTS: { key: VideoSortKey; label: string }[] = [
    { key: 'latest', label: '最新发布' },
    { key: 'most_played', label: '最多播放' },
    { key: 'most_collected', label: '最多收藏' },
];

export default function UserTabBar({
    activeTab,
    onChangeTab,
    searchValue,
    onChangeSearchValue,
    onSearch,
    sortKey,
    onChangeSort,
}: UserTabBarProps) {
    return (
        <div className="rounded-[26px] border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_40px_rgba(251,114,153,0.14)] md:px-5 md:py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1.5">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => onChangeTab(t.key)}
                            className={cn(
                                'rounded-2xl px-4 py-2 text-[13px] font-semibold transition-all',
                                activeTab === t.key
                                    ? 'bg-[linear-gradient(135deg,#fb7299_0%,#ff9fbe_100%)] text-white shadow-[0_12px_24px_rgba(251,114,153,0.22)]'
                                    : 'text-[#6d3b4d] hover:bg-[#fff1f6]',
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {activeTab === 'contribute' && (
                        <div className="flex items-center gap-1 rounded-xl bg-[#fff4f8] p-1">
                            {SORTS.map((s) => (
                                <button
                                    key={s.key}
                                    type="button"
                                    onClick={() => onChangeSort(s.key)}
                                    className={cn(
                                        'rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all',
                                        sortKey === s.key
                                            ? 'bg-white text-[#fb7299] shadow-[0_4px_12px_rgba(251,114,153,0.15)]'
                                            : 'text-[#8a5065]/70 hover:text-[#6d3b4d]',
                                    )}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="hidden h-6 w-[1px] bg-[#ffd6e3]/60 lg:block" />

                    {activeTab !== 'collect' && (
                        <SearchBox
                            value={searchValue}
                            onChange={onChangeSearchValue}
                            onSearch={onSearch}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function SearchBox({
    value,
    onChange,
    onSearch,
}: {
    value: string;
    onChange: (val: string) => void;
    onSearch?: (val: string) => void;
}) {
    return (
        <div className="relative w-full md:w-[min(320px,40vw)]">
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    onSearch?.(value);
                }}
                placeholder="搜索视频"
                className="h-9 w-full rounded-xl border border-white/70 bg-[#fff7fa]/80 px-4 pr-10 text-[13px] font-medium text-[#5a3040] shadow-[0_8px_16px_rgba(251,114,153,0.08)] outline-none transition-all placeholder:text-slate-400 hover:border-[#ffd6e3] hover:bg-white/90 focus:border-[#fb7299] focus:bg-white focus:ring-4 focus:ring-[#fb7299]/10"
            />
            <button
                type="button"
                onClick={() => onSearch?.(value)}
                className="absolute right-1 top-0.5 flex h-8 w-8 items-center justify-center rounded-lg text-[#9f4b67] transition-colors hover:bg-white/70 hover:text-[var(--bili-pink-strong)]"
                aria-label="search"
            >
                <SearchIcon className="h-4 w-4" />
            </button>
        </div>
    );
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}
