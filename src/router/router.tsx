import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';

import Home from '../pages/home';
import MainLayout from '../pages/layout/main-layout';

const routes = createRoutesFromElements(
    <>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
        </Route>
    </>,
);
const router = createBrowserRouter(routes);
export default router;
