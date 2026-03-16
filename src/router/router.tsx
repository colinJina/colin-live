import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';

import Home from '../pages/home';
import BreadcrumbCategory from '../pages/home/components/breadcrumb-category';
import MainLayout from '../pages/layout/main-layout';
import VideoDetailCard from '../pages/video/video-detail-card';
import UhomeLayout from '../pages/ucenter/uhome';
import UcenterHome from '../pages/ucenter/home';
import UcenterUpload from '../pages/ucenter/ucenter-upload';
import UcenterArchive from '../pages/ucenter/archive';
import UcenterComments from '../pages/ucenter/comments';
import UcenterDanmaku from '../pages/ucenter/danmaku';

const routes = createRoutesFromElements(
    <>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/video/:videoId" element={<VideoDetailCard />} />
            {/* <Route path="/v/hot" element={<Hot />} /> */}
            <Route path="/v/:categoryCode/:subCategoryCode?" element={<BreadcrumbCategory />} />
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
