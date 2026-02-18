import Cookies from 'js-cookie';
import { create } from 'zustand';

interface UserInfo {
    userId: string;
    nickName: string;
    avatar: string;
    token: string;
    expireAt: number;
}

interface UserState {
    userInfo: UserInfo | null;
    setUserInfo: (info: UserInfo) => void;
    clearUserInfo: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    // 初始化时从 Cookie 恢复 token（刷新页面不丢失）
    userInfo: (() => {
        const token = Cookies.get('token');
        const expireAt = Cookies.get('expireAt');
        if (token && expireAt) {
            return {
                userId: Cookies.get('userId') || '',
                nickName: Cookies.get('nickName') || '',
                avatar: Cookies.get('avatar') || '',
                token,
                expireAt: Number(expireAt),
            };
        }
        return null;
    })(),

    setUserInfo: (info: UserInfo) => {
        const expires = new Date(info.expireAt);
        // 同步写入 Cookie 持久化
        Cookies.set('token', info.token, { expires });
        Cookies.set('expireAt', String(info.expireAt), { expires });
        Cookies.set('userId', info.userId, { expires });
        Cookies.set('nickName', info.nickName, { expires });
        Cookies.set('avatar', info.avatar, { expires });
        set({ userInfo: info });
    },

    clearUserInfo: () => {
        Cookies.remove('token');
        Cookies.remove('expireAt');
        Cookies.remove('userId');
        Cookies.remove('nickName');
        Cookies.remove('avatar');
        set({ userInfo: null });
    },
}));
