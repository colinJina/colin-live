import { cn, formatCount } from '../../../utils';

export interface StatisticsBarProps {
    following?: number;
    followers?: number;
    likes?: number;
    plays?: number;
    className?: string;
}

export default function StatisticsBar({
    following = 0,
    followers = 0,
    likes = 0,
    plays = 0,
    className,
}: StatisticsBarProps) {
    return (
        <div className={cn('flex items-center gap-6 md:gap-8', className)}>
            <StatItem label="关注" value={following} />
            <StatItem label="粉丝" value={followers} />
            <StatItem label="获赞" value={likes} />
            <StatItem label="播放" value={plays} />
        </div>
    );
}

function StatItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="group flex flex-col items-center gap-0.5 transition-transform hover:-translate-y-0.5">
            <div className="text-[20px] font-extrabold leading-tight text-[#4a2232] tabular-nums">
                {formatCount(value)}
            </div>
            <div className="text-[11px] font-semibold tracking-[0.12em] text-[#c26683]/80">
                {label}
            </div>
        </div>
    );
}
