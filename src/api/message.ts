import request from './request';
import type { ResponseVO } from './video';

type GetNoReadCountOptions = {
    showLoading?: boolean;
    showError?: boolean;
};

export type NoReadCountItem = {
    messageType: 1 | 2 | 3 | 4;
    messageCount: number;
};

export const getNoReadCount = (
    options?: GetNoReadCountOptions,
): Promise<ResponseVO<number> | null> => {
    return request<number>({
        url: '/message/getNoReadCount',
        method: 'GET',
        showLoading: options?.showLoading,
        showError: options?.showError,
    }) as Promise<ResponseVO<number> | null>;
};

export const getNoReadCountGroup = (
    options?: GetNoReadCountOptions,
): Promise<ResponseVO<NoReadCountItem[]> | null> => {
    return request<NoReadCountItem[]>({
        url: '/message/getNoReadCountGroup',
        method: 'GET',
        showLoading: options?.showLoading,
        showError: options?.showError,
    }) as Promise<ResponseVO<NoReadCountItem[]> | null>;
};

export const readAllMessage = (
    data?: { messageType?: number },
    options?: GetNoReadCountOptions,
): Promise<ResponseVO<null> | null> => {
    return request<null>({
        url: '/message/readAll',
        method: 'POST',
        data,
        showLoading: options?.showLoading,
        showError: options?.showError,
    }) as Promise<ResponseVO<null> | null>;
};

export type MessageExtendDto = {
    messageContent: string;
    messageContentReply: string;
    auditStatus: number | null;
};

export type MessageItem = {
    messageId: number;
    userId: string;
    videoId: string;
    messageType: number;
    sendUserId: string;
    createTime: string;
    extendDto: MessageExtendDto;
    extendJson: string;
    readType: number;
    sendUserAvatar: string | null;
    sendUserName: string;
    videoCover: string;
    videoName: string;
};

export type MessageListResponse = {
    totalCount: number;
    pageSize: number;
    pageNo: number;
    pageTotal: number;
    list: MessageItem[];
};

export const getMessageList = (
    data: { pageNo: number; messageType: number },
    options?: GetNoReadCountOptions,
): Promise<ResponseVO<MessageListResponse> | null> => {
    return request<MessageListResponse>({
        url: '/message/loadMessage',
        method: 'POST',
        data,
        showLoading: options?.showLoading,
        showError: options?.showError,
    }) as Promise<ResponseVO<MessageListResponse> | null>;
};
