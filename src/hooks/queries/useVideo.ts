import { type InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
    getVideoInfo,
    loadDanmu,
    loadRecommendVideo,
    loadVideo,
    loadVideoPList,
    type PaginationResultVO,
    type VideoDanmu,
    type VideoInfo,
    type VideoInfoFile,
} from '../../api/video';
import { useUserStore } from '../../stores/useUserStore';

type UseLoadVideoArgs = {
    pCategoryId?: number;
    categoryId?: number;
    enabled: boolean;
};

export const useLoadVideoByCategory = ({ pCategoryId, categoryId, enabled }: UseLoadVideoArgs) => {
    return useInfiniteQuery<
        PaginationResultVO<VideoInfo>,
        unknown,
        InfiniteData<PaginationResultVO<VideoInfo>>,
        readonly ['video', 'loadVideo', { pCategoryId?: number; categoryId?: number }],
        number
    >({
        queryKey: ['video', 'loadVideo', { pCategoryId, categoryId }],
        enabled,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const response = await loadVideo({
                pCategoryId,
                categoryId,
                pageNo: Number(pageParam),
            });
            return (
                response?.data ?? {
                    totalCount: 0,
                    pageSize: 20,
                    pageNo: Number(pageParam),
                    pageTotal: 0,
                    list: [],
                }
            );
        },
        getNextPageParam: (lastPage: PaginationResultVO<VideoInfo>) => {
            if (!lastPage.pageTotal) return undefined;
            if (lastPage.pageNo >= lastPage.pageTotal) return undefined;
            return lastPage.pageNo + 1;
        },
        refetchOnWindowFocus: false,
    });
};

export const useLoadRecommendVideo = () => {
    return useQuery<VideoInfo[]>({
        queryKey: ['video', 'loadRecommendVideo'],
        queryFn: async () => {
            const response = await loadRecommendVideo();
            return response?.data ?? [];
        },
        refetchOnWindowFocus: false,
    });
};

export const useVideoInfo = (videoId: string) => {
    return useQuery({
        queryKey: ['videoInfo', videoId],
        queryFn: async () => {
            const response = await getVideoInfo(videoId);
            return response?.data;
        },
        enabled: !!videoId,
    });
};

export const useVideoPlaylist = (videoId: string) => {
    return useQuery<VideoInfoFile[]>({
        queryKey: ['video', 'loadVideoPList', videoId],
        enabled: Boolean(videoId),
        queryFn: async () => {
            if (!videoId) return [];
            const response = await loadVideoPList(videoId);
            return response?.data ?? [];
        },
        refetchOnWindowFocus: false,
    });
};

export type DanmuQueryData = VideoDanmu[] | { list?: VideoDanmu[] } | null;

export const useVideoDanmu = (videoId?: string, fileId?: string) => {
    const userInfo = useUserStore((state) => state.userInfo);

    return useQuery<DanmuQueryData>({
        queryKey: ['video', 'loadDanmu', videoId, fileId, userInfo?.userId ?? 'guest'],
        enabled: Boolean(videoId && fileId && userInfo),
        queryFn: async () => {
            if (!videoId || !fileId || !userInfo) return null;
            const response = await loadDanmu(fileId, videoId);
            return response?.data ?? null;
        },
        refetchOnWindowFocus: false,
    });
};
