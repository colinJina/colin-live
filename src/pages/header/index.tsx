import { Input } from 'antd';
import { useState } from 'react';
import HeaderUploadButton from '../../component/headerUploadButton';
import LoginModal from './login-modal';
import Collect from '@/assets/icon/collect.svg?react';
import CreateCenter from '@/assets/icon/create-center.svg?react';
import History from '@/assets/icon/history.svg?react';
import Message from '@/assets/icon/message.svg?react';
import defaultAvatar from '@/assets/icon/user.svg';
import Zhuzhan from '@/assets/icon/zhuzhan.svg?react';
import bgImage from '@/assets/images/banner_bg.png';
import { useUserCountInfo } from '../../hooks/queries/useAuth';
import { useUserStore } from '../../stores/useUserStore';
import { cn, getAvatarSrc } from '../../utils';
import CategoryModule from '../home/components/category-module';

const { Search } = Input;
const renderCount = (value?: number) => (typeof value === 'number' ? value : '--');

export default function LayoutHeader() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const userInfo = useUserStore((state) => state.userInfo);
    const clearUserInfo = useUserStore((state) => state.clearUserInfo);
    const { data: userCountInfo } = useUserCountInfo(Boolean(userInfo));
    // 退出登录的处理函数
    const handleMenuClick = (item: string) => {
        if (item === '退出登录') {
            clearUserInfo();
            // 可选：退出后跳转到首页或弹出提示
            console.log('用户已登出');
        } else {
            console.log(`跳转到: ${item}`);
        }
    };
    return (
        <>
            <div
                className="relative w-full h-[180px] bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute top-0 left-0 right-0 z-40 flex justify-between items-center h-16 px-6 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-[2px]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 cursor-pointer group">
                            <Zhuzhan className="w-5 h-5 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                            <span className="text-white text-[15px] font-medium drop-shadow-md">
                                首页
                            </span>
                        </div>
                    </div>

                    {/* 中间：搜索框（保持 Antd 原样） */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-50">
                        <Search
                            placeholder="input search text"
                            onSearch={(v) => console.log(v)}
                            style={{ width: 400 }}
                        />
                    </div>

                    {/* 右侧：用户操作区 */}
                    <div className="flex items-center gap-6">
                        {/* 用户头像与悬浮卡片 */}
                        <div className="relative group/user py-2">
                            <div
                                className={cn(
                                    'cursor-pointer transition-all duration-500 ease-out z-50 relative',
                                    userInfo &&
                                        'group-hover/user:translate-y-6 group-hover/user:scale-[1.8]',
                                )}
                                onClick={() => !userInfo && setIsLoginModalOpen(true)}
                            >
                                <img
                                    src={userInfo ? getAvatarSrc(userInfo.avatar) : defaultAvatar}
                                    className="w-9 h-9 rounded-full border border-white shadow-lg object-cover bg-white"
                                    alt="avatar"
                                />
                            </div>

                            {/* 悬浮面板：仅在已登录时显示 */}
                            {userInfo && (
                                <div
                                    className="absolute top-14 left-1/2 -translate-x-1/2 w-72 bg-white rounded-xl shadow-2xl 
                                opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible 
                                transition-all duration-300 translate-y-4 group-hover/user:translate-y-0 p-4 pt-10 ring-1 ring-black/5"
                                >
                                    <div className="text-center font-bold text-lg text-slate-800 mb-4">
                                        {userInfo.nickName}
                                    </div>

                                    <div className="flex justify-around border-b border-slate-100 pb-4 mb-4 text-center">
                                        <div className="cursor-pointer hover:text-blue-500 transition-colors">
                                            <div className="font-bold text-slate-700 text-sm">
                                                {renderCount(userCountInfo?.focusCount)}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-light">
                                                关注
                                            </div>
                                        </div>
                                        <div className="cursor-pointer hover:text-blue-500 transition-colors border-x border-slate-100 px-6">
                                            <div className="font-bold text-slate-700 text-sm">
                                                {renderCount(userCountInfo?.fansCount)}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-light">
                                                粉丝
                                            </div>
                                        </div>
                                        <div className="cursor-pointer hover:text-blue-500 transition-colors">
                                            <div className="font-bold text-slate-700 text-sm">
                                                {renderCount(userCountInfo?.currentCoinCount)}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-light">
                                                硬币
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        {['个人中心', '投稿管理', '退出登录'].map((item) => (
                                            <div
                                                key={item}
                                                onClick={() => handleMenuClick(item)} // 绑定点击事件
                                                className={`px-4 py-2 rounded-lg cursor-pointer text-[13px] transition-colors
                                                   ${
                                                       item === '退出登录'
                                                           ? 'hover:bg-red-50 text-red-500/80' // 退出登录项可以稍微特别一点
                                                           : 'hover:bg-slate-50 text-slate-600'
                                                   }`}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 未登录时的 User 图标展示 */}
                            {!userInfo && <div className="hidden"> {/* 逻辑占位 */} </div>}
                        </div>
                        <NavIcon Icon={Message} label="消息" />
                        <NavIcon Icon={Collect} label="收藏" />
                        <NavIcon Icon={History} label="历史" />
                        <NavIcon Icon={CreateCenter} label="创作中心" />

                        {/* 投稿按钮 */}
                        <div className="cursor-pointer hover:opacity-90 active:scale-95 transition-all">
                            <HeaderUploadButton onClick={() => console.log('upload')} />
                        </div>
                    </div>
                </div>

                <LoginModal
                    isOpen={isLoginModalOpen && !userInfo}
                    onCancel={() => setIsLoginModalOpen(false)}
                />
            </div>
            <CategoryModule />
        </>
    );
}

// 提取图标组件
function NavIcon({ Icon, label }: { Icon: any; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center cursor-pointer group/icon">
            <Icon className="w-5 h-5 text-white drop-shadow-md group-hover/icon:-translate-y-1 transition-transform duration-300" />
            <span className="text-white text-[11px] mt-1 opacity-95 font-light drop-shadow-sm">
                {label}
            </span>
        </div>
    );
}
