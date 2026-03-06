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
    interaction?: any;
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
