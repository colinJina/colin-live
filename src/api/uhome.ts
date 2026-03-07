import request from './request';
import type { ResponseVO } from './video';

export interface UserInfoVO {
    userId: string;
    nickName?: string;
    avatar?: string;
    introduction?: string;
    signature?: string;
    fansCount?: number;
    focusCount?: number;
}
export const getUserInfo = (userId: string): Promise<ResponseVO<UserInfoVO> | null> => {
    return request<UserInfoVO>({
        url: '/uhome/getUserInfo',
        method: 'GET',
        params: {
            userId,
        },
    }) as Promise<ResponseVO<UserInfoVO> | null>;
};
