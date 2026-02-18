import CryptoJS from 'crypto-js';

/**
 * MD5 加密
 * @param str 需要加密的字符串
 */
export const md5 = (str: string): string => {
    return CryptoJS.MD5(str).toString();
};
