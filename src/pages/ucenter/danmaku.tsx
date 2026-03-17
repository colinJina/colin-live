import { EmptyPanel } from './uArchive/archive-components';

export default function UcenterDanmaku() {
    return (
        <div className="space-y-4">
            <div>
                <div className="text-[18px] font-bold text-[#5b2b3b]">弹幕管理</div>
                <div className="mt-1 text-[12px] text-[#9b6a7c]">让弹幕更有趣也更友好</div>
            </div>
            <EmptyPanel title="暂无弹幕" desc="作品有弹幕时，可以在这里进行管理。" />
        </div>
    );
}
