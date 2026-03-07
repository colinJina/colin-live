import request from './request';
import type { ResponseVO } from './video';

export interface UserInfoVO {
    userId?: string;
    nickName?: string;
    avatar?: string;
    /** 个人简介 */
    personIntroduction?: string;
    /** 粉丝数 */
    fansCount?: number;
    /** 关注数 */
    focusCount?: number;
    /** 是否已关注 (关键字段) */
    haveFocus?: boolean;
    /** 播放总量 */
    playCount?: number;
    /** 获赞数量 */
    likeCount?: number;
    /** 性别: 0-未知, 1-男, 2-女 */
    sex?: number;
    /** 生日 */
    birthday?: string;
    /** 学校 */
    school?: string;
    /** 公告信息 */
    noticeInfo?: string;
    /** 等级 */
    grade?: number;
    /** 主题设置 */
    theme?: number;
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

export const focusUser = (focusUserId: string): Promise<ResponseVO<null> | null> => {
    return request<null>({
        url: '/uhome/focus',
        method: 'POST',
        data: { focusUserId },
    }) as Promise<ResponseVO<null> | null>;
};

export const cancelFocusUser = (focusUserId: string): Promise<ResponseVO<null>> => {
    return request<null>({
        url: '/uhome/cancelFocus',
        method: 'POST',
        data: { focusUserId },
    }) as Promise<ResponseVO<null>>;
};
