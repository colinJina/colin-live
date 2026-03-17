import { cn } from '../../../utils';

export interface StatisticsBarProps {
    following?: number;
    followers?: number;
    likes?: number;
    plays?: number;
    className?: string;
}

export default function StatisticsBar({
    following = 1,
    followers = 0,
    likes = 0,
    plays = 0,
    className,
}: StatisticsBarProps) {
    return (
        <div
            className={cn(
                'grid grid-cols-2 gap-3 rounded-[26px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_rgba(251,114,153,0.14)] md:grid-cols-4 md:gap-0 md:p-5',
                className,
            )}
        >
            <StatItem label="关注数" value={following} />
            <StatItem label="粉丝数" value={followers} bordered="md:border-l" />
            <StatItem label="获赞数" value={likes} bordered="md:border-l" />
            <StatItem label="播放数" value={plays} bordered="md:border-l" />
        </div>
    );
}

function StatItem({ label, value, bordered }: { label: string; value: number; bordered?: string }) {
    return (
        <div
            className={cn(
                'flex items-center justify-between rounded-[18px] border border-[#ffe0ea] bg-[#fff4f8] px-4 py-3 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_28px_rgba(251,114,153,0.12)] md:rounded-none md:border-0 md:bg-transparent md:px-6 md:py-2 md:hover:translate-y-0 md:hover:shadow-none',
                bordered && `${bordered} md:border-[#ffd9e5]`,
            )}
        >
            <div>
                <div className="text-[11px] font-semibold tracking-[0.18em] text-[#c26683]">
                    {label}
                </div>
                <div className="mt-1 text-[18px] font-extrabold text-[#4a2232]">{value}</div>
            </div>
            <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-[#fb7299] shadow-[0_12px_20px_rgba(251,114,153,0.10)] md:flex">
                <SparkDot />
            </div>
        </div>
    );
}

function SparkDot() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
                d="M12 2l1.2 4.8L18 8l-4.8 1.2L12 14l-1.2-4.8L6 8l4.8-1.2L12 2Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M18.5 13.5l.7 2.7 2.8.7-2.8.7-.7 2.7-.7-2.7-2.8-.7 2.8-.7.7-2.7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                opacity="0.9"
            />
        </svg>
    );
}
