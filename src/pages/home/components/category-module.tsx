import { Button } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CategoryInfo } from '../../../api/category';
import { useAllCategory } from '../../../hooks/queries/useCategory';
import { cn } from '../../../utils';
import { FireIcon } from './fireIcon';

function getActiveCode(rawCode?: string) {
    if (!rawCode) {
        return '';
    }
    try {
        return decodeURIComponent(rawCode);
    } catch {
        return rawCode;
    }
}

function toTopCategories(categories: CategoryInfo[]) {
    return categories.filter((item) => item.categoryName).slice(0, 20);
}

type CategoryItemProps = {
    category: CategoryInfo;
    activeCode: string;
    onNavigateParent: (code: string) => void;
    onNavigateChild: (parentCode: string, childCode: string) => void;
};

const CategoryItem = memo(function CategoryItem({
    category,
    activeCode,
    onNavigateParent,
    onNavigateChild,
}: CategoryItemProps) {
    const currentCode = category.categoryCode;
    const children = (category.children ?? []).filter((item) => item.categoryName);
    const isChildActive = children.some(
        (item) => item.categoryCode && item.categoryCode === activeCode,
    );
    const active = Boolean((currentCode && currentCode === activeCode) || isChildActive);

    return (
        <div key={category.categoryId} className="group/category relative">
            <Button
                block
                type="text"
                onClick={() => currentCode && onNavigateParent(currentCode)}
                disabled={!currentCode}
                className={cn(
                    'h-10! rounded-[10px]! border! text-[15px]! font-medium! transition-colors!',
                    active
                        ? 'border-bili-pink! bg-[#fff2f5]! text-bili-pink!'
                        : 'border-transparent! bg-[#f1f2f4]! text-[#61666d]! hover:bg-[#e8e9ed]! hover:text-[#18191c]!',
                    !currentCode && 'cursor-not-allowed! text-[#c9ccd1]!',
                )}
            >
                {category.categoryName}
            </Button>

            {children.length > 0 && currentCode && (
                <div
                    className={cn(
                        'pointer-events-none invisible absolute left-1/2 top-[calc(100%+8px)] z-40 w-max min-w-[220px] -translate-x-1/2 rounded-xl border border-black/5 bg-white p-3 opacity-0 shadow-[0_10px_24px_rgba(24,25,28,0.12)] transition-all duration-200',
                        'group-hover/category:pointer-events-auto group-hover/category:visible group-hover/category:opacity-100',
                        'group-focus-within/category:pointer-events-auto group-focus-within/category:visible group-focus-within/category:opacity-100',
                    )}
                >
                    <div className="grid grid-cols-2 gap-2">
                        {children.map((child) => {
                            const childCode = child.categoryCode;
                            const childActive = Boolean(childCode && childCode === activeCode);
                            return (
                                <Button
                                    key={child.categoryId}
                                    block
                                    type="text"
                                    onClick={() =>
                                        childCode && onNavigateChild(currentCode, childCode)
                                    }
                                    disabled={!childCode}
                                    className={cn(
                                        'h-9! rounded-[8px]! border! px-3! text-sm! font-medium! transition-colors!',
                                        childActive
                                            ? 'border-bili-pink! bg-[#fff2f5]! text-bili-pink!'
                                            : 'border-transparent! bg-[#f1f2f4]! text-[#61666d]! hover:bg-[#e8e9ed]! hover:text-[#18191c]!',
                                        !childCode && 'cursor-not-allowed! text-[#c9ccd1]!',
                                    )}
                                >
                                    {child.categoryName}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
});

export default function CategoryModule() {
    const { categoryCode } = useParams();
    const navigate = useNavigate();
    const { data: categories, isLoading, isError } = useAllCategory();
    const topCategories = useMemo(() => toTopCategories(categories ?? []), [categories]);
    const activeCode = getActiveCode(categoryCode);
    const hotActive = activeCode === 'hot';

    const onHot = useCallback(() => navigate('/v/hot'), [navigate]);
    const onNavigateParent = useCallback(
        (code: string) => navigate(`/v/${encodeURIComponent(code)}`),
        [navigate],
    );
    const onNavigateChild = useCallback(
        (parentCode: string, childCode: string) =>
            navigate(`/v/${encodeURIComponent(parentCode)}/${encodeURIComponent(childCode)}`),
        [navigate],
    );

    return (
        <div className="mx-auto w-full">
            <section className="rounded-2xl bg-white/95 p-3 shadow-[0_10px_35px_rgba(24,25,28,0.06)] ring-1 ring-black/5 md:p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start">
                    <button
                        type="button"
                        onClick={onHot}
                        className={cn(
                            'flex w-full flex-row items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 transition-all duration-200 md:w-[108px] md:flex-col md:gap-1 md:py-3',
                            hotActive
                                ? 'bg-[#fff2f5] text-bili-pink'
                                : 'bg-[#f7f8fa] text-[#61666d] hover:bg-[#f1f2f4]',
                        )}
                    >
                        <span
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full',
                                hotActive ? 'bg-bili-pink text-white' : 'bg-[#ff7f8f] text-white',
                            )}
                        >
                            <FireIcon />
                        </span>
                        <span className="text-sm font-medium">热门</span>
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                        {isLoading && (
                            <div className="rounded-xl bg-[#f7f8fa] px-4 py-4 text-sm text-[#9499a0]">
                                分类加载中...
                            </div>
                        )}
                        {isError && (
                            <div className="rounded-xl bg-[#fff2f5] px-4 py-4 text-sm text-[#9499a0]">
                                分类加载失败，请稍后重试
                            </div>
                        )}
                        {!isLoading && !isError && topCategories.length === 0 && (
                            <div className="rounded-xl bg-[#f7f8fa] px-4 py-4 text-sm text-[#9499a0]">
                                暂无分类数据
                            </div>
                        )}

                        {!isLoading && !isError && topCategories.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
                                {topCategories.map((category) => (
                                    <CategoryItem
                                        key={category.categoryId}
                                        category={category}
                                        activeCode={activeCode}
                                        onNavigateParent={onNavigateParent}
                                        onNavigateChild={onNavigateChild}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
