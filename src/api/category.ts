import request from './request';

export interface CategoryInfo {
    categoryId: number;
    categoryCode: string;
    categoryName: string;
    pCategoryId: number;
    icon?: string;
    background?: string;
    sort?: number;
    children?: CategoryInfo[];
}

export const loadAllCategory = () => {
    return request<CategoryInfo[]>({
        url: '/category/loadAllCategory',
        method: 'GET',
    });
};
