import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelFocusUser, focusUser, getUserInfo } from '../../api/uhome';
import { doAction } from '../../api/video';
import { message } from 'antd';

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
                message.success(actionMap[4]);
            } else if (variables.actionType === 3) {
                message.success('操作成功');
            }
        },
        onError: (error: any) => {
            message.error(error.message || '操作失败，请稍后重试');
        },
    });
};
