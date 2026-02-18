import { message as AntdMessage } from 'antd';
import axios from 'axios';
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

import { useUserStore } from '../stores/useUserStore';

// 初始化配置（模拟 element-plus offset: 200）
AntdMessage.config({
    top: 200,
    duration: 2,
});

const showMessage = (
    msg: string,
    callback: (() => void) | undefined,
    type: 'success' | 'warning' | 'error',
) => {
    AntdMessage[type](msg, 2, () => {
        if (callback) {
            callback();
        }
    });
};

const message = {
    error: (msg: string, callback?: () => void) => {
        showMessage(msg, callback, 'error');
    },
    success: (msg: string, callback?: () => void) => {
        showMessage(msg, callback, 'success');
    },
    warning: (msg: string, callback?: () => void) => {
        showMessage(msg, callback, 'warning');
    },
    loading: AntdMessage.loading, // 保留 loading 供 request 内部使用
};

// 扩展 AxiosRequestConfig 以支持自定义属性
interface CustomRequestConfig extends AxiosRequestConfig {
    showLoading?: boolean;
    showError?: boolean;
    errorCallback?: (data: unknown) => void;
    dataType?: 'json' | 'form';
    uploadProgressCallback?: (event: unknown) => void;
}

// 统一返回结构
interface ResponseVO<T = unknown> {
    code: number;
    info: string;
    data: T;
}

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8';
const contentTypeJson = 'application/json';

// 用于控制 antd 的全局 loading
// 注意：antd 的全局 loading 通常通过渲染一个全局组件实现，
// 这里使用 message.loading 来模拟 Element 的服务式调用
let loadingInstance: (() => void) | null = null;

const instance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: '/api',
    timeout: 10 * 1000,
});

// 请求前拦截器 - 统一注入 token
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig & CustomRequestConfig) => {
        // 优先从 Zustand store 获取 token，Cookie 作为降级
        const token = useUserStore.getState().userInfo?.token || Cookies.get('token') || '';
        if (token) {
            config.headers.set('token', token);
        }

        if (config.showLoading) {
            // 使用 antd 的 message 模拟加载状态
            loadingInstance = message.loading({
                content: '加载中...',
                duration: 0, // 不自动关闭
            });
        }
        return config;
    },
    (error) => {
        if (loadingInstance) loadingInstance();
        message.error('请求发送失败');
        return Promise.reject(error);
    },
);

// 请求后拦截器
instance.interceptors.response.use(
    ((response: AxiosResponse<ResponseVO> & { config: CustomRequestConfig }) => {
        const { showLoading, errorCallback, showError = true, responseType } = response.config;

        if (showLoading && loadingInstance) {
            loadingInstance(); // 调用返回的函数关闭 message
        }

        const responseData = response.data;

        // 处理二进制数据
        if (responseType === 'arraybuffer' || responseType === 'blob') {
            return responseData;
        }

        // 业务逻辑处理
        if (responseData.code === 200) {
            return responseData;
        } else if (responseData.code === 901) {
            // 登录超时处理逻辑
            // 这里建议触发 React 全局状态（如 Zustand 或 Context）显示登录弹窗
            // window.dispatchEvent(new CustomEvent('login-timeout'));
            console.warn('登录超时，请重新登录');
            return Promise.reject({ showError: false, code: 901 });
        } else {
            if (errorCallback) {
                errorCallback(responseData);
            }
            return Promise.reject({
                showError: showError,
                msg: responseData.info || '业务异常',
            });
        }
    }) as any,
    (error) => {
        if (loadingInstance) loadingInstance();
        return Promise.reject({ showError: true, msg: '网络异常', error });
    },
);

/**
 * 核心请求函数
 */
const request = <T = any>(config: CustomRequestConfig): Promise<ResponseVO<T> | null> => {
    const { url, params, dataType, responseType = 'json' } = config;

    // 默认处理为 FormData
    let contentType = contentTypeForm;
    let requestBody: any = new FormData();
    const method = config.method ? config.method.toUpperCase() : 'POST';

    // 对于 GET 请求，参数直接放到 params 中，不需要构建 requestBody
    if (method === 'GET') {
        const headers = {
            'Content-Type': contentTypeJson,
            'X-Requested-With': 'XMLHttpRequest',
        };
        return instance
            .get(url!, {
                ...config,
                params: params,
                headers: headers,
                responseType: responseType as any,
            })
            .catch((error) => {
                if (error.showError) {
                    message.error(error.msg || '未知错误');
                }
                return null;
            }) as Promise<ResponseVO<T> | null>;
    }

    if (params) {
        for (const key in params) {
            requestBody.append(key, params[key] === undefined ? '' : params[key]);
        }
    }

    // 如果指定为 JSON 格式
    if (dataType === 'json') {
        contentType = contentTypeJson;
        requestBody = params; // 直接使用对象
    }
    const headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
    };

    return instance
        .request({
            url: url!,
            method: method,
            data: requestBody,
            headers: headers,
            onUploadProgress: (event) => {
                if (config.uploadProgressCallback) {
                    config.uploadProgressCallback(event);
                }
            },
            ...config,
            responseType: responseType as any,
        })
        .catch((error) => {
            return Promise.reject(error);
        }) as Promise<ResponseVO<T> | null>;
};

export default request;
