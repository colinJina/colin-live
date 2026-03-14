import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import './index.css';
import './App.css';
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
                    colorPrimary: '#fb7299',
                    colorInfo: '#fb7299',

                    fontFamily:
                        '"Noto Sans SC", "PingFang SC", "HarmonyOS_Regular", "Helvetica Neue", "Microsoft YaHei", sans-serif',

                    borderRadius: 12,

                    colorPrimaryHover: '#ff85ad',
                    colorPrimaryActive: '#e06489',

                    boxShadow: '0 4px 12px rgba(251, 114, 153, 0.15)',
                },
                components: {
                    Button: {
                        borderRadius: 20,
                        controlHeight: 32,
                        paddingInline: 20,
                        fontWeight: 600,
                        boxShadow: 'none',
                        primaryShadow: '0 4px 12px rgba(251, 114, 153, 0.2)',
                    },
                    Input: {
                        activeBorderColor: '#fb7299',
                        hoverBorderColor: '#ffb6cc',
                        activeShadow: '0 0 0 2px rgba(251, 114, 153, 0.1)',
                    },
                    Message: {
                        contentBg: '#fff9fb',
                    },
                },
            }}
        >
            <AntApp>
                <LoginModalProvider>
                    <RouterProvider router={router} />
                </LoginModalProvider>
            </AntApp>
        </ConfigProvider>
    </QueryClientProvider>,
);
