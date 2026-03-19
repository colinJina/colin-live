import { getAvatarSrc } from '../../../utils';

export default function CollectionMessage() {
    const collections = [
        {
            id: 1,
            user: { name: '架构师之路', avatar: '' },
            videoName: 'TypeScript 进阶技巧分享',
            time: '昨天 18:20',
        },
    ];

    return (
        <div className="flex h-full flex-col">
            <h2 className="mb-6 text-lg font-bold text-[#5a3040]">收到收藏</h2>
            <div className="flex flex-col gap-4">
                {collections.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-2xl border border-[#ffd6e3]/30 bg-white/40 p-4 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="relative">
                            <img
                                src={getAvatarSrc(item.user.avatar)}
                                className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                                alt="avatar"
                            />
                            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffb11b] text-[10px] text-white shadow-sm">
                                ★
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-[14px] text-[#5a3040]">
                                <span className="font-bold">{item.user.name}</span>
                                <span className="mx-2 text-[#9f4b67]">收藏了你的视频</span>
                            </div>
                            <div className="mt-1 text-[12px] text-[#9499a0]">{item.time}</div>
                        </div>
                        <div className="max-w-[120px] rounded-xl bg-[linear-gradient(135deg,rgba(251,114,153,0.05)_0%,rgba(255,159,190,0.1)_100%)] px-3 py-4 text-[12px] font-medium text-[#fb7299] border border-[#fb7299]/20">
                            {item.videoName}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
