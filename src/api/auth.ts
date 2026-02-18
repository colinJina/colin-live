import request from './request';

export interface CheckCodeResponse {
    checkCode: string; // Base64 image
    checkCodeKey: string; // Verification key
}

export interface LoginAccountRequest {
    // * `email` (String, Required)
    // * `password` (String, Required)
    // * `checkCodeKey` (String, Required)
    // * `checkCode` (String, Required)
    email: string;
    password: string;
    checkCodeKey: string;
    checkCode: string;
}

export interface LoginAccountResponse {
    userId: string;
    nickName: string;
    avatar: string;
    expireAt: number;
    token: string;
}

export const getCheckCode = () => {
    return request<CheckCodeResponse>({
        url: '/account/checkCode',
        method: 'GET',
    });
};

export const loginAccount = (data: LoginAccountRequest) => {
    return request<LoginAccountResponse>({
        url: '/account/login',
        method: 'POST',
        data,
    });
};
