import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Zhuzhan from '../../../assets/icon/zhuzhan.svg?react';
import UcenterArchive from '../../../assets/icon/ucenter-archive.svg?react';
import UcenterUpload from '../../../assets/icon/ucenter-upload.svg?react';
import UcenterDanmuku from '../../../assets/icon/ucenter-danmuku.svg?react';
import UcenterComment from '../../../assets/icon/ucenter-comment.svg?react';
import UserHoverCard from '../../user/user-hover-card';

interface MenuItem {
    label: string;
    to: string;
    icon: keyof typeof ICONS;
}

interface MenuGroup {
    readonly title: string;
    readonly items: readonly MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
    {
        title: '个人中心',
        items: [
            { label: '首页', to: '/ucenter/home', icon: 'home' },
            { label: '投稿', to: '/ucenter/upload', icon: 'upload' },
        ],
    },
    {
        title: '内容管理',
        items: [{ label: '稿件管理', to: '/ucenter/content/archives', icon: 'archive' }],
    },
    {
        title: '互动管理',
        items: [
            { label: '评论管理', to: '/ucenter/interaction/comments', icon: 'comment' },
            { label: '弹幕管理', to: '/ucenter/interaction/danmaku', icon: 'danmaku' },
        ],
    },
];

const ICONS: Record<string, React.ElementType> = {
    home: Zhuzhan,
    upload: UcenterUpload,
    archive: UcenterArchive,
    comment: UcenterComment,
    danmaku: UcenterDanmuku,
};

export default function UhomeLayout() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[linear-gradient(160deg,#fff8fb_0%,#fff_45%,#fff4f9_100%)]">
            {/* 顶部导航栏 */}
            <div className="relative border-b  border-white/70 bg-[linear-gradient(135deg,rgba(255,240,247,0.95)_0%,rgba(255,214,230,0.86)_48%,rgba(255,198,220,0.82)_100%)]">
                <div className="pointer-events-none  overflow-hidden absolute inset-0">
                    <div className="absolute -left-10 -top-12 h-36 w-36 rounded-full bg-white/55 blur-3xl" />
                    <div className="absolute right-10 top-4 h-24 w-24 rounded-full bg-[#ff8bb4]/35 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-16 w-64 rounded-full bg-white/45 blur-2xl" />
                </div>

                <div className="relative z-20 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
                    <div className="flex items-center gap-3">
                        <div
                            onClick={() => {
                                navigate('/home');
                            }}
                            className="group flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white/72 px-4 py-2 shadow-[0_14px_30px_rgba(251,114,153,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/88"
                        >
                            <Zhuzhan className="h-5 w-5 text-[var(--bili-pink-strong)] transition-transform duration-300 group-hover:scale-110" />
                            <span className="text-[15px] font-semibold tracking-[0.08em] text-[var(--text)]">
                                首页
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center mr-20 md:mr-28">
                        <UserHoverCard />
                    </div>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="mx-auto flex w-full max-w-[1200px] gap-6 px-4 py-6 md:px-8">
                {/* 侧边栏 (Desktop) */}
                <aside className="hidden w-64 shrink-0 flex-col gap-6 md:flex">
                    {MENU_GROUPS.map((group) => (
                        <div
                            key={group.title}
                            className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_38px_rgba(251,114,153,0.14)]"
                        >
                            <div className="mb-3 text-[12px] font-semibold tracking-[0.2em] text-[#c26683]">
                                {group.title}
                            </div>
                            <div className="space-y-2">
                                {group.items.map((item) => {
                                    const IconComponent = ICONS[item.icon];
                                    return (
                                        <NavLink
                                            key={item.label}
                                            to={item.to}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 rounded-2xl px-3 py-2 text-[13px] font-medium transition-all ${
                                                    isActive
                                                        ? 'bg-[linear-gradient(135deg,#ffe1ec_0%,#fff_100%)] text-[var(--bili-pink-strong)] shadow-[0_12px_24px_rgba(251,114,153,0.18)]'
                                                        : 'text-[#6d3b4d] hover:bg-[#fff1f6]'
                                                }`
                                            }
                                        >
                                            <IconComponent className="h-4 w-4" />
                                            {item.label}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* 导航 (Mobile) */}
                <div className="flex w-full flex-col gap-4 md:hidden">
                    <div className="rounded-[22px] border border-white/70 bg-white/85 p-3 shadow-[0_16px_32px_rgba(251,114,153,0.12)]">
                        <div className="grid grid-cols-2 gap-2">
                            {MENU_GROUPS.flatMap((group) => group.items).map((item) => {
                                const IconComponent = ICONS[item.icon];
                                return (
                                    <NavLink
                                        key={item.label}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold ${
                                                isActive
                                                    ? 'bg-[linear-gradient(135deg,#ffe1ec_0%,#fff_100%)] text-[var(--bili-pink-strong)]'
                                                    : 'text-[#6d3b4d] hover:bg-[#fff1f6]'
                                            }`
                                        }
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 主路由出口 */}
                <main className="min-h-[640px] w-full rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_40px_rgba(251,114,153,0.16)] md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
