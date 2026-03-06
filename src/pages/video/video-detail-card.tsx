import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Select, Switch, message } from 'antd';
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import Hls from 'hls.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import {
    loadDanmu,
    loadVideoPList,
    postDanmu,
    type PostDanmuParams,
    type VideoDanmu,
    type VideoInfoFile,
} from '../../api/video';
import { cn, formatDuration } from '../../utils';

type DanmuSendMode = 1 | 4 | 5;
type DanmuQueryData = VideoDanmu[] | { list?: VideoDanmu[] } | null;
type DanmukuPlugin = {
    emit?: (payload: { text?: string; color?: string; border: boolean; mode: number }) => void;
    show?: () => void;
    hide?: () => void;
};
type ArtPlayerWithHls = Artplayer & { hls?: Hls };

const DANMU_MODE_OPTIONS: Array<{ label: string; value: DanmuSendMode }> = [
    { label: '滚动', value: 1 },
    { label: '底部', value: 4 },
    { label: '顶部', value: 5 },
];

const DANMU_COLOR_OPTIONS = [
    { label: '白色', value: '#ffffff' },
    { label: '蓝色', value: '#7dd3fc' },
    { label: '绿色', value: '#86efac' },
    { label: '粉色', value: '#f9a8d4' },
    { label: '橙色', value: '#fdba74' },
];

const getValidP = (value: string | null, total: number) => {
    const parsed = Number.parseInt(value ?? '1', 10);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    if (total > 0) return Math.min(parsed, total);
    return parsed;
};

const normalizeDanmuText = (item: VideoDanmu) => item.text?.trim() || item.content?.trim() || '';

const getDanmuTime = (item: VideoDanmu) => {
    const rawTime = item.time ?? item.videoTime ?? item.showTime ?? 0;
    const parsed = Number(rawTime);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return parsed;
};

const formatDanmuTime = (value: number) => {
    const seconds = Math.max(0, Math.floor(value));
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
};

export default function VideoDetailCard() {
    const { videoId } = useParams<{ videoId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [autoPlayNext, setAutoPlayNext] = useState(true);
    const [showDanmu, setShowDanmu] = useState(true);
    const [danmuText, setDanmuText] = useState('');
    const [danmuMode, setDanmuMode] = useState<DanmuSendMode>(1);
    const [danmuColor, setDanmuColor] = useState('#ffffff');
    const playerRef = useRef<HTMLDivElement | null>(null);
    const playerInstance = useRef<Artplayer | null>(null);
    const optimisticDanmuIdRef = useRef(0);
    const queryClient = useQueryClient();

    const { data: videoList = [], isLoading } = useQuery<VideoInfoFile[]>({
        queryKey: ['video', 'loadVideoPList', videoId],
        enabled: Boolean(videoId),
        queryFn: async () => {
            if (!videoId) return [];
            const response = await loadVideoPList(videoId);
            return response?.data ?? [];
        },
        refetchOnWindowFocus: false,
    });

    const currentP = useMemo(
        () => getValidP(searchParams.get('p'), videoList.length),
        [searchParams, videoList.length],
    );

    const currentVideo = useMemo(
        () => videoList[currentP - 1] ?? videoList[0] ?? null,
        [videoList, currentP],
    );

    const currentFileId = currentVideo?.fileId;

    const { data: danmuData, isLoading: isDanmuLoading } = useQuery({
        queryKey: ['video', 'loadDanmu', videoId, currentFileId],
        enabled: Boolean(videoId && currentFileId),
        queryFn: async () => {
            if (!videoId || !currentFileId) return null;
            const response = await loadDanmu(currentFileId, videoId);
            return response?.data ?? null;
        },
        refetchOnWindowFocus: false,
    });

    const danmuList = useMemo(() => {
        if (Array.isArray(danmuData)) return danmuData;
        return danmuData?.list ?? [];
    }, [danmuData]);

    const sortedDanmuList = useMemo(
        () =>
            [...danmuList].sort((a, b) => {
                return getDanmuTime(a) - getDanmuTime(b);
            }),
        [danmuList],
    );

    const selectVideo = useCallback(
        (index: number) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('p', String(index));
                    return next;
                },
                { replace: false },
            );
        },
        [setSearchParams],
    );

    useEffect(() => {
        if (!videoList.length) return;
        const nextP = getValidP(searchParams.get('p'), videoList.length);
        if (searchParams.get('p') !== String(nextP)) {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('p', String(nextP));
                    return next;
                },
                { replace: true },
            );
        }
    }, [searchParams, setSearchParams, videoList.length]);

    const postDanmuMutation = useMutation({
        mutationFn: async (params: PostDanmuParams) => {
            const response = await postDanmu(params);
            if (!response) {
                throw new Error('发送失败');
            }
            return params;
        },
        onSuccess: (params) => {
            const optimisticItem: VideoDanmu = {
                danmuId: `local-${videoId ?? 'video'}-${currentFileId ?? 'file'}-${optimisticDanmuIdRef.current++}`,
                text: params.text,
                color: params.color,
                mode: params.mode,
                time: params.time,
                createTime: new Date().toISOString(),
                nickName: '我',
            };

            queryClient.setQueryData(
                ['video', 'loadDanmu', videoId, currentFileId],
                (prev: DanmuQueryData) => {
                    if (!prev) {
                        return [optimisticItem];
                    }
                    if (Array.isArray(prev)) {
                        return [...prev, optimisticItem];
                    }
                    return {
                        ...prev,
                        list: [...(prev.list ?? []), optimisticItem],
                    };
                },
            );

            // 让 Artplayer 发射弹幕
            if (playerInstance.current && showDanmu) {
                const plugin = playerInstance.current.plugins.artplayerPluginDanmuku as
                    | DanmukuPlugin
                    | undefined;
                if (plugin && plugin.emit) {
                    plugin.emit({
                        text: optimisticItem.text,
                        color: optimisticItem.color,
                        border: false,
                        mode: getDanmuModeForArtplayer(optimisticItem.mode ?? 0),
                    });
                }
            }

            setDanmuText('');
            message.success('弹幕已发送');
        },
        onError: () => {
            message.error('发送弹幕失败');
        },
    });

    const getDanmuModeForArtplayer = (mode: number | string) => {
        if (mode === 4 || mode === '4' || mode === 'bottom') return 1; // Artplayer bottom
        if (mode === 5 || mode === '5' || mode === 'top') return 2; // Artplayer top
        return 0; // Artplayer scroll
    };

    // 初始化 Artplayer
    useEffect(() => {
        if (!playerRef.current || !currentFileId) return;

        const m3u8Url = `/api/file/videoResource/${currentFileId}/`;

        Artplayer.CONTEXTMENU = false;
        Artplayer.AUTO_PLAYBACK_MAX = 20;
        Artplayer.AUTO_PLAYBACK_MIN = 10;

        const art = new Artplayer({
            container: playerRef.current,
            url: m3u8Url,
            type: 'm3u8',
            customType: {
                m3u8: function (video, url, art) {
                    if (Hls.isSupported()) {
                        const artWithHls = art as ArtPlayerWithHls;
                        if (artWithHls.hls) artWithHls.hls.destroy();
                        const hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                        artWithHls.hls = hls;
                        art.on('destroy', () => hls.destroy());
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                    } else {
                        art.notice.show = '浏览器不支持该播放器';
                    }
                },
            },
            theme: '#fb7299', // B站粉色主题
            volume: 0.7,
            autoplay: true,
            autoMini: false,
            fullscreen: true,
            fullscreenWeb: true,
            setting: true,
            pip: true,
            playbackRate: true,
            flip: true,
            aspectRatio: true,
            screenshot: true,
            autoPlayback: true,
            plugins: [
                artplayerPluginDanmuku({
                    danmuku: async () => {
                        if (!videoId || !currentFileId) return [];
                        const response = await loadDanmu(currentFileId, videoId);
                        const dataList = Array.isArray(response?.data)
                            ? response.data
                            : response?.data?.list || [];

                        return dataList.map((item: VideoDanmu) => ({
                            text: normalizeDanmuText(item),
                            color: item.color || '#ffffff',
                            mode: getDanmuModeForArtplayer(item.mode ?? 0),
                            time: getDanmuTime(item),
                        }));
                    },
                    theme: 'light',
                    emitter: false, // 自定义发送
                    speed: 5,
                }),
            ],
            controls: [
                {
                    name: 'wide-screen',
                    position: 'right',
                    html: '<span class="text-sm">宽屏模式</span>',
                    tooltip: '宽屏模式',
                    style: { color: '#fff' },
                    click: function () {
                        // 可以根据需要实现宽屏逻辑
                    },
                },
            ],
        });

        art.on('video:ended', () => {
            if (!autoPlayNext || videoList.length <= 1 || currentP >= videoList.length) return;
            selectVideo(currentP + 1);
        });

        playerInstance.current = art;

        return () => {
            if (playerInstance.current) {
                playerInstance.current.destroy(false);
                playerInstance.current = null;
            }
        };
    }, [currentFileId, videoId, autoPlayNext, currentP, selectVideo, videoList.length]);

    // 监听弹幕开关
    useEffect(() => {
        if (!playerInstance.current) return;
        const plugin = playerInstance.current.plugins.artplayerPluginDanmuku as
            | DanmukuPlugin
            | undefined;
        if (!plugin) return;
        if (showDanmu) {
            if (plugin.show) plugin.show();
        } else {
            if (plugin.hide) plugin.hide();
        }
    }, [showDanmu]);

    const handleSendDanmu = useCallback(() => {
        if (!videoId || !currentVideo?.fileId || !playerInstance.current) return;

        const text = danmuText.trim();
        if (!text) {
            message.warning('请输入弹幕内容');
            return;
        }

        if (text.length > 200) {
            message.warning('弹幕不能超过 200 个字符');
            return;
        }

        postDanmuMutation.mutate({
            videoId,
            fileId: currentVideo.fileId,
            text,
            mode: danmuMode,
            color: danmuColor,
            time: Math.floor(playerInstance.current.video.currentTime || 0),
        });
    }, [currentVideo, danmuColor, danmuMode, danmuText, postDanmuMutation, videoId]);

    return (
        <main className="mx-auto w-full max-w-[1380px] px-4 py-6">
            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                {/* 左侧：播放器 + 控制条 */}
                <div className="min-w-0 flex flex-col gap-4">
                    <div className="overflow-hidden rounded-[16px] border border-[#e9edf5] bg-white shadow-sm">
                        <div className="relative bg-black w-full aspect-video">
                            {/* Artplayer 容器 */}
                            <div ref={playerRef} className="absolute inset-0 w-full h-full" />
                        </div>

                        {/* 弹幕发送栏 (类似 Bilibili 底部) */}
                        <div className="flex items-center gap-4 border-t border-[#eef2f7] bg-white px-5 py-3 shadow-sm">
                            <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                                <span>{danmuList.length} 人正在看</span>
                                <span className="mx-2">，</span>
                                <span>已装填 {danmuList.length} 条弹幕</span>
                            </div>

                            <div className="flex items-center gap-2 border-l pl-4 border-[#eef2f7]">
                                <Switch checked={showDanmu} onChange={setShowDanmu} size="small" />
                                <span className="text-xs text-gray-400">
                                    {showDanmu ? '弹幕开' : '弹幕关'}
                                </span>
                            </div>

                            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-1.5 focus-within:ring-1 focus-within:ring-[#fb7299]">
                                <Select
                                    variant="borderless"
                                    value={danmuMode}
                                    onChange={(value) => setDanmuMode(value as DanmuSendMode)}
                                    options={DANMU_MODE_OPTIONS}
                                    className="w-[70px] -ml-2 text-xs"
                                    popupMatchSelectWidth={false}
                                />
                                <Select
                                    variant="borderless"
                                    value={danmuColor}
                                    onChange={setDanmuColor}
                                    options={DANMU_COLOR_OPTIONS.map((item) => ({
                                        label: item.label,
                                        value: item.value,
                                    }))}
                                    className="w-[80px] text-xs"
                                    popupMatchSelectWidth={false}
                                    optionRender={(option) => {
                                        const color = String(option.data.value);
                                        return (
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="inline-block h-3 w-3 rounded-full ring-1 ring-black/10"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <span className="text-xs">
                                                    {String(option.data.label)}
                                                </span>
                                            </div>
                                        );
                                    }}
                                />
                                <Input
                                    variant="borderless"
                                    value={danmuText}
                                    maxLength={200}
                                    onChange={(event) => setDanmuText(event.target.value)}
                                    onPressEnter={handleSendDanmu}
                                    placeholder="发个友善的弹幕见证当下"
                                    className="min-w-0 flex-1 text-sm bg-transparent !shadow-none"
                                />
                                <Button
                                    type="primary"
                                    loading={postDanmuMutation.isPending}
                                    onClick={handleSendDanmu}
                                    size="small"
                                    className="rounded-full bg-[#fb7299] px-4 border-none hover:!bg-[#fc8bab]"
                                >
                                    发送
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 视频信息区域 */}
                    <div className="rounded-[16px] bg-white p-5 shadow-sm border border-[#e9edf5]">
                        <h1 className="text-xl font-medium text-[#18191c] mb-3">
                            {currentVideo
                                ? `${currentP}. ${currentVideo.fileName || currentVideo.title || `P${currentP}`}`
                                : videoId
                                  ? `视频 ${videoId}`
                                  : '视频详情'}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#9499a0]">
                            <span>视频 ID: {videoId ?? '--'}</span>
                            <span>文件 ID: {currentVideo?.fileId ?? '--'}</span>
                            <span>
                                分 P: {videoList.length ? `${currentP}/${videoList.length}` : '--'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 右侧：弹幕列表 + 选集 */}
                <aside className="flex min-h-0 flex-col gap-4">
                    {/* 弹幕列表 */}
                    <section className="flex flex-1 flex-col overflow-hidden rounded-[16px] border border-[#e8edf5] bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#edf1f6] bg-[#fbfbfb] px-4 py-3">
                            <div className="text-[15px] font-medium text-[#18191c]">弹幕列表</div>
                            <span className="text-xs text-[#9499a0]">展开</span>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[300px] px-2 py-2 text-sm bg-[#fcfcfc]">
                            {isDanmuLoading ? (
                                <div className="py-10 text-center text-[#9499a0]">加载中...</div>
                            ) : sortedDanmuList.length > 0 ? (
                                sortedDanmuList.map((item) => {
                                    const text = normalizeDanmuText(item);
                                    return (
                                        <div
                                            key={String(item.danmuId)}
                                            className="group flex items-center justify-between gap-3 px-3 py-1.5 hover:bg-[#f4f5f7] rounded-md transition"
                                        >
                                            <span className="w-12 shrink-0 text-xs text-[#9499a0]">
                                                {formatDanmuTime(getDanmuTime(item))}
                                            </span>
                                            <p
                                                className="min-w-0 flex-1 truncate text-[#18191c]"
                                                title={text}
                                            >
                                                {text || '---'}
                                            </p>
                                            <span className="shrink-0 text-xs text-[#9499a0] opacity-0 group-hover:opacity-100 transition">
                                                {item.createTime
                                                    ? new Date(item.createTime).toLocaleDateString()
                                                    : ''}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-10 text-center text-[#9499a0]">暂无弹幕</div>
                            )}
                        </div>
                    </section>

                    {/* 视频选集 */}
                    <section className="flex flex-col overflow-hidden rounded-[16px] border border-[#e8edf5] bg-[#f6f7f9] shadow-sm">
                        <div className="flex items-center justify-between border-b border-black/5 px-4 py-3 bg-white">
                            <div className="text-[15px] font-medium text-[#18191c]">
                                视频选集
                                <span className="ml-2 text-xs font-normal text-[#9499a0]">
                                    ({videoList.length ? `${currentP}/${videoList.length}` : '0/0'})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#9499a0]">自动连播</span>
                                <Switch
                                    checked={autoPlayNext}
                                    onChange={setAutoPlayNext}
                                    size="small"
                                />
                            </div>
                        </div>

                        <div className="max-h-[300px] space-y-1.5 overflow-y-auto px-3 py-3 bg-white">
                            {isLoading ? (
                                <div className="py-8 text-center text-sm text-[#9499a0]">
                                    加载中...
                                </div>
                            ) : videoList.length > 0 ? (
                                videoList.map((item, index) => {
                                    const active = index === currentP - 1;
                                    return (
                                        <button
                                            key={item.fileId}
                                            type="button"
                                            onClick={() => selectVideo(index + 1)}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition text-sm',
                                                active
                                                    ? 'bg-[#f4f5f7] text-[#fb7299]'
                                                    : 'bg-white hover:bg-[#f4f5f7] text-[#18191c]',
                                            )}
                                        >
                                            <span className="w-5 shrink-0 text-center text-[#9499a0]">
                                                {active ? (
                                                    <span className="text-[#fb7299]">▶</span>
                                                ) : (
                                                    index + 1
                                                )}
                                            </span>
                                            <div
                                                className="min-w-0 flex-1 truncate"
                                                title={item.title || item.fileName}
                                            >
                                                {item.fileName || item.title || `P${index + 1}`}
                                            </div>
                                            <div className="shrink-0 text-xs text-[#9499a0]">
                                                {formatDuration(item.duration)}
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center text-sm text-[#9499a0]">
                                    暂无分集
                                </div>
                            )}
                        </div>
                    </section>
                </aside>
            </section>
        </main>
    );
}
