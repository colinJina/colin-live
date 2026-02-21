import { useQuery } from '@tanstack/react-query';

import { loadAllCategory } from '../../api/category';

export const useAllCategory = () => {
    return useQuery({
        queryKey: ['allCategory'],
        queryFn: async () => {
            const response = await loadAllCategory();
            return response?.data ?? [];
        },
        refetchOnWindowFocus: false,
    });
};
