import { Button, message } from 'antd';

import { getAvatarSrc } from '../../../utils';

import defaultAvatar from '@/assets/icon/user.svg';
import type { UserInfoVO } from '../../../api/uhome';
import { useCancelFocusUser, useFocusUser } from '../../../hooks/queries/useUhome';
import { useEffect } from 'react';

type VideoAuthorCardProps = {
    authorProfile: UserInfoVO;
    onVisitHome: () => void;
};
const renderCount = (value?: number) => (typeof value === 'number' ? value : '--');

export function VideoAuthorCard({ authorProfile, onVisitHome }: VideoAuthorCardProps) {
    useEffect(() => {
        console.log(authorProfile);
    });
    const { mutate: focus, isPending: isFocusing } = useFocusUser();
    const { mutate: cancelFocus, isPending: isCanceling } = useCancelFocusUser();
    const handleToggleFocus = () => {
        if (!authorProfile.userId) return;
        if (authorProfile.haveFocus) {
            cancelFocus(authorProfile.userId, {
                onSuccess: () => {
                    message.success('已取消关注');
                },
                onError: () => message.error('操作失败，请重试'),
            });
        } else {
            focus(authorProfile.userId, {
                onSuccess: () => {
                    message.success('关注成功');
                },
                onError: () => message.error('关注失败'),
            });
        }
    };

    const isPending = isFocusing || isCanceling;
    return (
        <section className="rounded-[16px] border border-[#e8edf5] bg-white p-4 shadow-sm">
            <div className="flex gap-4">
                <img
                    src={getAvatarSrc(authorProfile.avatar) || defaultAvatar}
                    alt={authorProfile.nickName}
                    className="h-16 w-16 shrink-0 rounded-full border border-[#eef2f7] bg-white object-cover"
                />
                <div className="min-w-0 flex-1">
                    <div className="truncate text-[17px] font-medium text-[#18191c]">
                        {authorProfile.nickName}
                    </div>
                    <div className="mt-1 text-xs text-[#9499a0]">
                        UP主 ID: {authorProfile.userId || '--'}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#61666d]">
                        {authorProfile.personIntroduction}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#61666d]">
                        <span className="rounded-full bg-[#f6f7fb] px-3 py-1">
                            关注 {renderCount(authorProfile.focusCount)}
                        </span>
                        <span className="rounded-full bg-[#f6f7fb] px-3 py-1">
                            粉丝 {renderCount(authorProfile.fansCount)}
                        </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button
                            type="primary"
                            className="rounded-full border-none bg-[#fb7299] px-4 hover:!bg-[#fc8bab]"
                            onClick={onVisitHome}
                            disabled={!authorProfile.userId}
                        >
                            访问主页
                        </Button>
                        <Button
                            loading={isPending}
                            onClick={handleToggleFocus}
                            className={`rounded-full px-6 ${
                                authorProfile.haveFocus
                                    ? 'bg-[#f1f2f3] text-[#9499a0] border-none hover:!bg-[#e3e5e7]'
                                    : 'bg-white text-[#fb7299] border-[#fb7299] hover:!text-[#fc8bab] hover:!border-[#fc8bab]'
                            }`}
                        >
                            {authorProfile.haveFocus ? '已关注' : '+ 关注'}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
