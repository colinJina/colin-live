import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
    useGetAuthorInfo,
    useLoadUhomeVideoList,
    useLoadUserCollection,
} from '../../hooks/queries/useUhome';

import UserProfileHeader from './components/user-profile-header';
import UserTabBar, { type UserMainTabKey } from './components/user-tab-bar';
import UserVideoSection, { type VideoSortKey } from './components/user-video-section';

export default function UserProfile() {
    const [activeTab, setActiveTab] = useState<UserMainTabKey>('contribute');
    const [sortKey, setSortKey] = useState<VideoSortKey>('latest');
    const [searchValue, setSearchValue] = useState('');
    const [appliedVideoNameFuzzy, setAppliedVideoNameFuzzy] = useState('');
    const { userId } = useParams();
    const resolvedUserId = userId ?? '';
    const { data: userProfielInfo } = useGetAuthorInfo(resolvedUserId);
    const orderType = sortKey === 'latest' ? 0 : sortKey === 'most_played' ? 1 : 2;

    const {
        data: videoListData,
        isLoading: isVideoListLoading,
        isError: isVideoListError,
        isFetchingNextPage: isVideoListFetchingNextPage,
        hasNextPage: isVideoListHasNextPage,
        fetchNextPage: fetchVideoListNextPage,
        refetch: refetchVideoList,
    } = useLoadUhomeVideoList({
        enabled: Boolean(resolvedUserId) && activeTab !== 'collect',
        userId: resolvedUserId,
        orderType,
        videoNameFuzzy: appliedVideoNameFuzzy || undefined,
    });

    const {
        data: collectionData,
        isLoading: isCollectionLoading,
        isError: isCollectionError,
        isFetchingNextPage: isCollectionFetchingNextPage,
        hasNextPage: isCollectionHasNextPage,
        fetchNextPage: fetchCollectionNextPage,
        refetch: refetchCollection,
    } = useLoadUserCollection({
        enabled: Boolean(resolvedUserId) && activeTab === 'collect',
        userId: resolvedUserId,
    });

    const videos = useMemo(() => {
        if (activeTab === 'collect') {
            return collectionData?.pages?.flatMap((p) => p.list) ?? [];
        }
        return videoListData?.pages?.flatMap((p) => p.list) ?? [];
    }, [activeTab, collectionData, videoListData]);

    const isLoading = activeTab === 'collect' ? isCollectionLoading : isVideoListLoading;
    const isError = activeTab === 'collect' ? isCollectionError : isVideoListError;
    const isFetchingNextPage =
        activeTab === 'collect' ? isCollectionFetchingNextPage : isVideoListFetchingNextPage;
    const hasNextPage = activeTab === 'collect' ? isCollectionHasNextPage : isVideoListHasNextPage;

    return (
        <div className="min-h-[calc(100vh-72px)] bg-[linear-gradient(160deg,#fff8fb_0%,#fff_45%,#fff4f9_100%)]">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
                <div className="space-y-3 md:space-y-4">
                    <UserProfileHeader userInfo={userProfielInfo} />

                    <UserTabBar
                        activeTab={activeTab}
                        onChangeTab={(t) => setActiveTab(t)}
                        searchValue={searchValue}
                        onChangeSearchValue={(v) => setSearchValue(v)}
                        onSearch={(v) => setAppliedVideoNameFuzzy(v.trim())}
                        sortKey={sortKey}
                        onChangeSort={(k) => setSortKey(k)}
                    />

                    <UserVideoSection
                        videos={videos}
                        isLoading={isLoading}
                        isError={isError}
                        isFetchingNextPage={isFetchingNextPage}
                        hasNextPage={hasNextPage}
                        fetchNextPage={() => {
                            if (activeTab === 'collect') {
                                void fetchCollectionNextPage();
                            } else {
                                void fetchVideoListNextPage();
                            }
                        }}
                        onRetry={() => {
                            if (activeTab === 'collect') {
                                void refetchCollection();
                            } else {
                                void refetchVideoList();
                            }
                        }}
                        emptyStateTitle={activeTab === 'collect' ? '还没有收藏视频哦~~' : undefined}
                    />
                </div>
            </div>
        </div>
    );
}
