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

export interface VideoInfoPost extends VideoInfo {
    /** 稿件状态 */
    status?: number;
    /** 稿件状态文案 */
    statusName?: string;
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

export interface LoadVideoListParams {
    /** -1=处理中 */
    status?: number;
    pageNo?: number;
    videoNameFuzzy?: string;
}

export const loadVideoList = (params: LoadVideoListParams) => {
    return request<PaginationResultVO<VideoInfoPost>>({
        url: '/ucenter/loadVideoList',
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
    pCommentId?: number;
    videoId?: string;
    videoUserId?: string;
    userId?: string;
    content?: string;
    avatar?: string;
    nickName?: string;
    userName?: string;
    createTime?: string;
    postTime?: string;
    likeCount?: number;
    goodCount?: number;
    hateCount?: number;
    replyCount?: number;
    imgPath?: string | null;
    replyAvatar?: string | null;
    replyNickName?: string | null;
    replyUserId?: string | null;
    topType?: number;
    videoName?: string;
    videoCover?: string;
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

export interface LoadUcenterCommentParams {
    pageNo?: number;
    videoId?: string;
}

export const loadComment = (
    params: LoadUcenterCommentParams,
): Promise<ResponseVO<PaginationResultVO<VideoComment>> | null> => {
    return request<PaginationResultVO<VideoComment>>({
        url: '/ucenter/loadComment',
        method: 'GET',
        params,
    }) as Promise<ResponseVO<PaginationResultVO<VideoComment>> | null>;
};

export const delUcenterComment = (commentId: number): Promise<ResponseVO<null> | null> => {
    return request<null>({
        url: '/ucenter/delComment',
        method: 'POST',
        params: {
            commentId,
        },
    }) as Promise<ResponseVO<null> | null>;
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

// --- API 层返回的数据结构定义 ---
export interface ApiUserAction {
    actionId: number;
    videoId: string;
    commentId: number;
    actionType: number;
}

export interface ApiComment {
    commentId: number;
    pCommentId: number;
    videoId: string;
    content: string;
    avatar: string;
    nickName: string;
    userId: string;
    likeCount: number;
    hateCount: number;
    imgPath: string | null;
    postTime: string;
    replyAvatar: string | null;
    replyNickName: string | null;
    replyUserId: string | null;
    children: ApiComment[] | null;
}

export interface ApiCommentResponseData {
    commentData: {
        totalCount: number;
        pageSize: number;
        pageNo: number;
        pageTotal: number;
        list: ApiComment[];
    };
    userActionList: ApiUserAction[];
}

export type CommentUser = {
    userId: string;
    nickName: string;
    avatar: string;
};

export type CommentData = {
    commentId: string;
    user: CommentUser;
    content: string;
    time: string;
    likes: number;
    isLiked?: boolean;
    images?: string[];
    replyTo?: CommentUser;
    replies?: CommentData[];
};

export const loadCommentApi = (
    data: LoadCommentParams,
): Promise<ResponseVO<ApiCommentResponseData> | null> => {
    return request<ApiCommentResponseData>({
        url: '/comment/loadComment',
        method: 'POST',
        data,
    });
};

export interface PostCommentParams {
    videoId: string;
    content: string;
    replyCommentId?: number;
    imgPath?: string;
}
export interface LoadCommentParams {
    videoId: string;
    orderType: number;
    pageNo?: number;
}

export const postCommentApi = (data: PostCommentParams): Promise<ResponseVO<ApiComment> | null> => {
    return request<ApiComment>({
        url: '/comment/postComment',
        method: 'POST',
        data,
    });
};

export const uploadImageApi = (file: File): Promise<ResponseVO<string> | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('createThumbnail', 'true');

    return request<string>({
        url: '/file/uploadImage',
        method: 'POST',
        data: formData,
    }) as Promise<ResponseVO<string> | null>;
};

export const postVideo = (params: Record<string, unknown>): Promise<ResponseVO<null>> => {
    return request<null>({
        url: '/ucenter/postVideo',
        method: 'POST',
        data: params,
    }) as Promise<ResponseVO<null>>;
};

export interface SaveVideoInteractionParams {
    videoId: string;
    /** 互动开关串，最长 3 */
    interaction?: string;
}

/** 更新稿件互动开关 */
export const saveVideoInteraction = (
    params: SaveVideoInteractionParams,
): Promise<ResponseVO<null> | null> => {
    return request<null>({
        url: '/ucenter/saveVideoInteraction',
        method: 'POST',
        data: params,
    }) as Promise<ResponseVO<null> | null>;
};

export interface DeleteVideoParams {
    videoId: string;
}

/** 删除稿件 */
export const deleteVideo = (params: DeleteVideoParams): Promise<ResponseVO<null> | null> => {
    return request<null>({
        url: '/ucenter/deleteVideo',
        method: 'POST',
        data: params,
    }) as Promise<ResponseVO<null> | null>;
};
