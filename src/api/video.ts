import request from './request';

export interface VideoInfo {
    // 视频ID
    videoId: string;
    // 视频封面地址
    videoCover?: string;
    // 视频名称
    videoName?: string;
    // 用户ID
    userId?: string;
    // 创建时间
    createTime?: string;
    // 最后更新时间
    lastUpdateTime?: string;
    // 父分类ID
    pCategoryId?: number;
    // 分类ID
    categoryId?: number;
    // 发布类型
    postType?: number;
    // 来源信息
    originInfo?: string;
    // 标签
    tags?: string;
    // 视频简介
    introduction?: string;
    // 互动信息（预留字段）
    interaction?: unknown;
    // 视频时长（秒）
    duration?: number;
    // 播放量
    playCount?: number;
    // 点赞数
    likeCount?: number;
    // 弹幕数
    danmuCount?: number;
    // 评论数
    commentCount?: number;
    // 投币数
    coinCount?: number;
    // 收藏数
    collectCount?: number;
    // 推荐类型
    recommendType?: number;
    // 最后播放时间
    lastPlayTime?: string;
    // 用户昵称
    nickName?: string;
    // 用户头像
    avatar?: string;
    // 分类全称
    categoryFullName?: string;
}

export interface PaginationResultVO<T> {
    totalCount: number;
    pageSize: number;
    pageNo: number;
    pageTotal: number;
    list: T[];
}

export interface LoadVideoParams {
    pCategoryId?: number;
    categoryId?: number;
    pageNo?: number;
}

export const loadVideo = (params: LoadVideoParams) => {
    return request<PaginationResultVO<VideoInfo>>({
        url: '/video/loadVideo',
        method: 'GET',
        params,
    });
};

export interface ResponseVO<T = unknown> {
    code: number;
    info: string;
    data: T;
}

export interface VideoInfoFile {
    fileId: string;
    fileIndex: number;
    fileName: string;
    title?: string;
    duration?: number;
}

export interface UserAction {
    actionType: number;
    actionCount?: number;
}

export interface VideoInfoResultVo {
    videoInfo: VideoInfo;
    userActionList: UserAction[];
}

export interface VideoComment {
    commentId: number | string;
    content?: string;
    avatar?: string;
    nickName?: string;
    userName?: string;
    createTime?: string;
    postTime?: string;
    likeCount?: number;
    goodCount?: number;
    replyCount?: number;
}

export interface VideoDanmu {
    danmuId: number | string;
    text?: string;
    content?: string;
    color?: string;
    mode?: 'ltr' | 'rtl' | 'top' | 'bottom' | number | string;
    time?: number;
    videoTime?: number;
    showTime?: number;
    createTime?: string;
    postTime?: string;
    nickName?: string;
    userName?: string;
}

export interface PostDanmuParams {
    videoId: string;
    fileId: string;
    text: string;
    mode: number;
    color: string;
    time: number;
}

export const loadRecommendVideo = (): Promise<ResponseVO<VideoInfo[]> | null> => {
    return request<VideoInfo[]>({
        url: '/video/loadRecommendVideo',
        method: 'GET',
    }) as Promise<ResponseVO<VideoInfo[]> | null>;
};

export const loadVideoPList = (videoId: string): Promise<ResponseVO<VideoInfoFile[]> | null> => {
    return request<VideoInfoFile[]>({
        url: '/video/loadVideoPList',
        method: 'GET',
        params: {
            videoId,
        },
    }) as Promise<ResponseVO<VideoInfoFile[]> | null>;
};

export const getVideoInfo = (videoId: string): Promise<ResponseVO<VideoInfoResultVo> | null> => {
    return request<VideoInfoResultVo>({
        url: '/video/getVideoInfo',
        method: 'GET',
        params: {
            videoId,
        },
    }) as Promise<ResponseVO<VideoInfoResultVo> | null>;
};

export const loadComment = (
    videoId: string,
    pageNo = 1,
): Promise<ResponseVO<PaginationResultVO<VideoComment>> | null> => {
    return request<PaginationResultVO<VideoComment>>({
        url: '/ucenter/loadComment',
        method: 'GET',
        params: {
            pageNo,
            videoId,
        },
    }) as Promise<ResponseVO<PaginationResultVO<VideoComment>> | null>;
};

export const loadDanmu = (
    fileId: string,
    videoId: string,
): Promise<ResponseVO<PaginationResultVO<VideoDanmu>> | null> => {
    return request<PaginationResultVO<VideoDanmu>>({
        url: '/danmu/loadDanmu',
        method: 'GET',
        params: {
            fileId,
            videoId,
        },
    }) as Promise<ResponseVO<PaginationResultVO<VideoDanmu>> | null>;
};

export const postDanmu = (params: PostDanmuParams): Promise<ResponseVO<null> | null> => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    return request<null>({
        url: '/danmu/postDanmu',
        method: 'POST',
        data: formData,
    }) as Promise<ResponseVO<null> | null>;
};

export interface DoActionParams {
    videoId: string;
    actionType: number;
    actionCount?: number;
    commentId?: number;
}

export const doAction = (params: DoActionParams): Promise<ResponseVO<null> | null> => {
    return request<null>({
        url: '/userAction/doAction',
        method: 'POST',
        data: params,
    }) as Promise<ResponseVO<null> | null>;
};
