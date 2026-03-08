import CoinHoverIcon from '../../../assets/icon/coin-hover-icon.svg?react';
import CollectionIcon from '../../../assets/icon/collection-icon.svg?react';
import LikeIcon from '../../../assets/icon/like-icon.svg?react';

export default function UserActionPanel() {
    return (
        <div className="flex items-center border-b border-[#e3e5e7] px-4 py-1.5 pb-4">
            {/* 操作面板容器 */}
            <div className="flex items-center gap-1 text-[#61666d] sm:gap-6">
                {/* 1. 点赞 */}
                <div className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#fb7299]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full transition-colors group-hover:bg-[#f1f2f3]">
                        <LikeIcon className="h-5 w-5 transition-all" />
                    </div>
                    <span className="text-[13px] font-normal">0</span>
                </div>

                {/* 2. 投币 */}
                <div className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#fb7299]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full transition-colors group-hover:bg-[#f1f2f3]">
                        <CoinHoverIcon className="h-[28px] w-[28px] transition-all" />
                    </div>
                    <span className="text-[13px] font-normal">0</span>
                </div>

                {/* 3. 收藏 */}
                <div className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#fb7299]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full transition-colors group-hover:bg-[#f1f2f3]">
                        <CollectionIcon className="h-[22px] w-[22px] transition-all" />
                    </div>
                    <span className="text-[13px] font-normal">0</span>
                </div>
            </div>
        </div>
    );
}
