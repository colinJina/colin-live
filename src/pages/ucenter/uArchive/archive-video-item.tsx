import { Checkbox, Popconfirm, Popover } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { VideoInfoPost } from '../../../api/video';
import CoinIcon from '../../../assets/icon/coin-icon.svg?react';
import CollectionIcon from '../../../assets/icon/collection-icon.svg?react';
import DanmuIcon from '../../../assets/icon/danmu-icon.svg?react';
import IconMore from '../../../assets/icon/edit-more-icon.svg?react';
import LikeIcon from '../../../assets/icon/like-icon.svg?react';
import PlayIcon from '../../../assets/icon/player-icon.svg?react';
import UcenterComment from '../../../assets/icon/ucenter-comment.svg?react';
import { useDeleteVideo, useSaveVideoInteraction } from '../../../hooks/queries/useVideo';
import { formatDuration, getAvatarSrc } from '../../../utils';

import { StatItem } from './archive-components';

export default function VideoItem({ video }: { video: VideoInfoPost }) {
    const title = video.videoName ?? '未命名稿件';
    const date = video.createTime ?? '';
    const duration = formatDuration(video.duration);
    const status = video.statusName ?? '';

    const { mutate: saveInteraction, isPending: isSaving } = useSaveVideoInteraction();
    const { mutate: deleteOne, isPending: isDeleting } = useDeleteVideo();
    const navigate = useNavigate();
    const videoId = video.videoId;
    const isBusy = isSaving || isDeleting;

    const interactionSet = useMemo(() => {
        const raw =
            typeof video.interaction === 'string'
                ? video.interaction
                : String(video.interaction ?? '');
        return new Set(
            raw
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
        );
    }, [video.interaction]);

    const [overrideCloseDanmu, setOverrideCloseDanmu] = useState<boolean | null>(null);
    const [overrideCloseComment, setOverrideCloseComment] = useState<boolean | null>(null);

    const closeDanmu = overrideCloseDanmu ?? interactionSet.has('0');
    const closeComment = overrideCloseComment ?? interactionSet.has('1');

    const commitInteraction = (nextCloseDanmu: boolean, nextCloseComment: boolean) => {
        const parts = [nextCloseDanmu ? '0' : '', nextCloseComment ? '1' : ''].filter(Boolean);
        const interaction = parts.join(',');
        saveInteraction({ videoId, interaction });
    };

    return (
        <div className="flex gap-5 rounded-[16px] border border-transparent p-4 transition-all hover:border-[#ffe1ec] hover:bg-[#fff7fb] hover:shadow-[0_8px_20px_rgba(251,114,153,0.06)]">
            {/* 封面区 */}
            <div
                onClick={() => {
                    if (video.status === 3) {
                        navigate(`/video/${video.videoId}`);
                    }
                }}
                className="relative h-[100px] w-[160px] flex-shrink-0 overflow-hidden rounded-[12px] bg-[#ffe1ec] cursor-pointer"
            >
                {video.videoCover ? (
                    <img
                        src={getAvatarSrc(video.videoCover)}
                        alt={title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#ffb8d2]">
                        <PlayIcon className="w-10 h-10 opacity-40" />
                    </div>
                )}
                <span className="absolute bottom-1.5 right-1.5 rounded-[4px] bg-black/50 px-1.5 py-0.5 text-[11px] text-white backdrop-blur-sm">
                    {duration}
                </span>
            </div>

            {/* 信息区 */}
            <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                    <div className="flex items-center gap-2">
                        <h3
                            onClick={() => {
                                if (video.status === 3) {
                                    navigate(`/video/${video.videoId}`);
                                }
                            }}
                            className="text-[15px] font-medium text-[#5b2b3b] hover:text-[#fb7299] cursor-pointer transition-colors line-clamp-1"
                        >
                            {title}
                        </h3>
                        <span className="shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium text-[#fb7299] bg-[#fff7fb] border border-[#ffe1ec]">
                            {status}
                        </span>
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#9b6a7c]">{date}</div>
                </div>

                {/* 数据统计区 */}
                <div className="flex items-center gap-5 text-[#9b6a7c]">
                    <StatItem Icon={PlayIcon} count={video.playCount ?? 0} />
                    <StatItem Icon={LikeIcon} count={video.likeCount ?? 0} />
                    <StatItem Icon={DanmuIcon} count={video.danmuCount ?? 0} />
                    <StatItem Icon={UcenterComment} count={video.commentCount ?? 0} />
                    <StatItem Icon={CoinIcon} count={video.coinCount ?? 0} />
                    <StatItem Icon={CollectionIcon} count={video.collectCount ?? 0} />
                </div>
            </div>

            {/* 操作区 */}
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 rounded-[8px] border border-[#ffe1ec] bg-white px-4 py-1.5 text-[13px] text-[#5b2b3b] transition-all hover:border-[#fb7299] hover:text-[#fb7299] hover:bg-[#fff7fb] shadow-sm active:scale-95">
                    编辑
                </button>
                <Popover
                    trigger="click"
                    placement="bottomRight"
                    content={
                        <div className="flex w-[160px] flex-col gap-1 p-1">
                            <label className="flex items-center gap-2 w-full rounded-[10px] px-3 py-2 text-left text-[13px] text-[#5b2b3b] transition-colors hover:bg-[#fff7fb] cursor-pointer select-none">
                                <Checkbox
                                    disabled={isBusy}
                                    checked={closeDanmu}
                                    onChange={(e) => {
                                        const next = e.target.checked;
                                        setOverrideCloseDanmu(next);
                                        commitInteraction(next, closeComment);
                                    }}
                                />
                                <span>关闭弹幕</span>
                            </label>
                            <label className="flex items-center gap-2 w-full rounded-[10px] px-3 py-2 text-left text-[13px] text-[#5b2b3b] transition-colors hover:bg-[#fff7fb] cursor-pointer select-none">
                                <Checkbox
                                    disabled={isBusy}
                                    checked={closeComment}
                                    onChange={(e) => {
                                        const next = e.target.checked;
                                        setOverrideCloseComment(next);
                                        commitInteraction(closeDanmu, next);
                                    }}
                                />
                                <span>关闭评论</span>
                            </label>
                            <div className="my-1 h-px bg-[#ffe1ec]" />
                            <Popconfirm
                                title="确定删除该稿件吗？"
                                description="删除后不可恢复"
                                okText="删除"
                                cancelText="取消"
                                okButtonProps={{ danger: true, loading: isDeleting }}
                                onConfirm={() => deleteOne({ videoId })}
                            >
                                <button
                                    disabled={isBusy}
                                    className="w-full rounded-[10px] px-3 py-2 text-left text-[13px] text-[#e5484d] transition-colors hover:bg-[#fff1f1] disabled:opacity-60"
                                >
                                    删除稿件
                                </button>
                            </Popconfirm>
                        </div>
                    }
                >
                    <button
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#ffe1ec] bg-white text-[#9b6a7c] transition-all hover:border-[#fb7299] hover:text-[#fb7299] hover:bg-[#fff7fb] shadow-sm active:scale-95"
                        aria-label="更多操作"
                    >
                        <IconMore className="w-5 h-5" />
                    </button>
                </Popover>
            </div>
        </div>
    );
}
