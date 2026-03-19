import axios from 'axios';
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

import { toast } from '../pages/header/message';
import { useUserStore } from '../stores/useUserStore';

interface ResponseVO<T = unknown> {
    code: number;
    info: string;
    data: T;
}

interface CustomRequestConfig extends AxiosRequestConfig {
    showLoading?: boolean;
    showError?: boolean;
    errorCallback?: (data: unknown) => void;
    dataType?: 'json' | 'form';
    uploadProgressCallback?: (event: unknown) => void;
}

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8';
const contentTypeJson = 'application/json';

let loadingInstance: (() => void) | null = null;

const instance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: '/api',
    timeout: 10 * 1000,
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig & CustomRequestConfig) => {
        // 优先从 Zustand store 获取 token，Cookie 作为降级
        const token = useUserStore.getState().userInfo?.token || Cookies.get('token') || '';
        if (token) {
            config.headers.set('token', token);
        }

        if (config.showLoading) {
            loadingInstance = toast.loading('加载中...');
        }
        return config;
    },
    (error) => {
        if (loadingInstance) loadingInstance();
        toast.error('请求发送失败');
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    ((response: AxiosResponse<ResponseVO> & { config: CustomRequestConfig }) => {
        const { showLoading, errorCallback, showError = true, responseType } = response.config;

        if (showLoading && loadingInstance) {
            loadingInstance();
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

const request = <T = any>(config: CustomRequestConfig): Promise<ResponseVO<T> | null> => {
    const { url, params, dataType, responseType = 'json', ...restConfig } = config;
    let contentType = contentTypeForm;
    let requestBody: any = new FormData();
    const method = config.method ? config.method.toUpperCase() : 'POST';

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
                    toast.error(error.msg || '未知错误');
                }
                return null;
            }) as Promise<ResponseVO<T> | null>;
    }

    if (params) {
        for (const key in params) {
            requestBody.append(key, params[key] === undefined ? '' : params[key]);
        }
    }

    if (dataType === 'json') {
        contentType = contentTypeJson;
        requestBody = params;
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
            // 非 GET 请求的 params 已被消费并写入 body，这里不要再透传给 axios
            ...restConfig,
            responseType: responseType as any,
        })
        .catch((error) => {
            return Promise.reject(error);
        }) as Promise<ResponseVO<T> | null>;
};

export default request;
