import ReactECharts from 'echarts-for-react';

export default function UcenterHome() {
    const videoStats = [
        { label: '粉丝', value: 0, active: true, icon: '👥' },
        { label: '播放', value: 0, active: false, icon: '▶️' },
        { label: '评论', value: 0, active: false, icon: '💬' },
        { label: '弹幕', value: 0, active: false, icon: '📺' },
        { label: '点赞', value: 0, active: false, icon: '👍' },
        { label: '收藏', value: 0, active: false, icon: '⭐' },
        { label: '投币', value: 0, active: false, icon: '🪙' },
    ];

    const chartOptions = {
        grid: { top: '15%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['03-08', '03-09', '03-10', '03-11', '03-12', '03-13', '03-14'],
            axisLine: { lineStyle: { color: '#e5e7eb' } },
            axisLabel: { color: '#9b6a7c' },
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
            axisLabel: {
                formatter: '{value} °C',
                color: '#9b6a7c',
            },
        },
        tooltip: { trigger: 'axis' },
        series: [
            {
                name: '粉丝',
                data: [0.2, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7],
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

    return (
        <div className="space-y-6">
            {/* --- 上半部分：视频数据卡片 --- */}
            <section className="rounded-[28px] border border-white/70 bg-white/60 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.04)] backdrop-blur-md">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-[16px] font-bold text-[#5b2b3b]">视频数据</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {videoStats.map((item, idx) => (
                        <div
                            key={item.label}
                            className={`relative overflow-hidden rounded-[20px] p-5 transition-all hover:scale-[1.02] ${
                                item.active
                                    ? 'bg-[linear-gradient(135deg,#ff5c93_0%,#fb7299_100%)] text-white shadow-[0_12px_24px_rgba(251,114,153,0.3)]'
                                    : 'bg-[#f0faff] text-[#00aeec] border border-[#e0f2fe]'
                            }`}
                        >
                            <div className="flex items-center gap-2 opacity-90">
                                <span className="text-sm font-medium">{item.label}</span>
                                <span className="ml-auto text-xs font-bold opacity-60">0</span>
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
                        <h3 className="text-[16px] font-bold text-[#5b2b3b]">近7天粉丝量</h3>
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
