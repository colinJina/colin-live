import {
    type InfiniteData,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    doAction,
    getVideoInfo,
    loadCommentApi,
    loadDanmu,
    loadRecommendVideo,
    loadVideo,
    loadVideoPList,
    postCommentApi,
    uploadImageApi,
    type ApiComment,
    type ApiCommentResponseData,
    type ApiUserAction,
    type CommentData,
    type DoActionParams,
    type PaginationResultVO,
    type PostCommentParams,
    type VideoDanmu,
    type VideoInfo,
    type VideoInfoFile,
} from '../../api/video';
import { useUserStore } from '../../stores/useUserStore';
import { useMemo, useState } from 'react';
import { toast } from '../../pages/header/message';
import defaultAvatar from '@/assets/icon/user.svg';

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

const adaptCommentData = (apiComment: ApiComment, userActions: ApiUserAction[]): CommentData => {
    const isLiked = userActions.some(
        (action) => action.commentId === apiComment.commentId && action.actionType === 0,
    );
    const images = apiComment.imgPath ? apiComment.imgPath.split(',').filter(Boolean) : [];
    let replyTo;
    if (apiComment.replyUserId && apiComment.replyNickName) {
        replyTo = {
            userId: apiComment.replyUserId,
            nickName: apiComment.replyNickName,
            avatar: apiComment.replyAvatar || defaultAvatar,
        };
    }

    return {
        commentId: String(apiComment.commentId),
        user: {
            userId: apiComment.userId,
            nickName: apiComment.nickName,
            avatar: apiComment.avatar || defaultAvatar,
        },
        content: apiComment.content,
        time: apiComment.postTime,
        likes: apiComment.likeCount,
        isLiked,
        images,
        replyTo,
        replies: apiComment.children?.map((child) => adaptCommentData(child, userActions)) || [],
    };
};

export const useComments = (videoId: string, initialOrderType: number = 0) => {
    const [orderType, setOrderType] = useState<number>(initialOrderType);
    const query = useInfiniteQuery({
        queryKey: ['comments', 'loadComment', { videoId, orderType }],
        enabled: !!videoId,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const response = await loadCommentApi({
                videoId,
                orderType,
                pageNo: Number(pageParam),
            });

            return (
                response?.data ?? {
                    commentData: {
                        totalCount: 0,
                        pageSize: 20,
                        pageNo: Number(pageParam),
                        pageTotal: 0,
                        list: [],
                    },
                    userActionList: [],
                }
            );
        },
        getNextPageParam: (lastPage: ApiCommentResponseData) => {
            const { commentData } = lastPage;
            if (!commentData.pageTotal) return undefined;
            if (commentData.pageNo >= commentData.pageTotal) return undefined;
            return commentData.pageNo + 1;
        },
        refetchOnWindowFocus: false,
    });

    const comments = useMemo(() => {
        if (!query.data) return [];
        return query.data.pages.flatMap((page) =>
            page.commentData.list.map((item) => adaptCommentData(item, page.userActionList)),
        );
    }, [query.data]);

    const totalCount = query.data?.pages[0]?.commentData.totalCount || 0;

    return {
        comments,
        totalCount,
        isLoading: query.isLoading,
        isFetchingNextPage: query.isFetchingNextPage,
        hasMore: query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        orderType,
        setOrderType,
    };
};

export const usePostComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: PostCommentParams) => postCommentApi(params),
        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['comments', 'loadComment', { videoId: variables.videoId }],
            });
            toast.success('发表成功');
        },
        onError: () => {},
    });
};

export const useUploadImage = () => {
    return useMutation({
        mutationFn: async (file: File): Promise<string> => {
            const response = await uploadImageApi(file);
            return response?.data ?? '';
        },
        onError: (error: any) => {
            toast.error(error?.message || '图片上传失败，请重试');
        },
    });
};

export const useDoAction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: DoActionParams) => doAction(params),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['comments', 'loadComment', { videoId: variables.videoId }],
            });
        },
        onError: () => {
            toast.error('操作失败，请重试');
        },
    });
};
