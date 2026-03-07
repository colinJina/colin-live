import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import LoginModal from '../pages/header/login-modal';
import { useUserStore } from '../stores/useUserStore';

type LoginModalContextValue = {
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextValue | undefined>(undefined);

export const useLoginModal = () => {
    const context = useContext(LoginModalContext);
    if (!context) {
        throw new Error('useLoginModal must be used within a LoginModalProvider');
    }
    return context;
};

export function LoginModalProvider({ children }: { children: ReactNode }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const userInfo = useUserStore((state) => state.userInfo);

    useEffect(() => {
        return useUserStore.subscribe((state, previousState) => {
            if (state.userInfo && !previousState.userInfo) {
                setIsLoginModalOpen(false);
            }
        });
    }, []);

    const value = useMemo(
        () => ({
            isLoginModalOpen,
            openLoginModal: () => setIsLoginModalOpen(true),
            closeLoginModal: () => setIsLoginModalOpen(false),
        }),
        [isLoginModalOpen],
    );

    return (
        <LoginModalContext.Provider value={value}>
            {children}
            <LoginModal isOpen={isLoginModalOpen && !userInfo} onCancel={value.closeLoginModal} />
        </LoginModalContext.Provider>
    );
}
