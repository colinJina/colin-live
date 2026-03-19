import { cn } from '../../../utils';

export interface EmptyStateProps {
    title?: string;
    className?: string;
}

export default function EmptyState({
    title = '空间主人还没有投过视频哦~~',
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex min-h-[320px] w-full flex-col items-center justify-center rounded-[26px] border border-dashed border-[#ffd1e0] bg-[linear-gradient(180deg,#fff8fb_0%,#ffffff_80%)] p-8 text-center shadow-[0_18px_40px_rgba(251,114,153,0.10)]',
                className,
            )}
        >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/80 bg-white/80 shadow-[0_16px_32px_rgba(251,114,153,0.12)]">
                <EmptyBoxIcon className="h-8 w-8 text-[#fb7299]" />
            </div>
            <div className="text-[14px] font-semibold text-[#6d3b4d]">{title}</div>
        </div>
    );
}

function EmptyBoxIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
            <path
                d="M3.8 7.6 12 3l8.2 4.6v8.8L12 21l-8.2-4.6V7.6Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M3.8 7.6 12 12l8.2-4.4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path d="M12 12v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path
                d="M7.4 5.2 16.6 10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.7"
            />
        </svg>
    );
}
