import { type InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
    loadRecommendVideo,
    loadVideo,
    type PaginationResultVO,
    type VideoInfo,
} from '../../api/video';

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
