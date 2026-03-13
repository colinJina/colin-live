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
import VideoCommentSection from './components/video-comment-section';

type DanmuSendMode = 1 | 4 | 5;
type DanmukuPlugin = {
    emit?: (payload: { text?: string; color?: string; border: boolean; mode: number }) => void;
    show?: () => void;
    hide?: () => void;
};
type ArtPlayerWithHls = Artplayer & { hls?: Hls };

const DANMU_MODE_OPTIONS: Array<{ label: string; value: DanmuSendMode }> = [
    { label: '\u6eda\u52a8', value: 1 },
    { label: '\u5e95\u90e8', value: 4 },
    { label: '\u9876\u90e8', value: 5 },
];

const DANMU_COLOR_OPTIONS = [
    { label: '\u767d\u8272', value: '#ffffff' },
    { label: '\u84dd\u8272', value: '#7dd3fc' },
    { label: '\u7eff\u8272', value: '#86efac' },
    { label: '\u7c89\u8272', value: '#f9a8d4' },
    { label: '\u6a59\u8272', value: '#fdba74' },
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
            nickName: baseVideoInfo?.nickName || 'UP\u4e3b',
            avatar: baseVideoInfo?.avatar || '',
            introduction:
                baseVideoInfo?.introduction ||
                '\u8fd9\u4e2a\u4f5c\u8005\u8fd8\u6ca1\u6709\u586b\u5199\u7b80\u4ecb\u3002',
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
                throw new Error('\u53d1\u9001\u5931\u8d25');
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
                nickName: '\u6211',
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
            message.success('\u5f39\u5e55\u5df2\u53d1\u9001');
        },
        onError: () => {
            message.error('\u53d1\u9001\u5f39\u5e55\u5931\u8d25');
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
                        art.notice.show =
                            '\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u8be5\u64ad\u653e\u5668';
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
                    html: '<span class="text-sm">\u5bbd\u5c4f\u6a21\u5f0f</span>',
                    tooltip: '\u5bbd\u5c4f\u6a21\u5f0f',
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
            message.warning('\u8bf7\u8f93\u5165\u5f39\u5e55\u5185\u5bb9');
            return;
        }

        if (text.length > 200) {
            message.warning('\u5f39\u5e55\u4e0d\u80fd\u8d85\u8fc7 200 \u4e2a\u5b57\u7b26');
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
                    <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,249,252,0.98)_0%,rgba(255,238,245,0.98)_55%,rgba(255,230,240,0.98)_100%)] shadow-[0_22px_52px_rgba(251,114,153,0.14)] ring-1 ring-[#ffdbe6]/70">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute left-[-32px] top-[-36px] h-28 w-28 rounded-full bg-white/55 blur-2xl" />
                            <div className="absolute right-[8%] top-4 h-20 w-20 rounded-full bg-[#ffb3ca]/25 blur-2xl" />
                            <div className="absolute bottom-[-22px] left-[22%] h-16 w-44 rounded-full bg-white/40 blur-2xl" />
                        </div>

                        <div className="relative aspect-video w-full overflow-hidden rounded-t-[30px] bg-[#2f0f1b]">
                            <div ref={playerRef} className="absolute inset-0 h-full w-full" />
                        </div>

                        <div className="relative border-t border-white/65 bg-white/52 px-5 py-4 backdrop-blur-md">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="inline-flex rounded-full border border-[#ffd4e2] bg-white/72 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#dd6a90]">
                                    DANMU PANEL
                                </div>
                                <div className="rounded-full border border-[#ffe0ea] bg-white/68 px-3 py-1 text-[11px] font-medium text-[#b17189]">
                                    Flat Pink Player
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center whitespace-nowrap rounded-full border border-[#ffe1ea] bg-white/70 px-4 py-2 text-sm text-[#9b667c] shadow-[0_10px_24px_rgba(251,114,153,0.08)]">
                                    <span>
                                        {danmuList.length} {'\u4eba\u6b63\u5728\u770b'}
                                    </span>
                                    <span className="mx-2 text-[#e4a1b8]">{'\u2022'}</span>
                                    <span>
                                        {'\u5df2\u88c5\u586b'} {danmuList.length}{' '}
                                        {'\u6761\u5f39\u5e55'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 rounded-full border border-[#ffe1ea] bg-white/70 px-4 py-2 text-xs text-[#9b667c] shadow-[0_10px_24px_rgba(251,114,153,0.08)]">
                                    <Switch
                                        checked={showDanmu}
                                        onChange={setShowDanmu}
                                        size="small"
                                    />
                                    <span>
                                        {showDanmu ? '\u5f39\u5e55\u5f00' : '\u5f39\u5e55\u5173'}
                                    </span>
                                </div>

                                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[22px] border border-[#ffdce7] bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(255,243,248,0.88)_100%)] px-3 py-2 shadow-[0_12px_26px_rgba(251,114,153,0.08)] focus-within:border-[#ffb6cc] focus-within:ring-2 focus-within:ring-[#fb7299]/10">
                                    <Select
                                        variant="borderless"
                                        value={danmuMode}
                                        onChange={(value) => setDanmuMode(value as DanmuSendMode)}
                                        options={DANMU_MODE_OPTIONS}
                                        className="-ml-1 w-[76px] text-xs"
                                        popupMatchSelectWidth={false}
                                    />
                                    <Select
                                        variant="borderless"
                                        value={danmuColor}
                                        onChange={setDanmuColor}
                                        options={DANMU_COLOR_OPTIONS}
                                        className="w-[84px] text-xs"
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
                                        placeholder={
                                            '\u53d1\u4e2a\u53cb\u5584\u7684\u5f39\u5e55\u8bc1\u660e\u5230\u6b64\u4e00\u6e38'
                                        }
                                        className="min-w-0 flex-1 bg-transparent text-sm !text-[#6f3f55] !shadow-none placeholder:!text-[#c290a5]"
                                    />
                                    <Button
                                        type="primary"
                                        loading={postDanmuMutation.isPending}
                                        onClick={handleSendDanmu}
                                        size="small"
                                        className="h-9! rounded-full! border-none! bg-[linear-gradient(180deg,#ff8fb3_0%,#fb7299_100%)] px-5! font-medium! text-white! shadow-[0_10px_24px_rgba(251,114,153,0.2)] hover:!bg-[linear-gradient(180deg,#ff9abd_0%,#fc7ea3_100%)]"
                                    >
                                        {'\u53d1\u9001'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {videoInfoData && (
                            <UserActionPanel
                                videoId={videoId ?? ''}
                                videoInfo={videoInfoData?.videoInfo}
                                userActionList={videoInfoData?.userActionList}
                            />
                        )}
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
                <VideoCommentSection videoId={videoId} />
            </section>
        </main>
    );
}
