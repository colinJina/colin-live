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
    // 去掉可能的前导斜杠，并统一分隔符
    let clean = avatar.trim().replace(/^\/+/, '').replaceAll('\\', '/');
    // 如果后端返回的是已编码字符串（例如包含 %2F），先尝试解码，避免二次编码
    try {
        clean = decodeURIComponent(clean);
    } catch {
        // ignore
    }
    // 避免把路径分隔符 '/' 编成 %2F（部分后端/网关会拒绝 encoded slash）
    const encoded = clean
        .split('/')
        .filter(Boolean)
        .map((seg) => encodeURIComponent(seg))
        .join('/');
    return `/api/file/getResource?sourceName=${encoded}`;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
