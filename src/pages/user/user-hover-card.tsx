import { useNavigate } from 'react-router-dom';

import useUserAuth from '../../hooks/queries/useUserAuth';
import { cn, getAvatarSrc } from '../../utils';

import defaultAvatar from '@/assets/icon/user.svg';

const USER_MENU_ITEMS = ['个人中心', '投稿管理', '退出登录'] as const;

export default function UserHoverCard() {
    const navigate = useNavigate();
    const { userInfo, userCountInfo, handleLogout, handleLogin } = useUserAuth();

    const handleMenuClick = (item: string) => {
        if (item === '退出登录') return handleLogout();

        if (item === '个人中心' && userInfo?.userId) {
            navigate(`/user/${encodeURIComponent(userInfo.userId)}`);
        } else if (item === '投稿管理') {
            navigate('/ucenter/content/archives');
        }
    };

    const renderCount = (val?: number) => (typeof val === 'number' ? val : '--');

    return (
        <div className="relative group/user py-2">
            {/* 头像触发区域 */}
            <div
                className={cn(
                    'relative z-50 cursor-pointer rounded-full border border-white/75 bg-white/85 p-1 shadow-[0_10px_24px_rgba(251,114,153,0.16)] transition-all duration-500 ease-out',
                    userInfo && 'group-hover/user:translate-y-6 group-hover/user:scale-[1.55]',
                )}
                onClick={() => !userInfo && handleLogin()}
            >
                <img
                    src={userInfo ? getAvatarSrc(userInfo.avatar) : defaultAvatar}
                    className="h-9 w-9 rounded-full border border-[#ffd6e3] bg-white object-cover"
                    alt="avatar"
                />
            </div>

            {/* 悬浮面板 */}
            {userInfo && (
                <div className="invisible absolute left-1/2 top-14 w-72 -translate-x-1/2 translate-y-4 rounded-[24px] border border-white/75 bg-[linear-gradient(180deg,#fff8fb_0%,#ffffff_100%)] p-4 pt-10 opacity-0 shadow-[0_24px_60px_rgba(251,114,153,0.2)] ring-1 ring-[#ffd6e3]/70 transition-all duration-300 group-hover/user:visible group-hover/user:translate-y-0 group-hover/user:opacity-100">
                    <div className="mb-4 text-center text-lg font-bold text-slate-800">
                        {userInfo.nickName}
                    </div>

                    <div className="mb-4 grid grid-cols-3 rounded-[18px] border border-[#ffe0ea] bg-[#fff4f8] px-2 py-3 text-center">
                        <StatItem label="关注" value={renderCount(userCountInfo?.focusCount)} />
                        <StatItem
                            label="粉丝"
                            value={renderCount(userCountInfo?.fansCount)}
                            bordered
                        />
                        <StatItem
                            label="硬币"
                            value={renderCount(userCountInfo?.currentCoinCount)}
                        />
                    </div>

                    <div className="space-y-1">
                        {USER_MENU_ITEMS.map((item) => (
                            <div
                                key={item}
                                onClick={() => handleMenuClick(item)}
                                className={cn(
                                    'cursor-pointer rounded-2xl px-4 py-2.5 text-[13px] transition-colors',
                                    item === '退出登录'
                                        ? 'text-red-500/80 hover:bg-red-50'
                                        : 'text-slate-600 hover:bg-[#fff1f6] hover:text-[var(--bili-pink-strong)]',
                                )}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatItem({
    label,
    value,
    bordered,
}: {
    label: string;
    value: string | number;
    bordered?: boolean;
}) {
    return (
        <div
            className={cn(
                'transition-colors hover:text-[var(--bili-pink-strong)]',
                bordered && 'border-x border-[#ffd9e5] px-2',
            )}
        >
            <div className="text-sm font-bold text-slate-700">{value}</div>
            <div className="text-[11px] font-light text-slate-400">{label}</div>
        </div>
    );
}
