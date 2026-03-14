import { Input } from 'antd';
import type { ComponentType, SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';

import Zhuzhan from '../../../public/colinLive.svg?react';
import HeaderUploadButton from '../../component/headerUploadButton';
import { useUserCountInfo } from '../../hooks/queries/useAuth';
import { useLoginModal } from '../../provider/login-modal-provider';
import { useUserStore } from '../../stores/useUserStore';
import { cn, getAvatarSrc } from '../../utils';
import CategoryModule from '../home/components/category-module';

import Collect from '@/assets/icon/collect.svg?react';
import CreateCenter from '@/assets/icon/create-center.svg?react';
import History from '@/assets/icon/history.svg?react';
import Message from '@/assets/icon/message.svg?react';
import defaultAvatar from '@/assets/icon/user.svg';

const { Search } = Input;

const SEARCH_PLACEHOLDER = '搜索视频、番剧或 UP 主';
const USER_MENU_ITEMS = ['个人中心', '投稿管理', '退出登录'];
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
const renderCount = (value?: number) => (typeof value === 'number' ? value : '--');

export default function LayoutHeader() {
    const navigate = useNavigate();
    const { openLoginModal } = useLoginModal();
    const userInfo = useUserStore((state) => state.userInfo);
    const clearUserInfo = useUserStore((state) => state.clearUserInfo);
    const { data: userCountInfo } = useUserCountInfo(Boolean(userInfo));

    const handleMenuClick = (item: string) => {
        if (item === '退出登录') {
            clearUserInfo();
            navigate('/home');
            return;
        }

        if (item === '个人中心' && userInfo?.userId) {
            navigate(`/uhome/${encodeURIComponent(userInfo.userId)}`);
        }
    };

    const handleSearch = (value: string) => {
        const keyword = value.trim();
        if (!keyword) return;

        navigate(`/home?keyword=${encodeURIComponent(keyword)}`);
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
                                className="h-10 w-full rounded-xl border border-white/60 bg-white/60 px-4 pr-11 text-[13px] text-[#5a3040] backdrop-blur-md outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-[#ffd6e3] hover:bg-white/90 focus:border-[#fb7299] focus:bg-white focus:ring-4 focus:ring-[#fb7299]/10"
                            />
                            <div className="absolute right-0 flex h-10 w-11 cursor-pointer items-center justify-center rounded-r-xl text-[#9f4b67] transition-colors hover:text-[var(--bili-pink-strong)]">
                                <SearchIcon className="h-4.5 w-4.5 transition-transform duration-300 group-focus-within:scale-110" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative group/user py-2">
                            <div
                                className={cn(
                                    'relative z-50 cursor-pointer rounded-full border border-white/75 bg-white/85 p-1 shadow-[0_10px_24px_rgba(251,114,153,0.16)] transition-all duration-500 ease-out',
                                    userInfo &&
                                        'group-hover/user:translate-y-6 group-hover/user:scale-[1.55]',
                                )}
                                onClick={() => !userInfo && openLoginModal()}
                            >
                                <img
                                    src={userInfo ? getAvatarSrc(userInfo.avatar) : defaultAvatar}
                                    className="h-9 w-9 rounded-full border border-[#ffd6e3] bg-white object-cover"
                                    alt="avatar"
                                />
                            </div>

                            {userInfo && (
                                <div className="invisible  absolute left-1/2 top-14 w-72 -translate-x-1/2 translate-y-4 rounded-[24px] border border-white/75 bg-[linear-gradient(180deg,#fff8fb_0%,#ffffff_100%)] p-4 pt-10 opacity-0 shadow-[0_24px_60px_rgba(251,114,153,0.2)] ring-1 ring-[#ffd6e3]/70 transition-all duration-300 group-hover/user:visible group-hover/user:translate-y-0 group-hover/user:opacity-100">
                                    <div className="mb-4 text-center text-lg font-bold text-slate-800">
                                        {userInfo.nickName}
                                    </div>

                                    <div className="mb-4 grid grid-cols-3 rounded-[18px] border border-[#ffe0ea] bg-[#fff4f8] px-2 py-3 text-center">
                                        <StatCard
                                            label="关注"
                                            value={renderCount(userCountInfo?.focusCount)}
                                        />
                                        <StatCard
                                            label="粉丝"
                                            value={renderCount(userCountInfo?.fansCount)}
                                            bordered
                                        />
                                        <StatCard
                                            label="硬币"
                                            value={renderCount(userCountInfo?.currentCoinCount)}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        {USER_MENU_ITEMS.map((item) => (
                                            <div
                                                key={item}
                                                onClick={() => handleMenuClick(item)}
                                                className={`cursor-pointer rounded-2xl px-4 py-2.5 text-[13px] transition-colors ${
                                                    item === '退出登录'
                                                        ? 'text-red-500/80 hover:bg-red-50'
                                                        : 'text-slate-600 hover:bg-[#fff1f6] hover:text-[var(--bili-pink-strong)]'
                                                }`}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {HEADER_LINKS.map(({ Icon, label, path }) => (
                            <NavIcon key={label} Icon={Icon} label={label} path={path} />
                        ))}

                        <div className="cursor-pointer transition-all hover:opacity-90 active:scale-95">
                            <HeaderUploadButton />
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
            <CategoryModule />
        </>
    );
}

function StatCard({
    label,
    value,
    bordered = false,
}: {
    label: string;
    value: string | number;
    bordered?: boolean;
}) {
    return (
        <div
            className={cn(
                'cursor-pointer transition-colors hover:text-[var(--bili-pink-strong)]',
                bordered && 'border-x border-[#ffd9e5] px-4',
            )}
        >
            <div className="text-sm font-bold text-slate-700">{value}</div>
            <div className="text-[11px] font-light text-slate-400">{label}</div>
        </div>
    );
}

function NavIcon({
    Icon,
    label,
    path,
}: {
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    path: string;
}) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)} // 绑定点击跳转
            className="group/icon flex cursor-pointer flex-col items-center justify-center rounded-[20px] px-2.5 py-2 transition-all duration-300 hover:bg-white/50 hover:shadow-[0_10px_26px_rgba(251,114,153,0.12)]"
        >
            <Icon className="h-5 w-5 text-[#9f4b67] transition-transform duration-300 group-hover/icon:-translate-y-0.5 group-hover/icon:text-[var(--bili-pink-strong)]" />
            <span className="mt-1 text-[11px] font-medium text-[#8a5065] transition-colors group-hover/icon:text-[var(--bili-pink-strong)]">
                {label}
            </span>
        </div>
    );
}
