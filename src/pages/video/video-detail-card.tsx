import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Select, Switch, message } from 'antd';
import Artplayer from 'artplayer';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import Hls from 'hls.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { loadDanmu, postDanmu, type PostDanmuParams, type VideoDanmu } from '../../api/video';
import { useGetAuthorInfo } from '../../hooks/queries/useUhome';
import {
    useVideoDanmu,
    useVideoInfo,
    useVideoPlaylist,
    type DanmuQueryData,
} from '../../hooks/queries/useVideo';
import { useLoginModal } from '../../provider/login-modal-provider';
import { useUserStore } from '../../stores/useUserStore';

import UserActionPanel from './components/user-action-panel';
import { VideoAuthorCard } from './components/video-author-card';
import { VideoDanmuList } from './components/video-danmu-list';
import { VideoPlaylistPanel } from './components/video-playlist-panel';
import { VideoSummaryCard } from './components/video-summary-card';

type DanmuSendMode = 1 | 4 | 5;
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

const getDanmuModeForArtplayer = (mode: number | string) => {
    if (mode === 4 || mode === '4' || mode === 'bottom') return 1;
    if (mode === 5 || mode === '5' || mode === 'top') return 2;
    return 0;
};

export default function VideoDetailCard() {
    const navigate = useNavigate();
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
    const { openLoginModal } = useLoginModal();
    const { data: videoInfoData } = useVideoInfo(videoId ?? '');
    const baseVideoInfo = videoInfoData?.videoInfo;
    const authorUserId = baseVideoInfo?.userId ?? '';
    const { data: authorInfo } = useGetAuthorInfo(authorUserId);
    const { data: videoList = [], isLoading: isVideoListLoading } = useVideoPlaylist(videoId ?? '');
    const userInfo = useUserStore((state) => state.userInfo);
    const authorProfile = useMemo(() => {
        const fallback = {
            userId: authorUserId || '',
            nickName: baseVideoInfo?.nickName || 'UP主',
            avatar: baseVideoInfo?.avatar || '',
            introduction: baseVideoInfo?.introduction || '这个作者还没有填写简介。',
            fansCount: 0,
            focusCount: 0,
            haveFocus: false,
        };

        if (!authorInfo) return fallback;

        return {
            userId: authorInfo.userId,
            nickName: authorInfo.nickName ?? fallback.nickName,
            avatar: authorInfo.avatar ?? fallback.avatar,
            introduction: authorInfo.personIntroduction || fallback.introduction,
            fansCount: authorInfo.fansCount ?? 0,
            focusCount: authorInfo.focusCount ?? 0,
            haveFocus: authorInfo.haveFocus ?? false,
        };
    }, [authorInfo, authorUserId, baseVideoInfo]);
    const currentP = useMemo(
        () => getValidP(searchParams.get('p'), videoList.length),
        [searchParams, videoList.length],
    );

    const currentVideo = useMemo(
        () => videoList[currentP - 1] ?? videoList[0] ?? null,
        [videoList, currentP],
    );

    const currentFileId = currentVideo?.fileId;

    const { data: danmuData, isLoading: isDanmuLoading } = useVideoDanmu(videoId, currentFileId);

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
                ['video', 'loadDanmu', videoId, currentFileId, userInfo?.userId ?? 'guest'],
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

            if (playerInstance.current && showDanmu) {
                const plugin = playerInstance.current.plugins.artplayerPluginDanmuku as
                    | DanmukuPlugin
                    | undefined;
                if (plugin?.emit) {
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
            theme: '#fb7299',
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
                    emitter: false,
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

    useEffect(() => {
        if (!playerInstance.current) return;
        const plugin = playerInstance.current.plugins.artplayerPluginDanmuku as
            | DanmukuPlugin
            | undefined;
        if (!plugin) return;
        if (showDanmu) {
            plugin.show?.();
        } else {
            plugin.hide?.();
        }
    }, [showDanmu]);

    const handleSendDanmu = useCallback(() => {
        if (!videoId || !currentVideo?.fileId || !playerInstance.current) return;
        if (!userInfo) {
            openLoginModal();
            return;
        }
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
    }, [
        currentVideo,
        danmuColor,
        danmuMode,
        danmuText,
        openLoginModal,
        userInfo,
        postDanmuMutation,
        videoId,
    ]);

    return (
        <main className="mx-auto w-full max-w-[1380px] px-4 py-6">
            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="min-w-0 flex flex-col gap-4">
                    <VideoSummaryCard
                        videoInfo={videoInfoData?.videoInfo}
                        currentP={currentP}
                        currentVideo={currentVideo}
                        videoId={videoId}
                    />
                    <div className="overflow-hidden rounded-[16px] border border-[#e9edf5] bg-white shadow-sm">
                        <div className="relative aspect-video w-full bg-black">
                            <div ref={playerRef} className="absolute inset-0 h-full w-full" />
                        </div>
                        <div className="flex items-center gap-4 px-5 py-3 ">
                            <div className="flex items-center whitespace-nowrap text-sm text-gray-500">
                                <span>{danmuList.length} 人正在看</span>
                                <span className="mx-2">·</span>
                                <span>已装填 {danmuList.length} 条弹幕</span>
                            </div>

                            <div className="flex items-center gap-2 border-l border-[#eef2f7] pl-4">
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
                                    className="-ml-2 w-[70px] text-xs"
                                    popupMatchSelectWidth={false}
                                />
                                <Select
                                    variant="borderless"
                                    value={danmuColor}
                                    onChange={setDanmuColor}
                                    options={DANMU_COLOR_OPTIONS}
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
                                    className="min-w-0 flex-1 bg-transparent text-sm !shadow-none"
                                />
                                <Button
                                    type="primary"
                                    loading={postDanmuMutation.isPending}
                                    onClick={handleSendDanmu}
                                    size="small"
                                    className="rounded-full border-none bg-[#fb7299] px-4 hover:!bg-[#fc8bab]"
                                >
                                    发送
                                </Button>
                            </div>
                        </div>
                        <UserActionPanel />
                    </div>
                </div>

                <aside className="flex min-h-0 flex-col gap-4">
                    <VideoAuthorCard
                        authorProfile={authorProfile}
                        onVisitHome={() => {
                            if (authorProfile.userId) {
                                navigate(`/uhome/${encodeURIComponent(authorProfile.userId)}`);
                            }
                        }}
                    />
                    <VideoDanmuList
                        danmuList={sortedDanmuList}
                        isLoading={isDanmuLoading}
                        formatDanmuTime={formatDanmuTime}
                        getDanmuTime={getDanmuTime}
                        normalizeDanmuText={normalizeDanmuText}
                    />
                    <VideoPlaylistPanel
                        autoPlayNext={autoPlayNext}
                        currentP={currentP}
                        isLoading={isVideoListLoading}
                        videoList={videoList}
                        onSelectVideo={selectVideo}
                        onToggleAutoPlayNext={setAutoPlayNext}
                    />
                </aside>
                <div></div>
            </section>
        </main>
    );
}
