import { useMemo } from 'react';

import defaultAvatar from '@/assets/icon/user.svg';

export interface UserProfileHeaderProps {
    nickname: string;
    avatarSrc?: string;
    isEditingNickname?: boolean;
    draftNickname?: string;
    onStartEditNickname?: () => void;
    onCancelEditNickname?: () => void;
    onChangeDraftNickname?: (value: string) => void;
    onSaveNickname?: () => void;
}

export default function UserProfileHeader({
    nickname,
    avatarSrc,
    isEditingNickname,
    draftNickname,
    onStartEditNickname,
    onCancelEditNickname,
    onChangeDraftNickname,
    onSaveNickname,
}: UserProfileHeaderProps) {
    const avatar = useMemo(() => avatarSrc || defaultAvatar, [avatarSrc]);

    return (
        <div
            className="relative w-full overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,244,248,0.96)_0%,rgba(255,227,239,0.93)_34%,rgba(255,208,226,0.88)_68%,rgba(255,195,216,0.9)_100%)]"
            style={{ boxShadow: '0 18px 44px rgba(251,114,153,0.14)' }}
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-10 -top-14 h-44 w-44 rounded-full bg-white/50 blur-3xl" />
                <div className="absolute right-[12%] top-7 h-28 w-28 rounded-full bg-[#ff8db2]/35 blur-3xl" />
                <div className="absolute bottom-[-36px] left-[24%] h-24 w-80 rounded-full bg-white/35 blur-3xl" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/70 to-transparent" />
            </div>

            <div className="relative z-20 flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
                <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/75 bg-white/80 p-1 shadow-[0_14px_28px_rgba(251,114,153,0.16)]">
                        <img
                            src={avatar}
                            alt="avatar"
                            className="h-full w-full rounded-full border border-[#ffd6e3] bg-white object-cover"
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="text-[11px] font-semibold tracking-[0.24em] text-[#c26683]">
                            个人空间
                        </div>

                        {!isEditingNickname ? (
                            <div className="mt-1 flex min-w-0 items-center gap-2">
                                <div className="max-w-[260px] truncate text-[20px] font-extrabold text-[#4a2232]">
                                    {nickname}
                                </div>
                                <button
                                    type="button"
                                    onClick={onStartEditNickname}
                                    className="rounded-full border border-white/75 bg-white/70 px-3 py-1 text-[12px] font-semibold text-[#8a5065] shadow-[0_12px_22px_rgba(251,114,153,0.12)] transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:text-[var(--bili-pink-strong)]"
                                >
                                    编辑资料
                                </button>
                            </div>
                        ) : (
                            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                                <input
                                    value={draftNickname ?? ''}
                                    onChange={(e) => onChangeDraftNickname?.(e.target.value)}
                                    className="h-9 w-full rounded-xl border border-white/70 bg-white/70 px-3 text-[13px] font-semibold text-[#5a3040] shadow-[0_12px_24px_rgba(251,114,153,0.12)] outline-none transition-all placeholder:text-slate-400 focus:border-[#fb7299] focus:bg-white focus:ring-4 focus:ring-[#fb7299]/10 sm:w-[260px]"
                                    placeholder="请输入昵称"
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={onSaveNickname}
                                        className="h-9 flex-1 rounded-xl bg-[linear-gradient(135deg,#fb7299_0%,#ff9fbe_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_16px_28px_rgba(251,114,153,0.28)] transition-transform hover:-translate-y-0.5 sm:flex-none"
                                    >
                                        保存
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onCancelEditNickname}
                                        className="h-9 flex-1 rounded-xl border border-white/75 bg-white/70 px-4 text-[12px] font-semibold text-[#8a5065] shadow-[0_12px_22px_rgba(251,114,153,0.12)] transition-all hover:bg-white/90 sm:flex-none"
                                    >
                                        取消
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
