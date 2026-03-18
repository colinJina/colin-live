import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    cancelFocusUser,
    focusUser,
    getUserInfo,
    updateUserInfo,
    type UpdateUserInfoParams,
} from '../../api/uhome';
import { doAction } from '../../api/video';
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
            // 由于这里没有 userId 入参，直接刷新所有 AuthorInfo（更稳妥）
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
