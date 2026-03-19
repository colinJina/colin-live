import request from './request';
import type { PaginationResultVO, ResponseVO } from './video';

export interface VideoPlayHistory {
    videoId: string;
    videoCover?: string;
    videoName?: string;
    userId?: string;
    nickName?: string;
    lastUpdateTime: string;
}

export const loadHistory = (
    params: { pageNo?: number },
    options?: { showLoading?: boolean; showError?: boolean },
): Promise<ResponseVO<PaginationResultVO<VideoPlayHistory>> | null> => {
    return request<PaginationResultVO<VideoPlayHistory>>({
        url: '/history/loadHistory',
        method: 'GET',
        params,
        showLoading: options?.showLoading,
        showError: options?.showError,
    }) as Promise<ResponseVO<PaginationResultVO<VideoPlayHistory>> | null>;
};
