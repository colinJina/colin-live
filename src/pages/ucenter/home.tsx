import ReactECharts from 'echarts-for-react';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import {
    useActualTimeStatisticsInfo,
    useWeekStatisticsInfo,
} from '../../hooks/queries/useUcenterStatistics';

export default function UcenterHome() {
    /**
     * dataType 约定（与后端保持一致）
     * 1=播放 2=弹幕 3=评论 4=点赞 5=收藏 6=投币 7=粉丝
     */
    const STAT_ITEMS = useMemo(
        () =>
            [
                { label: '粉丝', dataType: 7, totalKey: 'userCount', icon: '👥' },
                { label: '播放', dataType: 1, totalKey: 'playCount', icon: '▶️' },
                { label: '评论', dataType: 3, totalKey: 'commentCount', icon: '💬' },
                { label: '弹幕', dataType: 2, totalKey: 'danmuCount', icon: '📺' },
                { label: '点赞', dataType: 4, totalKey: 'likeCount', icon: '👍' },
                { label: '收藏', dataType: 5, totalKey: 'collectCount', icon: '⭐' },
                { label: '投币', dataType: 6, totalKey: 'coinCount', icon: '🪙' },
            ] as const,
        [],
    );

    const [activeType, setActiveType] = useState<number>(STAT_ITEMS[0].dataType);

    const { data: overview } = useActualTimeStatisticsInfo();
    const { data: weekList } = useWeekStatisticsInfo(activeType, true);

    const activeItem = useMemo(
        () => STAT_ITEMS.find((x) => x.dataType === activeType) ?? STAT_ITEMS[0],
        [STAT_ITEMS, activeType],
    );

    const videoStats = useMemo(() => {
        const pre = overview?.preDayData ?? {};
        const total = overview?.totalCountInfo ?? {};
        return STAT_ITEMS.map((item) => {
            const value = Number(total[item.totalKey] ?? 0);
            const preDayValue = Number(pre[String(item.dataType)] ?? 0);
            return {
                ...item,
                value,
                preDayValue,
                active: item.dataType === activeType,
            };
        });
    }, [STAT_ITEMS, activeType, overview]);

    const chartOptions = useMemo(() => {
        const list = weekList ?? [];
        const xAxisData = list.map((x) => dayjs(x.statisticsDate).format('MM-DD'));
        const seriesData = list.map((x) => Number(x.statisticsCount ?? 0));

        return {
            grid: { top: '15%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLine: { lineStyle: { color: '#e5e7eb' } },
                axisLabel: { color: '#9b6a7c' },
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
                axisLabel: { color: '#9b6a7c' },
            },
            tooltip: { trigger: 'axis' },
            series: [
                {
                    name: activeItem.label,
                    data: seriesData,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#fb7299' },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(251,114,153,0.2)' },
                                { offset: 1, color: 'rgba(251,114,153,0)' },
                            ],
                        },
                    },
                    lineStyle: { width: 3 },
                },
            ],
        };
    }, [weekList, activeItem.label]);

    return (
        <div className="space-y-6">
            {/* --- 上半部分：视频数据卡片 --- */}
            <section className="rounded-[28px] border border-white/70 bg-white/60 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.04)] backdrop-blur-md">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-[#5b2b3b]">视频数据</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {videoStats.map((item) => (
                        <div
                            key={item.label}
                            role="button"
                            tabIndex={0}
                            onClick={() => setActiveType(item.dataType)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ')
                                    setActiveType(item.dataType);
                            }}
                            className={`relative cursor-pointer overflow-hidden rounded-[20px] p-5 transition-all hover:scale-[1.02] ${
                                item.active
                                    ? 'bg-[linear-gradient(135deg,#ff5c93_0%,#fb7299_100%)] text-white shadow-[0_12px_24px_rgba(251,114,153,0.3)]'
                                    : 'bg-[#f0faff] text-[#00aeec] border border-[#e0f2fe]'
                            }`}
                        >
                            <div className="flex items-center gap-2 opacity-90">
                                <span className="text-sm font-medium">{item.label}</span>
                                <span className="ml-auto text-xs font-bold opacity-60">
                                    昨日 {item.preDayValue}
                                </span>
                            </div>
                            <div className="mt-2 text-2xl font-bold">{item.value}</div>

                            <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 grayscale">
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(251,114,153,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-1 rounded-full bg-[#fb7299]" />
                        <h3 className="text-[16px] font-bold text-[#5b2b3b]">
                            近7天{activeItem.label}
                        </h3>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ReactECharts
                        option={chartOptions}
                        style={{ height: '100%', width: '100%' }}
                        opts={{ renderer: 'svg' }} // SVG 渲染更清晰
                    />
                </div>
            </section>
        </div>
    );
}
