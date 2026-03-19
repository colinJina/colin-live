import { Button } from 'antd';
import type { UserInfoVO } from '../../../api/uhome';
import { useCancelFocusUser, useFocusUser } from '../../../hooks/queries/useUhome';
import { useLoginModal } from '../../../provider/login-modal-provider';
import { useUserStore } from '../../../stores/useUserStore';
import { getAvatarSrc } from '../../../utils';
import { toast } from '../../header/message';

import defaultAvatar from '@/assets/icon/user.svg';

type VideoAuthorCardProps = {
    authorProfile: UserInfoVO;
    onVisitHome: () => void;
};
const renderCount = (value?: number) => (typeof value === 'number' ? value : '--');

export function VideoAuthorCard({ authorProfile, onVisitHome }: VideoAuthorCardProps) {
    const { mutate: focus, isPending: isFocusing } = useFocusUser();
    const { mutate: cancelFocus, isPending: isCanceling } = useCancelFocusUser();
    const userInfo = useUserStore((state) => state.userInfo);
    const { openLoginModal } = useLoginModal();
    const handleToggleFocus = () => {
        if (!authorProfile.userId) return;
        if (!userInfo) {
            openLoginModal();
            return;
        }
        if (authorProfile.haveFocus) {
            cancelFocus(authorProfile.userId, {
                onSuccess: () => {
                    toast.success('\u5df2\u53d6\u6d88\u5173\u6ce8');
                },
                onError: () => toast.error('\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5'),
            });
        } else {
            focus(authorProfile.userId, {
                onSuccess: () => {
                    toast.success('\u5173\u6ce8\u6210\u529f');
                },
                onError: () => toast.error('\u5173\u6ce8\u5931\u8d25'),
            });
        }
    };

    const isPending = isFocusing || isCanceling;
    return (
        <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,239,246,0.98)_100%)] p-4 shadow-[0_18px_40px_rgba(251,114,153,0.12)] ring-1 ring-[#ffd8e4]/70">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-[10%] top-4 h-16 w-16 rounded-full bg-[#ffb3ca]/20 blur-2xl" />
                <div className="absolute bottom-[-18px] left-[16%] h-12 w-32 rounded-full bg-white/45 blur-2xl" />
            </div>

            <div className="relative mb-4 flex items-center justify-between">
                <div className="inline-flex rounded-full border border-[#ffd4e2] bg-white/72 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#dd6a90]">
                    AUTHOR
                </div>
                <div className="text-xs font-medium text-[#b17189]">UP PROFILE</div>
            </div>

            <div className="relative flex gap-4">
                <img
                    src={getAvatarSrc(authorProfile.avatar) || defaultAvatar}
                    alt={authorProfile.nickName}
                    className="h-16 w-16 shrink-0 rounded-full border border-[#ffe1ea] bg-white object-cover shadow-[0_10px_22px_rgba(251,114,153,0.1)]"
                />
                <div className="min-w-0 flex-1">
                    <div className="truncate text-[17px] font-semibold text-[#6f3f55]">
                        {authorProfile.nickName}
                    </div>
                    <div className="mt-1 text-xs text-[#b07b90]">
                        {'UP\u4e3b ID: '} {authorProfile.userId || '--'}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#8d5c70]">
                        {authorProfile.personIntroduction}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#8d5c70]">
                        <span className="rounded-full border border-[#ffe1ea] bg-white/72 px-3 py-1.5 shadow-[0_8px_18px_rgba(251,114,153,0.06)]">
                            {'\u5173\u6ce8 '} {renderCount(authorProfile.focusCount)}
                        </span>
                        <span className="rounded-full border border-[#ffe1ea] bg-white/72 px-3 py-1.5 shadow-[0_8px_18px_rgba(251,114,153,0.06)]">
                            {'\u7c89\u4e1d '} {renderCount(authorProfile.fansCount)}
                        </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button
                            type="primary"
                            className="h-9! rounded-full! border-none! bg-[linear-gradient(180deg,#ff8fb3_0%,#fb7299_100%)] px-4! font-medium! text-white! shadow-[0_10px_24px_rgba(251,114,153,0.18)] hover:!bg-[linear-gradient(180deg,#ff9abd_0%,#fc7ea3_100%)]"
                            onClick={onVisitHome}
                            disabled={!authorProfile.userId}
                        >
                            {'\u8bbf\u95ee\u4e3b\u9875'}
                        </Button>
                        <Button
                            loading={isPending}
                            onClick={handleToggleFocus}
                            className={`h-9! rounded-full! px-5! font-medium! shadow-none! ${
                                authorProfile.haveFocus
                                    ? 'border-none! bg-white/80! text-[#b07b90]! hover:!bg-white!'
                                    : 'border-[#ffbfd3]! bg-[linear-gradient(180deg,#ffffff_0%,#fff2f7_100%)] text-[#fb7299]! hover:!border-[#ffb0c8] hover:!text-[#e05d8d]'
                            }`}
                        >
                            {authorProfile.haveFocus ? '\u5df2\u5173\u6ce8' : '+ \u5173\u6ce8'}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
