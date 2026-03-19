import {
    type InfiniteData,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    cancelFocusUser,
    focusUser,
    getUserInfo,
    loadUhomeVideoList,
    loadUserCollection,
    updateUserInfo,
    type UpdateUserInfoParams,
    type LoadUserCollectionParams,
    type UserCollectionActionVO,
} from '../../api/uhome';
import type { LoadUhomeVideoListParams } from '../../api/uhome';
import { doAction } from '../../api/video';
import type { PaginationResultVO, VideoInfo } from '../../api/video';
import { toast } from '../../pages/header/message';

export const useGetAuthorInfo = (userId: string) => {
    return useQuery({
        queryKey: ['AuthorInfo', userId],
        queryFn: async () => {
            const response = await getUserInfo(userId);
            return response?.data;
        },
        enabled: !!userId,
    });
};

export const useFocusUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => focusUser(userId),
        onSuccess: (_data, userId) => {
            queryClient.invalidateQueries({
                queryKey: ['AuthorInfo', userId],
            });
            queryClient.invalidateQueries({
                queryKey: ['videoInfo'],
            });
        },
    });
};

export const useCancelFocusUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['cancelFocusUser'],
        mutationFn: async (focusUserId: string) => {
            const response = await cancelFocusUser(focusUserId);
            return response;
        },
        onSuccess: (_data, focusUserId) => {
            queryClient.invalidateQueries({
                queryKey: ['AuthorInfo', focusUserId],
            });
        },
    });
};

export const useUpdateUserInfo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['updateUserInfo'],
        mutationFn: async (params: UpdateUserInfoParams) => {
            const response = await updateUserInfo(params);
            return response;
        },
        onSuccess: () => {
            toast.success('更新成功');
            queryClient.invalidateQueries({
                queryKey: ['AuthorInfo'],
            });
        },
        onError: (error: any) => {
            toast.error(error?.msg || error?.message || '更新失败，请稍后重试');
        },
    });
};

export const useVideoActionMutation = (videoId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: doAction,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['video', 'getVideoInfo', videoId] });
            queryClient.invalidateQueries({ queryKey: ['videoInfo', videoId] });
            const actionMap: Record<number, string> = {
                2: '操作成功', // 点赞/取消点赞
                3: '收藏成功',
                4: '投币成功',
            };

            if (variables.actionType === 4) {
                toast.success(actionMap[4]);
            } else if (variables.actionType === 3) {
                toast.success('操作成功');
            }
        },
        onError: (error: any) => {
            toast.error(error.message || '操作失败，请稍后重试');
        },
    });
};

type UseLoadUhomeVideoListArgs = {
    enabled: boolean;
    userId?: string;
    type?: number;
    pageNo?: number;
    videoNameFuzzy?: string;
    orderType?: number;
};

export const useLoadUhomeVideoList = ({
    enabled,
    userId,
    videoNameFuzzy,
    orderType,
}: UseLoadUhomeVideoListArgs) => {
    return useInfiniteQuery<
        PaginationResultVO<VideoInfo>,
        unknown,
        InfiniteData<PaginationResultVO<VideoInfo>>,
        readonly ['uhome', 'loadVideoList', LoadUhomeVideoListParams],
        number
    >({
        queryKey: [
            'uhome',
            'loadVideoList',
            {
                userId: userId ?? '',
                pageNo: undefined,
                videoName: videoNameFuzzy,
                orderType,
            },
        ],
        enabled,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const params: LoadUhomeVideoListParams = {
                userId: userId ?? '',
                pageNo: Number(pageParam),
                videoName: videoNameFuzzy,
                orderType,
            };
            const response = await loadUhomeVideoList(params);
            return (
                response?.data ?? {
                    totalCount: 0,
                    pageSize: 10,
                    pageNo: Number(pageParam),
                    pageTotal: 0,
                    list: [],
                }
            );
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            if (!lastPage.pageTotal) return undefined;
            if (lastPage.pageNo >= lastPage.pageTotal) return undefined;
            return lastPage.pageNo + 1;
        },
        refetchOnWindowFocus: false,
    });
};

export const useLoadUserCollection = ({
    enabled,
    userId,
}: {
    enabled: boolean;
    userId?: string;
}) => {
    return useInfiniteQuery<
        PaginationResultVO<VideoInfo>,
        unknown,
        InfiniteData<PaginationResultVO<VideoInfo>>,
        readonly ['uhome', 'loadUserCollection', LoadUserCollectionParams],
        number
    >({
        queryKey: [
            'uhome',
            'loadUserCollection',
            {
                userId: userId ?? '',
                pageNo: undefined,
            },
        ],
        enabled,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const params: LoadUserCollectionParams = {
                userId: userId ?? '',
                pageNo: Number(pageParam),
            };
            const response = await loadUserCollection(params);
            const apiData = response?.data;
            return {
                totalCount: apiData?.totalCount ?? 0,
                pageSize: apiData?.pageSize ?? 15,
                pageNo: apiData?.pageNo ?? Number(pageParam),
                pageTotal: apiData?.pageTotal ?? 0,
                list: (apiData?.list ?? []).map((item: UserCollectionActionVO) => ({
                    videoId: item.videoId ?? '',
                    videoCover: item.videoCover,
                    videoName: item.videoName,
                    // 集合列表返回 actionTime，用于 VideoCard 底部时间展示
                    createTime: item.actionTime,
                    // videoUserId 不参与当前列表展示，但保留给后续交互使用
                    userId: item.videoUserId,
                })),
            };
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            if (!lastPage.pageTotal) return undefined;
            if (lastPage.pageNo >= lastPage.pageTotal) return undefined;
            return lastPage.pageNo + 1;
        },
        refetchOnWindowFocus: false,
    });
};
