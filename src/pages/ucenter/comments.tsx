import { EmptyPanel } from './uArchive/archive-components';

export default function UcenterComments() {
    return (
        <div className="space-y-4">
            <div>
                <div className="text-[18px] font-bold text-[#5b2b3b]">评论管理</div>
                <div className="mt-1 text-[12px] text-[#9b6a7c]">查看并回复收到的评论</div>
            </div>
            <EmptyPanel title="暂无评论" desc="当作品收到评论时，会显示在这里。" />
        </div>
    );
}
