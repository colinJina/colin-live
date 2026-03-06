import CryptoJS from 'crypto-js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn'; // 引入中文语言包

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
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

/**
 * C端时间格式化工具
 * @param dateStr 后端返回的时间字符串 "2024-08-03 21:25:55"
 */
export const formatVideoTime = (dateStr: string): string => {
    if (!dateStr) return '';
    // 兼容 iOS Safari 的处理：将 "-" 替换为 "/"
    const date = dayjs(dateStr.replace(/-/g, '/'));
    const now = dayjs();

    const diffMinutes = now.diff(date, 'minute');
    const diffHours = now.diff(date, 'hour');

    // 1. 一分钟内 -> 刚刚
    if (diffMinutes < 1) {
        return '刚刚';
    }
    // 2. 一小时内 -> X分钟前
    if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
    }
    // 3. 24小时内 -> X小时前
    if (diffHours < 24) {
        return `${diffHours}小时前`;
    }
    // 4. 昨天 -> 昨天 21:25
    if (now.subtract(1, 'day').isSame(date, 'day')) {
        return `昨天 ${date.format('HH:mm')}`;
    }
    // 5. 今年内 -> 08-03
    if (now.isSame(date, 'year')) {
        return date.format('MM-DD');
    }
    // 6. 跨年 -> 2024-08-03
    return date.format('YYYY-MM-DD');
};

/**
 * 将时长（秒）转换为 C 端展示格式 (mm:ss 或 HH:mm:ss)
 * @param duration 秒数或可转为数字的字符串
 */
export function formatDuration(duration: number | string | undefined): string {
    if (!duration) return '00:00';

    const totalSeconds = Math.floor(Number(duration));
    if (isNaN(totalSeconds) || totalSeconds <= 0) return '00:00';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 补零函数
    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
        // 超过 1 小时，展示格式：01:12:30
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
        // 不足 1 小时，展示格式：05:20
        return `${pad(minutes)}:${pad(seconds)}`;
    }
}
