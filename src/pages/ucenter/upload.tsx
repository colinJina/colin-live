function EmptyPanel({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="rounded-[24px] border border-[#ffe1ec] bg-[#fff7fb] p-6 text-center shadow-[0_16px_30px_rgba(251,114,153,0.12)]">
            <div className="text-[16px] font-semibold text-[#5b2b3b]">{title}</div>
            <div className="mt-2 text-[12px] text-[#9b6a7c]">{desc}</div>
            <div className="mt-4 mx-auto h-20 w-20 rounded-full bg-[linear-gradient(135deg,#ffd3e4_0%,#fff_100%)] shadow-[0_14px_26px_rgba(251,114,153,0.16)]" />
        </div>
    );
}

export default function UcenterUpload() {
    return (
        <div className="space-y-4">
            <div>
                <div className="text-[18px] font-bold text-[#5b2b3b]">投稿管理</div>
                <div className="mt-1 text-[12px] text-[#9b6a7c]">上传、编辑并管理你的原创作品</div>
            </div>

            <EmptyPanel title="暂无投稿内容" desc="上传你的第一个作品，让世界看到你的才华吧！" />
        </div>
    );
}
