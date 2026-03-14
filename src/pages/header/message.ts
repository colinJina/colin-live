import { message } from 'antd';
message.config({
    top: 100,
    duration: 2,
    maxCount: 3,
    prefixCls: 'ant-message',
});

const commonConfig = {
    className: 'custom-message',
};

export const toast = {
    success: (content: string) => {
        message.success({
            content,
            ...commonConfig,
        });
    },
    error: (content: string) => {
        message.error({
            content,
            ...commonConfig,
        });
    },
    info: (content: string) => {
        message.info({
            content,
            ...commonConfig,
        });
    },
    warning: (content: string) => {
        message.warning({
            content,
            ...commonConfig,
        });
    },
    loading: (content: string) => {
        return message.loading({
            content,
            ...commonConfig,
        });
    },
};
