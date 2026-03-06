import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';

import Home from '../pages/home';
import BreadcrumbCategory from '../pages/home/components/breadcrumb-category';
import MainLayout from '../pages/layout/main-layout';
import VideoDetailCard from '../pages/video/video-detail-card';

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
    </>,
);
const router = createBrowserRouter(routes);
export default router;
