import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';

import Home from '../pages/home';
import BreadcrumbCategory from '../pages/home/components/breadcrumb-category';
import MainLayout from '../pages/layout/main-layout';
import CollectionMessage from '../pages/message/component/collection-message';
import CommentMessage from '../pages/message/component/comment';
import LikeMessage from '../pages/message/component/like-message';
import SystemMessage from '../pages/message/component/system-message';
import MessageLayout from '../pages/message/layout';
import UcenterComments from '../pages/ucenter/comments';
import UcenterDanmaku from '../pages/ucenter/danmaku';
import UcenterHome from '../pages/ucenter/home';
import UcenterArchive from '../pages/ucenter/uArchive/archive';
import UcenterUpload from '../pages/ucenter/ucenter-upload';
import UhomeLayout from '../pages/ucenter/uhome';
import UserProfile from '../pages/user';
import VideoDetailCard from '../pages/video/video-detail-card';
import History from '../pages/home/history';

const routes = createRoutesFromElements(
    <>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/video/:videoId" element={<VideoDetailCard />} />
            {/* <Route path="/v/hot" element={<Hot />} /> */}
            <Route path="/v/:categoryCode/:subCategoryCode?" element={<BreadcrumbCategory />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/history" element={<History />} />
            <Route path="/message" element={<MessageLayout />}>
                <Route index element={<Navigate to="sys" replace />} />
                <Route path="sys" element={<SystemMessage />} />
                <Route path="like" element={<LikeMessage />} />
                <Route path="collection" element={<CollectionMessage />} />
                <Route path="comment" element={<CommentMessage />} />
            </Route>
        </Route>
        <Route element={<UhomeLayout />}>
            <Route path="/ucenter/home" element={<UcenterHome />} />
            <Route path="/ucenter/upload" element={<UcenterUpload />} />
            <Route path="/ucenter/content/archives" element={<UcenterArchive />} />
            <Route path="/ucenter/interaction/comments" element={<UcenterComments />} />
            <Route path="/ucenter/interaction/danmaku" element={<UcenterDanmaku />} />
            <Route
                path="/ucenter/comment"
                element={<Navigate to="/ucenter/interaction/comments" replace />}
            />
        </Route>
    </>,
);
const router = createBrowserRouter(routes);
export default router;
