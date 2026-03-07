import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import './index.css';
import './App.css';
import { DrawerProvider } from './provider/drawer-provider.tsx';
import { LoginModalProvider } from './provider/login-modal-provider.tsx';
import router from './router/router.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <ConfigProvider
            theme={{
                token: {
                    fontFamily:
                        '"Noto Sans SC", "PingFang SC", "HarmonyOS_Regular", "Helvetica Neue", "Microsoft YaHei", sans-serif',
                },
            }}
        >
            <AntApp>
                <DrawerProvider>
                    <LoginModalProvider>
                        <RouterProvider router={router} />
                    </LoginModalProvider>
                </DrawerProvider>
            </AntApp>
        </ConfigProvider>
    </QueryClientProvider>,
);
