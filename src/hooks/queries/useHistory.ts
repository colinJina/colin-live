import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { loadHistory } from '../../api/history';

export function useHistory() {
    const query = useInfiniteQuery({
        queryKey: ['history', 'list'],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const res = await loadHistory({ pageNo: Number(pageParam) }, { showError: false });
            if (res?.code === 200 && res.data) {
                return res.data;
            }
            return {
                list: [],
                pageTotal: 0,
                totalCount: 0,
                pageNo: Number(pageParam),
                pageSize: 20,
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

    const list = useMemo(() => {
        if (!query.data) return [];
        return query.data.pages.flatMap((page) => page.list ?? []);
    }, [query.data]);

    const totalCount = query.data?.pages[0]?.totalCount ?? 0;
    return {
        list,
        totalCount,
        isLoading: query.isLoading,
        isFetchingNextPage: query.isFetchingNextPage,
        hasMore: query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        refresh: query.refetch,
    };
}
