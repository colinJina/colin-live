import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelFocusUser, focusUser, getUserInfo } from '../../api/uhome';

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
