import { cn } from '../../../utils';

export type UserMainTabKey = 'home' | 'contribute' | 'videos' | 'collect';

export interface UserTabBarProps {
    activeTab: UserMainTabKey;
    onChangeTab: (tab: UserMainTabKey) => void;
    searchValue: string;
    onChangeSearchValue: (value: string) => void;
    onSearch?: (value: string) => void;
}

const TABS: { key: UserMainTabKey; label: string }[] = [
    { key: 'home', label: '主页' },
    { key: 'contribute', label: '投稿' },
    { key: 'videos', label: '视频列表' },
    { key: 'collect', label: '收藏' },
];

export default function UserTabBar({
    activeTab,
    onChangeTab,
    searchValue,
    onChangeSearchValue,
    onSearch,
}: UserTabBarProps) {
    return (
        <div className="rounded-[26px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_rgba(251,114,153,0.14)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => onChangeTab(t.key)}
                            className={cn(
                                'rounded-2xl px-4 py-2 text-[13px] font-semibold transition-all',
                                activeTab === t.key
                                    ? 'bg-[linear-gradient(135deg,#ffe1ec_0%,#fff_100%)] text-[var(--bili-pink-strong)] shadow-[0_12px_24px_rgba(251,114,153,0.18)]'
                                    : 'text-[#6d3b4d] hover:bg-[#fff1f6]',
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <SearchBox value={searchValue} onChange={onChangeSearchValue} onSearch={onSearch} />
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
        <div className="relative w-full md:w-[min(420px,44vw)]">
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    onSearch?.(value);
                }}
                placeholder="搜索我的视频"
                className="h-10 w-full rounded-xl border border-white/70 bg-[#fff7fa]/80 px-4 pr-11 text-[13px] font-medium text-[#5a3040] shadow-[0_12px_24px_rgba(251,114,153,0.10)] outline-none transition-all placeholder:text-slate-400 hover:border-[#ffd6e3] hover:bg-white/90 focus:border-[#fb7299] focus:bg-white focus:ring-4 focus:ring-[#fb7299]/10"
            />
            <button
                type="button"
                onClick={() => onSearch?.(value)}
                className="absolute right-1 top-1 flex h-8 w-9 items-center justify-center rounded-xl text-[#9f4b67] transition-colors hover:bg-white/70 hover:text-[var(--bili-pink-strong)]"
                aria-label="search"
            >
                <SearchIcon className="h-4.5 w-4.5" />
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
