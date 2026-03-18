import { useState } from 'react';

import UserTabBar, { type UserMainTabKey } from './components/user-tab-bar';
import UserProfileHeader from './components/user-profile-header';
import UserVideoSection, { type VideoSortKey } from './components/user-video-section';
import { useGetAuthorInfo } from '../../hooks/queries/useUhome';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
    const [activeTab, setActiveTab] = useState<UserMainTabKey>('contribute');
    const [sortKey, setSortKey] = useState<VideoSortKey>('latest');
    const [searchValue, setSearchValue] = useState('');
    const { userId } = useParams();
    const { data: userProfielInfo } = useGetAuthorInfo(userId ?? '');

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
                        onSearch={() => {}}
                        sortKey={sortKey}
                        onChangeSort={(k) => setSortKey(k)}
                    />

                    {/* 视频内容区 */}
                    <UserVideoSection />
                </div>
            </div>
        </div>
    );
}
