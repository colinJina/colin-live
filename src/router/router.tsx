import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';

import Home from '../pages/home';
import MainLayout from '../pages/layout/main-layout';
import BreadcrumbCategory from '../pages/home/components/breadcrumb-category';

const routes = createRoutesFromElements(
    <>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/v/:categoryCode" element={<BreadcrumbCategory />} />
        </Route>
    </>,
);
const router = createBrowserRouter(routes);
export default router;
