import { Button } from 'antd';

import { getAvatarSrc } from '../../../utils';

import defaultAvatar from '@/assets/icon/user.svg';

export interface VideoAuthorProfile {
    userId: string;
    nickName: string;
    avatar: string;
    introduction: string;
    fansCount?: number;
    focusCount?: number;
}

type VideoAuthorCardProps = {
    authorProfile: VideoAuthorProfile;
    onVisitHome: () => void;
};

const renderCount = (value?: number) => (typeof value === 'number' ? value : '--');

export function VideoAuthorCard({ authorProfile, onVisitHome }: VideoAuthorCardProps) {
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
                        {authorProfile.introduction}
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
                        <Button disabled className="rounded-full px-4">
                            关注作者
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
