import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { CategoryInfo } from '../../../api/category';
import { useAllCategory } from '../../../hooks/queries/useCategory';
import { cn } from '../../../utils';

import VideoCardPage from './video-card-page';

function getActiveCode(rawCode?: string) {
    if (!rawCode) return '';
    try {
        return decodeURIComponent(rawCode);
    } catch {
        return rawCode;
    }
}

function findParentByCode(categories: CategoryInfo[], parentCode: string) {
    if (!parentCode) return undefined;
    return categories.find((c) => c.categoryCode === parentCode);
}

function findChildByCode(parent: CategoryInfo | undefined, childCode: string) {
    if (!parent || !childCode) return undefined;
    return (parent.children ?? []).find((c) => c.categoryCode === childCode);
}

export default function BreadcrumbCategory() {
    const navigate = useNavigate();
    const { categoryCode, subCategoryCode } = useParams();
    const activeParentCode = getActiveCode(categoryCode);
    const activeChildCode = getActiveCode(subCategoryCode);

    const { data: categories, isLoading, isError } = useAllCategory();
    const activeParent = useMemo(
        () => findParentByCode(categories ?? [], activeParentCode),
        [categories, activeParentCode],
    );
    const activeChild = useMemo(
        () => findChildByCode(activeParent, activeChildCode),
        [activeParent, activeChildCode],
    );
    const pCategoryId = activeParent?.categoryId;
    const categoryId = activeChild?.categoryId;

    const onCrumbHome = () => navigate('/home');
    const onCrumbParent = () => {
        if (!activeParent?.categoryCode) return;
        navigate(`/v/${encodeURIComponent(activeParent.categoryCode)}`);
    };

    if (isLoading) {
        return (
            <section className="mt-3 rounded-2xl bg-white/95 p-3 shadow-[0_10px_35px_rgba(24,25,28,0.06)] ring-1 ring-black/5 md:p-4">
                <div className="rounded-xl bg-[#f7f8fa] px-4 py-4 text-sm text-[#9499a0]">
                    分类加载中...
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="mt-3 rounded-2xl bg-white/95 p-3 shadow-[0_10px_35px_rgba(24,25,28,0.06)] ring-1 ring-black/5 md:p-4">
                <div className="rounded-xl bg-[#fff2f5] px-4 py-4 text-sm text-[#9499a0]">
                    分类加载失败，请稍后重试
                </div>
            </section>
        );
    }

    return (
        <section className="mt-3 rounded-2xl bg-white/95 p-3 shadow-[0_10px_35px_rgba(24,25,28,0.06)] ring-1 ring-black/5 md:p-4">
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button
                        type="button"
                        onClick={onCrumbHome}
                        className="rounded-lg px-2 py-1 font-medium text-[#61666d] hover:bg-black/4 hover:text-[#18191c]"
                    >
                        首页
                    </button>
                    <span className="text-[#c9ccd1]">/</span>
                    <span className="rounded-lg px-2 py-1 font-medium text-[#9499a0]">分类</span>

                    {activeParent && (
                        <>
                            <span className="text-[#c9ccd1]">/</span>
                            <button
                                type="button"
                                onClick={onCrumbParent}
                                className={cn(
                                    'rounded-lg px-2 py-1 font-medium transition-colors',
                                    activeChild
                                        ? 'text-[#61666d] hover:bg-black/4 hover:text-[#18191c]'
                                        : 'bg-[#fff2f5] text-bili-pink',
                                )}
                            >
                                {activeParent.categoryName}
                            </button>
                        </>
                    )}

                    {activeChild && (
                        <>
                            <span className="text-[#c9ccd1]">/</span>
                            <span className="rounded-lg bg-[#fff2f5] px-2 py-1 font-medium text-bili-pink">
                                {activeChild.categoryName}
                            </span>
                        </>
                    )}
                </div>

                <VideoCardPage pCategoryId={pCategoryId} categoryId={categoryId} />
            </div>
        </section>
    );
}
