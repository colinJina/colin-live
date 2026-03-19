import { useMemo, useState } from 'react';

import type { UserInfoVO } from '../../../api/uhome';
import { getAvatarSrc } from '../../../utils';

import StatisticsBar from './statistics-bar';
import UserProfileModal from './user-profile-modal';

import defaultAvatar from '@/assets/icon/user.svg';

export interface UserProfileHeaderProps {
    userInfo?: UserInfoVO;
}

export default function UserProfileHeader({ userInfo }: UserProfileHeaderProps) {
    const avatar = useMemo(
        () => getAvatarSrc(userInfo?.avatar) || defaultAvatar,
        [userInfo?.avatar],
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div
            className="relative w-full overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,244,248,0.96)_0%,rgba(255,227,239,0.93)_34%,rgba(255,208,226,0.88)_68%,rgba(255,195,216,0.9)_100%)]"
            style={{ boxShadow: '0 18px 44px rgba(251,114,153,0.14)' }}
        >
            {/* 背景装饰 */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-10 -top-14 h-52 w-52 rounded-full bg-white/50 blur-3xl" />
                <div className="absolute right-[10%] top-5 h-36 w-36 rounded-full bg-[#ff8db2]/30 blur-3xl" />
                <div className="absolute bottom-[-36px] left-[24%] h-28 w-80 rounded-full bg-white/35 blur-3xl" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/60 to-transparent" />
            </div>

            <div className="relative z-20 flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
                {/* 左侧：头像 + 基本信息 */}
                <div className="flex items-center gap-5">
                    {/* 头像 — 80px */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-white/80 bg-white/80 p-0.5 shadow-[0_16px_32px_rgba(251,114,153,0.18)]">
                        <img
                            src={avatar}
                            alt="avatar"
                            className="h-full w-full rounded-full border border-[#ffd6e3] bg-white object-cover"
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="text-[11px] font-semibold tracking-[0.24em] text-[#c26683] opacity-80">
                            个人空间
                        </div>

                        <div className="mt-1 flex items-center gap-3">
                            <div className="max-w-[260px] truncate text-[24px] font-extrabold leading-snug text-[#4a2232]">
                                {userInfo?.nickName || '--'}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="shrink-0 rounded-full cursor-pointer border border-white/75 bg-white/70 px-3 py-1 text-[12px] font-semibold text-[#8a5065] shadow-[0_12px_22px_rgba(251,114,153,0.12)] transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:text-[var(--bili-pink-strong)]"
                            >
                                编辑资料
                            </button>
                        </div>

                        {/* 简介 & 公告 */}
                        <div className="mt-2.5 flex flex-col gap-1.5 text-[13px] text-[#8a5065]/80 md:flex-row md:items-center md:gap-x-4">
                            <div className="flex items-center gap-1.5 max-w-[300px]">
                                <span className="shrink-0 font-bold text-[#c26683]">简介:</span>
                                <span className="truncate">
                                    {userInfo?.personIntroduction || '这个人很懒，什么都没有写~'}
                                </span>
                            </div>

                            <div className="hidden h-3 w-[1px] bg-[#c26683]/30 md:block" />

                            <div className="flex items-center gap-1.5 max-w-[400px]">
                                <span className="shrink-0 flex items-center gap-1 font-bold text-[#fb7299]">
                                    <span className="text-[10px] border border-[#fb7299] rounded px-1 leading-tight">
                                        公告
                                    </span>
                                </span>
                                <span className="truncate italic">
                                    {userInfo?.noticeInfo || '暂无公告'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <StatisticsBar
                    following={userInfo?.focusCount}
                    followers={userInfo?.fansCount}
                    likes={userInfo?.likeCount}
                    plays={userInfo?.playCount}
                    className="mt-1 md:mt-0 md:pr-2"
                />
            </div>

            <UserProfileModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userInfo={userInfo}
            />
        </div>
    );
}
