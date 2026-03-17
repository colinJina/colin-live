import request from './request';
import type { ResponseVO } from './video';

export type ActualTimeStatisticsInfo = {
    /** key 为 dataType（数字在 JSON 里会变成字符串） */
    preDayData: Record<string, number>;
    /** 各累计统计 */
    totalCountInfo: Record<
        | 'playCount'
        | 'danmuCount'
        | 'userCount'
        | 'collectCount'
        | 'likeCount'
        | 'commentCount'
        | 'coinCount'
        | string,
        number
    >;
};

export type StatisticsInfo = {
    statisticsDate: string; // YYYY-MM-DD
    statisticsCount: number;
    userId?: string | null;
    dataType?: number | null;
};

export const getActualTimeStatisticsInfo =
    (): Promise<ResponseVO<ActualTimeStatisticsInfo> | null> => {
        return request<ActualTimeStatisticsInfo>({
            url: '/ucenter/getActualTimeStatisticsInfo',
            method: 'GET',
        }) as Promise<ResponseVO<ActualTimeStatisticsInfo> | null>;
    };

export const getWeekStatisticsInfo = (params?: {
    dataType?: number;
}): Promise<ResponseVO<StatisticsInfo[]> | null> => {
    return request<StatisticsInfo[]>({
        url: '/ucenter/getWeekStatisticsInfo',
        method: 'GET',
        params,
    }) as Promise<ResponseVO<StatisticsInfo[]> | null>;
};
