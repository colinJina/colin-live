import { useQuery } from '@tanstack/react-query';
import {
    getActualTimeStatisticsInfo,
    getWeekStatisticsInfo,
    type StatisticsInfo,
} from '../../api/ucenter';

export const useActualTimeStatisticsInfo = () => {
    return useQuery({
        queryKey: ['ucenter', 'getActualTimeStatisticsInfo'] as const,
        queryFn: async () => {
            const res = await getActualTimeStatisticsInfo();
            return res?.data ?? { preDayData: {}, totalCountInfo: {} };
        },
        refetchOnWindowFocus: false,
    });
};

export const useWeekStatisticsInfo = (dataType: number | undefined, enabled: boolean) => {
    return useQuery({
        queryKey: ['ucenter', 'getWeekStatisticsInfo', { dataType }] as const,
        enabled: enabled && typeof dataType === 'number',
        queryFn: async () => {
            const res = await getWeekStatisticsInfo({ dataType });
            return (res?.data ?? []) as StatisticsInfo[];
        },
        refetchOnWindowFocus: false,
    });
};
