import { useMemo, useState } from 'react';

import StatisticsBar from './components/statistics-bar';
import UserTabBar, { type UserMainTabKey } from './components/user-tab-bar';
import UserProfileHeader from './components/user-profile-header';
import UserVideoSection, { type VideoSortKey } from './components/user-video-section';

export interface UserProfileProps {
    nickname?: string;
    avatarSrc?: string;
    stats?: {
        following?: number;
        followers?: number;
        likes?: number;
        plays?: number;
    };
    videos?: unknown[];
}

export default function UserProfile({
    nickname = 'laoluo',
    avatarSrc,
    stats,
    videos,
}: UserProfileProps) {
    const [activeTab, setActiveTab] = useState<UserMainTabKey>('contribute');
    const [sortKey, setSortKey] = useState<VideoSortKey>('latest');
    const [searchValue, setSearchValue] = useState('');

    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [currentNickname, setCurrentNickname] = useState(nickname);
    const [draftNickname, setDraftNickname] = useState(nickname);

    const videoList = useMemo(() => videos ?? [], [videos]);

    return (
        <div className="min-h-[calc(100vh-72px)] bg-[linear-gradient(160deg,#fff8fb_0%,#fff_45%,#fff4f9_100%)]">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
                <div className="space-y-4 md:space-y-5">
                    <UserProfileHeader
                        nickname={currentNickname}
                        avatarSrc={avatarSrc}
                        isEditingNickname={isEditingNickname}
                        draftNickname={draftNickname}
                        onStartEditNickname={() => {
                            setDraftNickname(currentNickname);
                            setIsEditingNickname(true);
                        }}
                        onCancelEditNickname={() => {
                            setDraftNickname(currentNickname);
                            setIsEditingNickname(false);
                        }}
                        onChangeDraftNickname={(v) => setDraftNickname(v)}
                        onSaveNickname={() => {
                            const next = draftNickname.trim();
                            if (next) setCurrentNickname(next);
                            setIsEditingNickname(false);
                        }}
                    />

                    <StatisticsBar
                        following={stats?.following}
                        followers={stats?.followers}
                        likes={stats?.likes}
                        plays={stats?.plays}
                    />

                    <UserTabBar
                        activeTab={activeTab}
                        onChangeTab={(t) => setActiveTab(t)}
                        searchValue={searchValue}
                        onChangeSearchValue={(v) => setSearchValue(v)}
                        onSearch={() => {
                            // 这里只保证交互逻辑完整：保留输入值 + 触发点（Enter/点击）即可
                        }}
                    />

                    <UserVideoSection
                        sortKey={sortKey}
                        onChangeSort={(k) => setSortKey(k)}
                        videos={videoList}
                    />
                </div>
            </div>
        </div>
    );
}
