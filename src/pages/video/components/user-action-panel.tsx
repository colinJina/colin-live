import type { UserAction, VideoInfo } from '../../../api/video';
import CoinIcon from '../../../assets/icon/coin-icon.svg?react';
import CollectionIcon from '../../../assets/icon/collection-icon.svg?react';
import LikeIcon from '../../../assets/icon/like-icon.svg?react';
import { useLoginModal } from '../../../provider/login-modal-provider';
import { useUserStore } from '../../../stores/useUserStore';
import { message } from 'antd';
import { useVideoActionMutation } from '../../../hooks/queries/useUhome';

export interface userActionPanelProps {
    videoInfo: VideoInfo;
    videoId: string;
    userActionList?: UserAction[];
}

export default function UserActionPanel({
    videoInfo,
    videoId,
    userActionList = [],
}: userActionPanelProps) {
    const { openLoginModal } = useLoginModal();
    const userInfo = useUserStore((state) => state.userInfo);
    const actionMutation = useVideoActionMutation(videoId);
    const isLiked = userActionList.some(
        (action) => action.actionType === 2 && (action.actionCount ?? 0) > 0,
    );
    const isCollected = userActionList.some(
        (action) => action.actionType === 3 && (action.actionCount ?? 0) > 0,
    );
    const isCoined = userActionList.some(
        (action) => action.actionType === 4 && (action.actionCount ?? 0) > 0,
    );

    const handleActionClick = (actionType: number, actionCount = 1) => {
        if (!userInfo) {
            openLoginModal();
            return;
        }

        if (actionMutation.isPending) return;

        if (actionType === 4 && isCoined) {
            message.warning('已经投过币啦~');
            return;
        }

        actionMutation.mutate({ videoId, actionType, actionCount });
    };

    const getBtnClass = (isActive: boolean) =>
        `group flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 transition-all hover:-translate-y-0.5 ${
            isActive
                ? 'border-[#ffc1d4] text-[#fb7299] bg-[#fff5f8]'
                : 'border-[#ffe0ea] bg-white/72'
        }`;

    const getIconWrapperClass = (isActive: boolean) =>
        `flex h-8 w-8 items-center justify-center rounded-full ${isActive ? 'bg-[#ffe4ee]' : 'bg-gray-50'}`;

    return (
        <div className="border-t border-white/65 bg-white/45 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[#8f5b70] sm:gap-4">
                {/* 点赞 */}
                <div className={getBtnClass(isLiked)} onClick={() => handleActionClick(2)}>
                    <div className={getIconWrapperClass(isLiked)}>
                        <LikeIcon className={`h-5 w-5 ${isLiked ? 'fill-[#fb7299]' : ''}`} />
                    </div>
                    <span className="text-[13px] font-medium">{videoInfo?.likeCount || 0}</span>
                </div>

                {/* 投币 */}
                <div className={getBtnClass(isCoined)} onClick={() => handleActionClick(4, 1)}>
                    <div className={getIconWrapperClass(isCoined)}>
                        <CoinIcon
                            className={`h-[26px] w-[26px] ${isCoined ? 'fill-[#fb7299]' : ''}`}
                        />
                    </div>
                    <span className="text-[13px] font-medium">{videoInfo?.coinCount || 0}</span>
                </div>

                {/* 收藏 */}
                <div className={getBtnClass(isCollected)} onClick={() => handleActionClick(3)}>
                    <div className={getIconWrapperClass(isCollected)}>
                        <CollectionIcon
                            className={`h-[20px] w-[20px] ${isCollected ? 'fill-[#fb7299]' : ''}`}
                        />
                    </div>
                    <span className="text-[13px] font-medium">{videoInfo?.collectCount || 0}</span>
                </div>
            </div>
        </div>
    );
}
