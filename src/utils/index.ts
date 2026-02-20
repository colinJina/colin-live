import CryptoJS from 'crypto-js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * MD5 加密
 * @param str 需要加密的字符串
 */
export const md5 = (str: string): string => {
    return CryptoJS.MD5(str).toString();
};

export function getAvatarSrc(avatar: string | undefined | null) {
    if (!avatar) return '';
    // 如果已经是完整的 URL（http/https），就直接返回
    if (/^https?:\/\//i.test(avatar)) return avatar;
    // 去掉可能的前导斜杠
    const clean = avatar.replace(/^\/+/, '');
    return `/api/file/getResource?sourceName=${encodeURIComponent(clean)}`;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
