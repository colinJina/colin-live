import type { ComponentType, KeyboardEvent, SVGProps } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getNoReadCount } from '../../api/message';
import Zhuzhan from '../../assets/icon/colinLive.svg?react';
import HeaderUploadButton from '../../component/headerUploadButton';
import { useUserStore } from '../../stores/useUserStore';
import UserHoverCard from '../user/user-hover-card';

import Collect from '@/assets/icon/collect.svg?react';
import CreateCenter from '@/assets/icon/create-center.svg?react';
import History from '@/assets/icon/history.svg?react';
import Message from '@/assets/icon/message.svg?react';
const SEARCH_PLACEHOLDER = '搜索视频、番剧或 UP 主';
const HEADER_LINKS = [
    { Icon: Message, label: '消息', path: '/message' },
    { Icon: Collect, label: '收藏', path: '/collect' },
    { Icon: History, label: '历史', path: '/history' },
    { Icon: CreateCenter, label: '创作中心', path: '/ucenter/home' },
] as const;
const SearchIcon = ({ className }: { className?: string }) => (
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

export default function LayoutHeader() {
    const navigate = useNavigate();

    const token = useUserStore((state) => state.userInfo?.token);
    const noReadCount = useUserStore((state) => state.noReadCount);
    const setNoReadCount = useUserStore((state) => state.setNoReadCount);

    useEffect(() => {
        if (!token) {
            setNoReadCount(0);
            return;
        }

        let cancelled = false;

        const run = async () => {
            try {
                const res = await getNoReadCount({ showError: false });
                const count = Number(res?.data ?? 0);
                if (!cancelled) {
                    setNoReadCount(Number.isFinite(count) ? count : 0);
                }
            } catch {
                if (!cancelled) setNoReadCount(0);
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [token, setNoReadCount]);

    const handleSearch = (value: string) => {
        const keyword = value.trim();
        if (!keyword) return;
        navigate(`/home?keyword=${encodeURIComponent(keyword)}`);
    };

    const handleSearchFromInput = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        handleSearch(event.currentTarget.value);
    };

    return (
        <>
            <div
                className="relative h-[188px] w-full"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(255,244,248,0.96) 0%, rgba(255,227,239,0.93) 34%, rgba(255,208,226,0.88) 68%, rgba(255,195,216,0.9) 100%)`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-40px] top-[-56px] h-40 w-40 rounded-full bg-white/45 blur-2xl" />
                    <div className="absolute right-[10%] top-6 h-28 w-28 rounded-full bg-[#ff8db2]/35 blur-2xl" />
                    <div className="absolute bottom-[-30px] left-[24%] h-24 w-72 rounded-full bg-white/35 blur-3xl" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/65 to-transparent" />
                </div>

                <div className="absolute left-0 right-0 top-0 z-40 flex h-[72px] items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center gap-3">
                        <div
                            className="group flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white/72 px-4 py-2 shadow-[0_14px_30px_rgba(251,114,153,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/88"
                            onClick={() => navigate('/home')}
                        >
                            <Zhuzhan className="h-5 w-5 text-[var(--bili-pink-strong)] transition-transform duration-300 group-hover:scale-110" />
                            <span className="text-[15px] font-semibold tracking-[0.08em] text-[var(--text)]">
                                首页
                            </span>
                        </div>

                        <div className="hidden rounded-full border border-[#f7bfd1] bg-[#fff7fa]/90 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-[var(--bili-pink-strong)] shadow-[0_10px_24px_rgba(251,114,153,0.12)] md:block">
                            PINK FLAT LIVE
                        </div>
                    </div>

                    <div className="absolute left-1/2 z-50 w-[min(46vw,520px)] -translate-x-1/2 max-md:hidden">
                        <div className="group relative flex items-center transition-all duration-300">
                            <input
                                type="text"
                                placeholder={SEARCH_PLACEHOLDER}
                                onKeyDown={handleSearchFromInput}
                                className="h-10 w-full rounded-xl border border-white/60 bg-white/60 px-4 pr-11 text-[13px] text-[#5a3040] backdrop-blur-md outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-[#ffd6e3] hover:bg-white/90 focus:border-[#fb7299] focus:bg-white focus:ring-4 focus:ring-[#fb7299]/10"
                            />
                            <div className="absolute right-0 flex h-10 w-11 cursor-pointer items-center justify-center rounded-r-xl text-[#9f4b67] transition-colors hover:text-[var(--bili-pink-strong)]">
                                <SearchIcon className="h-4.5 w-4.5 transition-transform duration-300 group-focus-within:scale-110" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative group/user py-2">
                            <UserHoverCard />
                        </div>

                        {HEADER_LINKS.map(({ Icon, label, path }) => (
                            <NavIcon
                                key={label}
                                Icon={Icon}
                                label={label}
                                path={path}
                                showBadge={label === '消息' && noReadCount > 0}
                            />
                        ))}

                        <div className="cursor-pointer transition-all hover:opacity-90 active:scale-95">
                            <HeaderUploadButton
                                onClick={() => {
                                    navigate('/ucenter/upload');
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-5 left-6 right-6 z-30 flex items-end justify-between lg:left-10 lg:right-10">
                    <div>
                        <div className="mb-2 inline-flex rounded-full border border-white/70 bg-white/66 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[var(--bili-pink-strong)] shadow-[0_12px_30px_rgba(251,114,153,0.14)] backdrop-blur-md">
                            COLIN LIVE
                        </div>
                    </div>

                    <div className="hidden gap-3 lg:flex">
                        <div className="rounded-[22px] border border-white/75 bg-white/70 px-4 py-3 text-right shadow-[0_18px_34px_rgba(251,114,153,0.14)] backdrop-blur-md">
                            <div className="text-[11px] font-semibold tracking-[0.18em] text-[#d4698b]">
                                THEME
                            </div>
                            <div className="mt-1 text-[15px] font-bold text-[#5a3040]">
                                Flat Pink Navigation
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function NavIcon({
    Icon,
    label,
    path,
    showBadge,
}: {
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    path: string;
    showBadge?: boolean;
}) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)}
            className="relative group/icon flex cursor-pointer flex-col items-center justify-center rounded-[20px] px-2.5 py-2 transition-all duration-300 hover:bg-white/50 hover:shadow-[0_10px_26px_rgba(251,114,153,0.12)]"
        >
            {showBadge && (
                <span className="pointer-events-none absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#fb7299] shadow-[0_0_10px_rgba(251,114,153,0.6)]" />
            )}
            <Icon className="h-5 w-5 text-[#9f4b67] transition-transform duration-300 group-hover/icon:-translate-y-0.5 group-hover/icon:text-[var(--bili-pink-strong)]" />
            <span className="mt-1 text-[11px] font-medium text-[#8a5065] transition-colors group-hover/icon:text-[var(--bili-pink-strong)]">
                {label}
            </span>
        </div>
    );
}
