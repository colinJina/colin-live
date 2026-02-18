import { useMutation, useQuery } from '@tanstack/react-query';

import { getCheckCode, loginAccount, type LoginAccountRequest } from '../../api/auth';

export const useCheckCode = () => {
    return useQuery({
        queryKey: ['checkCode'],
        queryFn: async () => {
            const response = await getCheckCode();
            return response?.data;
        },
        refetchOnWindowFocus: false,
    });
};

export const useLoginAccount = () => {
    return useMutation({
        mutationKey: ['loginAccount'],
        mutationFn: async (data: LoginAccountRequest) => {
            const response = await loginAccount(data);
            return response?.data;
        },
    });
};
