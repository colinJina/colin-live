import { useNavigate } from 'react-router-dom';

import type { MessageItem } from '../../../api/message';
import { getAvatarSrc } from '../../../utils';

type SystemMessageItemProps = {
    item: MessageItem;
};

const getAuditStatusText = (status: number | null, videoName: string) => {
    switch (status) {
        case 3:
            return `您上传的视频《${videoName}》已审核通过，快去看看吧！`;
        case 2: // 2 是审核不通过
            return `抱歉，您上传的视频《${videoName}》审核未通过，请检查是否符合社区规范。`;
        case 1: //  1 是审核中
            return `您上传的视频《${videoName}》正在审核中，请耐心等待。`;
        default:
            return `关于视频《${videoName}》的系统通知。`;
    }
};

export function SystemMessageItem({ item }: SystemMessageItemProps) {
    const { videoName, videoCover, extendDto, createTime } = item;
    const auditStatus = extendDto?.auditStatus;
    const title = auditStatus === 3 ? '视频审核通过' : '系统通知';
    const content = getAuditStatusText(auditStatus, videoName);

    const coverUrl = videoCover ? `${getAvatarSrc(videoCover)}` : null;
    const navigate = useNavigate();
    return (
        <div className="relative flex rounded-2xl border border-white/60 bg-white/40 p-5 transition-all hover:bg-white/60">
            {/* 左侧文字内容区 */}
            <div className="flex flex-1 flex-col gap-2 pr-4">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-[#5a3040]">{title}</span>
                    <span className="text-[12px] text-[#9499a0]">{createTime}</span>
                </div>
                <p className="text-[14px] leading-relaxed text-[#8a5065]">{content}</p>
            </div>

            {coverUrl && (
                <div
                    onClick={() => {
                        navigate(`/video/${item.videoId}`);
                    }}
                    className="h-16 w-[114px] cursor-pointer flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
                >
                    <img
                        src={coverUrl}
                        alt="video cover"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}
        </div>
    );
}
