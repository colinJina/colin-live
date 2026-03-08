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
                    'h-11! rounded-[16px]! border! px-3! text-[14px]! font-semibold! shadow-none! transition-all!',
                    active
                        ? 'border-[#ffb3cb]! bg-[linear-gradient(180deg,#fff7fb_0%,#ffe8f1_100%)] text-[#e85f8f]! shadow-[0_10px_22px_rgba(251,114,153,0.16)]'
                        : 'border-[#ffd7e4]! bg-[linear-gradient(180deg,#ffffff_0%,#fff4f8_100%)] text-[#8c5a6e]! hover:-translate-y-0.5 hover:border-[#ffbdd1]! hover:bg-[linear-gradient(180deg,#fffafd_0%,#ffeff5_100%)] hover:text-[#d95a87] hover:shadow-[0_10px_22px_rgba(251,114,153,0.12)]',
                    !currentCode &&
                        'cursor-not-allowed! border-[#f4dbe4]! text-[#d8b9c6]! shadow-none!',
                )}
            >
                {category.categoryName}
            </Button>

            {children.length > 0 && currentCode && (
                <div
                    className={cn(
                        'pointer-events-none invisible absolute left-1/2 top-[calc(100%+12px)] z-40 w-max min-w-[240px] -translate-x-1/2 rounded-[22px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,250,252,0.98)_0%,rgba(255,239,246,0.98)_100%)] p-3 opacity-0 shadow-[0_22px_45px_rgba(251,114,153,0.18)] ring-1 ring-[#ffd7e4]/80 backdrop-blur-md transition-all duration-200',
                        'group-hover/category:pointer-events-auto group-hover/category:visible group-hover/category:opacity-100',
                        'group-focus-within/category:pointer-events-auto group-focus-within/category:visible group-focus-within/category:opacity-100',
                    )}
                >
                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
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
                                        'h-9! rounded-[14px]! border! px-3! text-sm! font-medium! shadow-none! transition-all!',
                                        childActive
                                            ? 'border-[#ffb3cb]! bg-[linear-gradient(180deg,#fff7fb_0%,#ffe7f0_100%)] text-[#e85f8f]'
                                            : 'border-[#ffe0ea]! bg-white/80 text-[#936175]! hover:border-[#ffc5d8]! hover:bg-[#fff5f8]! hover:text-[#d95a87]',
                                        !childCode &&
                                            'cursor-not-allowed! border-[#f4dbe4]! text-[#d8b9c6]!',
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
            <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,248,251,0.98)_0%,rgba(255,236,244,0.98)_52%,rgba(255,227,238,0.98)_100%)] p-3 shadow-[0_20px_48px_rgba(251,114,153,0.14)] ring-1 ring-[#ffd8e4]/70 md:p-4">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-36px] top-[-42px] h-24 w-24 rounded-full bg-white/60 blur-2xl" />
                    <div className="absolute right-[10%] top-4 h-16 w-16 rounded-full bg-[#ff9fbe]/30 blur-2xl" />
                    <div className="absolute bottom-[-20px] left-[18%] h-14 w-44 rounded-full bg-white/45 blur-2xl" />
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-start">
                    <button
                        type="button"
                        onClick={onHot}
                        className={cn(
                            'relative flex w-full flex-row items-center justify-center gap-3 overflow-hidden rounded-[22px] border px-4 py-3 transition-all duration-300 md:w-[112px] md:flex-col md:gap-2 md:py-4',
                            hotActive
                                ? 'border-[#ffb8cf] bg-[linear-gradient(180deg,#fff8fb_0%,#ffe6ef_100%)] text-[#e85f8f] shadow-[0_14px_26px_rgba(251,114,153,0.18)]'
                                : 'border-[#ffd8e5] bg-[linear-gradient(180deg,#ffffff_0%,#fff3f8_100%)] text-[#8c5a6e] hover:-translate-y-0.5 hover:border-[#ffc1d5] hover:shadow-[0_12px_24px_rgba(251,114,153,0.12)]',
                        )}
                    >
                        <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
                        <span
                            className={cn(
                                'flex h-11 w-11 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]',
                                hotActive
                                    ? 'bg-[linear-gradient(180deg,#ff8fb3_0%,#fb7299_100%)] text-white'
                                    : 'bg-[linear-gradient(180deg,#ffb2c9_0%,#ff8cad_100%)] text-white',
                            )}
                        >
                            <FireIcon />
                        </span>
                        <span className="text-sm font-semibold tracking-[0.08em]">热门</span>
                    </button>

                    <div className="relative flex min-w-0 flex-1 flex-col gap-3">
                        {isLoading && (
                            <div className="rounded-[20px] border border-[#ffe0ea] bg-white/75 px-4 py-4 text-sm text-[#b07b90] shadow-[0_10px_22px_rgba(251,114,153,0.08)]">
                                分类加载中...
                            </div>
                        )}
                        {isError && (
                            <div className="rounded-[20px] border border-[#ffd3df] bg-[#fff3f7] px-4 py-4 text-sm text-[#b06d85] shadow-[0_10px_22px_rgba(251,114,153,0.08)]">
                                分类加载失败，请稍后重试
                            </div>
                        )}
                        {!isLoading && !isError && topCategories.length === 0 && (
                            <div className="rounded-[20px] border border-[#ffe0ea] bg-white/75 px-4 py-4 text-sm text-[#b07b90] shadow-[0_10px_22px_rgba(251,114,153,0.08)]">
                                暂无分类数据
                            </div>
                        )}

                        {!isLoading && !isError && topCategories.length > 0 && (
                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
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
