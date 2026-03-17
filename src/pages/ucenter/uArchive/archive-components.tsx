import React from 'react';

// 统计项 Props 接口
interface StatItemProps {
    Icon: React.FC<{ className?: string }>;
    count: number | string;
}

export function StatItem({ Icon, count }: StatItemProps) {
    return (
        <div className="group/stat flex items-center gap-1 cursor-pointer transition-colors hover:text-[#fb7299]">
            <Icon className="w-4 h-4 text-[#9b6a7c] transition-colors group-hover/stat:text-[#fb7299]" />
            <span className="text-[12px]">{count}</span>
        </div>
    );
}

export function EmptyPanel({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="rounded-[24px] border border-[#ffe1ec] bg-[#fff7fb] p-6 text-center shadow-[0_16px_30px_rgba(251,114,153,0.12)]">
            <div className="text-[16px] font-semibold text-[#5b2b3b]">{title}</div>
            <div className="mt-2 text-[12px] text-[#9b6a7c]">{desc}</div>
            <div className="mx-auto mt-4 h-20 w-20 rounded-full bg-[linear-gradient(135deg,#ffd3e4_0%,#fff_100%)] shadow-[0_14px_26px_rgba(251,114,153,0.16)]" />
        </div>
    );
}
