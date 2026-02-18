import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

import { createRoot } from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
// 1. 导入 React Router 核心组件和你的路由配置
import { RouterProvider } from 'react-router-dom';
import './index.css';
import './App.css';
// 注：若 App.tsx 无额外逻辑，可直接删除 App 导入（因为路由已接管页面渲染）
// import App from './App.tsx'
import { DrawerProvider } from './provider/drawer-provider.tsx';
import router from './router/router.tsx';

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
            {/* antd 应用级上下文，包裹全局 */}
            <AntApp>
                {/* 自定义抽屉 Provider，让路由内组件可消费 */}
                <DrawerProvider>
                    {/* 2. 挂载 React Router 路由实例 */}
                    <RouterProvider router={router} />
                    {/* 若 App.tsx 有全局通用逻辑（如全局样式/兜底组件），可改为：
          <App>
            <RouterProvider router={router} />
          </App>
          */}
                </DrawerProvider>
            </AntApp>
        </ConfigProvider>
    </QueryClientProvider>,
);
