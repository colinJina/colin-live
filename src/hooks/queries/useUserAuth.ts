import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { useUserCountInfo } from './useAuth';
import { useLoginModal } from '../../provider/login-modal-provider';

export default function useUserAuth() {
    const navigate = useNavigate();
    const { openLoginModal } = useLoginModal();
    const userInfo = useUserStore((state) => state.userInfo);
    const clearUserInfo = useUserStore((state) => state.clearUserInfo);

    const { data: userCountInfo } = useUserCountInfo(Boolean(userInfo));

    const handleLogout = () => {
        clearUserInfo();
        navigate('/home');
    };

    const handleLogin = () => {
        openLoginModal();
    };

    return {
        userInfo,
        userCountInfo,
        handleLogout,
        handleLogin,
        isLogin: !!userInfo,
    };
}
