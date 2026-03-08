import CoinHoverIcon from '../../../assets/icon/coin-hover-icon.svg?react';
import CollectionIcon from '../../../assets/icon/collection-icon.svg?react';
import LikeIcon from '../../../assets/icon/like-icon.svg?react';

export default function UserActionPanel() {
    return (
        <div className="border-t border-white/65 bg-white/45 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[#8f5b70] sm:gap-4">
                <div className="group flex cursor-pointer items-center gap-2 rounded-full border border-[#ffe0ea] bg-white/72 px-3 py-2 shadow-[0_10px_22px_rgba(251,114,153,0.08)] transition-all hover:-translate-y-0.5 hover:border-[#ffc1d4] hover:text-[#fb7299]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(180deg,#fff9fb_0%,#fff0f5_100%)] transition-colors group-hover:bg-[#fff5f8]">
                        <LikeIcon className="h-5 w-5 transition-all" />
                    </div>
                    <span className="text-[13px] font-medium">0</span>
                </div>

                <div className="group flex cursor-pointer items-center gap-2 rounded-full border border-[#ffe0ea] bg-white/72 px-3 py-2 shadow-[0_10px_22px_rgba(251,114,153,0.08)] transition-all hover:-translate-y-0.5 hover:border-[#ffc1d4] hover:text-[#fb7299]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(180deg,#fff9fb_0%,#fff0f5_100%)] transition-colors group-hover:bg-[#fff5f8]">
                        <CoinHoverIcon className="h-[26px] w-[26px] transition-all" />
                    </div>
                    <span className="text-[13px] font-medium">0</span>
                </div>

                <div className="group flex cursor-pointer items-center gap-2 rounded-full border border-[#ffe0ea] bg-white/72 px-3 py-2 shadow-[0_10px_22px_rgba(251,114,153,0.08)] transition-all hover:-translate-y-0.5 hover:border-[#ffc1d4] hover:text-[#fb7299]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(180deg,#fff9fb_0%,#fff0f5_100%)] transition-colors group-hover:bg-[#fff5f8]">
                        <CollectionIcon className="h-[20px] w-[20px] transition-all" />
                    </div>
                    <span className="text-[13px] font-medium">0</span>
                </div>
            </div>
        </div>
    );
}
