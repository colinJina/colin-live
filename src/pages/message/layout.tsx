import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { getNoReadCountGroup, readAllMessage, type NoReadCountItem } from '../../api/message';
import { useUserStore } from '../../stores/useUserStore';
import { cn } from '../../utils';

const MENU_ITEMS: Array<{
    label: string;
    path: string;
    messageType: NoReadCountItem['messageType'];
}> = [
    { label: '系统通知', path: '/message/sys', messageType: 1 },
    { label: '收到的赞', path: '/message/like', messageType: 2 },
    { label: '收到收藏', path: '/message/collection', messageType: 3 },
    { label: '评论和@', path: '/message/comment', messageType: 4 },
];

export default function MessageLayout() {
    const location = useLocation();
    const token = useUserStore((state) => state.userInfo?.token);
    const decreaseNoReadCount = useUserStore((state) => state.decreaseNoReadCount);
    const [noReadCountMap, setNoReadCountMap] = useState<Record<number, number>>({});

    if (!token && Object.keys(noReadCountMap).length > 0) {
        setNoReadCountMap({});
    }

    useEffect(() => {
        if (!token) {
            return;
        }

        let cancelled = false;

        const run = async () => {
            const res = await getNoReadCountGroup({ showError: false });
            const list = res?.data ?? [];

            const map: Record<number, number> = {};
            for (const item of list) {
                map[item.messageType] = item.messageCount ?? 0;
            }

            if (!cancelled) setNoReadCountMap(map);
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [token]);

    useEffect(() => {
        const activeItem = MENU_ITEMS.find((item) => location.pathname.includes(item.path));
        if (activeItem) {
            const count = noReadCountMap[activeItem.messageType];
            if (count > 0) {
                readAllMessage({ messageType: activeItem.messageType }, { showError: false }).then(
                    (res) => {
                        if (res?.code === 200) {
                            setNoReadCountMap((prev) => ({ ...prev, [activeItem.messageType]: 0 }));
                            decreaseNoReadCount(count);
                        }
                    },
                );
            }
        }
    }, [location.pathname, noReadCountMap, decreaseNoReadCount]);

    return (
        <div className="mx-auto flex max-w-[1200px] gap-6 px-4 py-8 md:px-6">
            {/* 左侧边栏 - 导航菜单 */}
            <aside className="h-fit w-56 shrink-0 rounded-[32px] border border-[#ffd6e3]/50 bg-[linear-gradient(135deg,rgba(255,248,251,0.96)_0%,rgba(255,229,240,0.92)_100%)] p-4 shadow-[0_32px_64px_-16px_rgba(251,114,153,0.15)] backdrop-blur-2xl">
                <div className="mb-4 px-4 pt-2 text-[15px] font-bold text-[#5a3040]">消息中心</div>
                <nav className="flex flex-col gap-2">
                    {MENU_ITEMS.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        const unreadCount = noReadCountMap[item.messageType] ?? 0;
                        const showRedDot = unreadCount > 0;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    'group relative flex items-center justify-between rounded-2xl px-4 py-3 text-[14px] font-medium transition-all duration-300 overflow-hidden',
                                    isActive
                                        ? 'bg-white/60 text-[var(--bili-pink-strong)] shadow-[0_8px_32px_-8px_rgba(251,114,153,0.12)] border border-white/80'
                                        : 'text-[#8a5065] border border-transparent hover:bg-white/30 hover:text-[#fb7299]',
                                )}
                            >
                                {/* 选中的左侧亮色指示条 */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[linear-gradient(180deg,#fb7299_0%,#ff9fbe_100%)] shadow-[2px_0_8px_rgba(251,114,153,0.4)]" />
                                )}

                                <span
                                    className={cn(
                                        'transition-transform duration-300',
                                        isActive ? 'translate-x-1.5' : 'group-hover:translate-x-1',
                                    )}
                                >
                                    {item.label}
                                </span>

                                {/* 未读消息小红点 */}
                                {showRedDot && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#ff4d4f] shadow-[0_0_6px_#ff4d4f]" />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* 右侧内容区 */}
            <main className="min-h-[600px] flex-1 rounded-[32px] border border-[#ffd6e3]/50 bg-[linear-gradient(135deg,rgba(255,248,251,0.96)_0%,rgba(255,229,240,0.92)_100%)] p-6 shadow-[0_32px_64px_-16px_rgba(251,114,153,0.15)] backdrop-blur-2xl md:p-8">
                <Outlet />
            </main>
        </div>
    );
}
